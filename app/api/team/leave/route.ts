import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 0. Check CTF Settings
    const { data: settings } = await supabase.from('ctf_settings').select('team_leave_enabled').eq('id', 1).single()
    if (settings && settings.team_leave_enabled === false) {
      return NextResponse.json({ error: 'Leaving or modifying team rosters is currently disabled.' }, { status: 403 })
    }

    // 1. Get caller's current team
    const { data: callerProfile, error: profileError } = await supabase
      .from('users')
      .select('team_id')
      .eq('id', user.id)
      .single()

    if (profileError || !callerProfile?.team_id) {
      return NextResponse.json({ error: 'You are not currently in a team.' }, { status: 400 })
    }

    const teamId = callerProfile.team_id

    // 2. Check if caller is the owner
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('owner_id')
      .eq('id', teamId)
      .single()

    if (teamError || !team) {
      return NextResponse.json({ error: 'Team not found.' }, { status: 404 })
    }

    if (team.owner_id === user.id) {
      return NextResponse.json({ error: 'As the team owner, you cannot leave. You must disband the team.' }, { status: 400 })
    }



    // 3. Leave the team
    const { error: updateError } = await supabase
      .from('users')
      .update({ team_id: null })
      .eq('id', user.id)

    if (updateError) {
      console.error('Database Error (leave team):', updateError)
      return NextResponse.json({ error: updateError.message || 'Failed to leave the team. Please try again.' }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      message: 'Successfully left the team.'
    })

  } catch (error) {
    console.error('Error in /api/team/leave:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
