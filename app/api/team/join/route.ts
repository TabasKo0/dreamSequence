import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MAX_TEAM_SIZE = 4

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 0. Check CTF Settings
    const { data: settings } = await supabase.from('ctf_settings').select('team_join_enabled').eq('id', 1).single()
    if (settings && settings.team_join_enabled === false) {
      return NextResponse.json({ error: 'Joining teams is currently disabled.' }, { status: 403 })
    }

    const { join_token } = await request.json()
    if (!join_token || typeof join_token !== 'string') {
      return NextResponse.json({ error: 'Join token is required.' }, { status: 400 })
    }

    // 1. "Already in a Team" Guard
    const { data: callerProfile, error: profileError } = await supabase
      .from('users')
      .select('team_id')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: 'Failed to fetch user profile.' }, { status: 500 })
    }

    if (callerProfile.team_id) {
      return NextResponse.json({ error: 'You are already in a team. Leave your current team first.' }, { status: 400 })
    }

    // 2. Look up the team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id, name')
      .eq('join_token', join_token)
      .single()

    if (teamError || !team) {
      return NextResponse.json({ error: 'Invalid join token or team not found.' }, { status: 404 })
    }

    // 3. Team Size Hard Cap Check (dynamically queries max_team_size from ctf_settings)
    const { data: ctfSettings } = await supabase
      .from('ctf_settings')
      .select('max_team_size')
      .eq('id', 1)
      .single()

    const maxCap = ctfSettings?.max_team_size ?? MAX_TEAM_SIZE

    const { count, error: countError } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('team_id', team.id)

    if (countError) {
      console.error('Database Error (count team members):', countError)
      return NextResponse.json({
        error: countError.message || 'Failed to verify team capacity.',
        details: countError.details,
        code: countError.code
      }, { status: 500 })
    }

    if (count !== null && count >= maxCap) {
      return NextResponse.json({ error: 'This team has reached the maximum allowed size.' }, { status: 403 })
    }

    // 4. Join the team
    const { error: updateError } = await supabase
      .from('users')
      .update({ team_id: team.id })
      .eq('id', user.id)

    if (updateError) {
      console.error('Database Error (join team update):', updateError)
      return NextResponse.json({
        error: updateError.message || 'Failed to join the team. Please try again.',
        details: updateError.details,
        code: updateError.code
      }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      message: `Successfully joined ${team.name}.`,
      teamId: team.id
    })

  } catch (error) {
    console.error('Error in /api/team/join:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
