import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 0. Check CTF Settings
    const { data: settings } = await supabase.from('ctf_settings').select('team_creation_enabled').eq('id', 1).single()
    if (settings && settings.team_creation_enabled === false) {
      return NextResponse.json({ error: 'Team creation is currently disabled by the organizers.' }, { status: 403 })
    }

    const { name } = await request.json()
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Team name is required.' }, { status: 400 })
    }

    // 1. "Already in a Team" Guard
    const { data: callerProfile, error: profileError } = await supabase
      .from('users')
      .select('team_id')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Database Error (fetch profile):', profileError)
      return NextResponse.json({ error: `Backend Error (Profile): ${profileError.message}` }, { status: 500 })
    }

    if (callerProfile.team_id) {
      return NextResponse.json({ error: 'You are already in a team. Leave your current team first.' }, { status: 400 })
    }

    // 2. Join Token Formatting
    const joinToken = crypto.randomBytes(16).toString('hex')

    // 3. Unique Constraint Error Handling for Team Name
    const { data: newTeam, error: insertError } = await supabase
      .from('teams')
      .insert({
        name: name.trim(),
        join_token: joinToken,
        owner_id: user.id
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('Database Error (insert team):', insertError)
      // 23505 is the PostgreSQL error code for unique_violation
      if (insertError.code === '23505') {
        return NextResponse.json({ error: 'Team name is already taken.' }, { status: 400 })
      }
      return NextResponse.json({ error: insertError.message || 'Failed to create team.' }, { status: 400 })
    }

    // Update caller's team_id
    const { error: updateError } = await supabase
      .from('users')
      .update({ team_id: newTeam.id })
      .eq('id', user.id)

    if (updateError) {
      console.error('Database Error (update user team_id):', updateError)
      return NextResponse.json({ error: updateError.message || 'Failed to assign team to creator.' }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      message: 'Team created successfully.',
      teamId: newTeam.id,
      joinToken
    })

  } catch (error) {
    console.error('Error in /api/team/create:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
