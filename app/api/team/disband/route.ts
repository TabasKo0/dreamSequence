import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('[Team Disband] Auth user error:', userError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Get caller's current team
    const { data: callerProfile, error: profileError } = await supabase
      .from('users')
      .select('team_id')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('[Team Disband] Failed to fetch caller profile:', profileError)
      return NextResponse.json({
        error: `Failed to fetch profile: ${profileError.message}`,
        details: profileError.details,
        code: profileError.code
      }, { status: 500 })
    }

    if (!callerProfile?.team_id) {
      return NextResponse.json({ error: 'You are not currently in a team.' }, { status: 400 })
    }

    const teamId = callerProfile.team_id

    // 2. Check if caller is the owner and check the team's score
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('owner_id, score')
      .eq('id', teamId)
      .single()

    if (teamError) {
      console.error('[Team Disband] Failed to fetch team:', teamError)
      return NextResponse.json({
        error: `Team not found or error fetching team: ${teamError.message}`,
        details: teamError.details,
        code: teamError.code
      }, { status: 404 })
    }

    if (!team) {
      return NextResponse.json({ error: 'Team not found.' }, { status: 404 })
    }

    if (team.owner_id !== user.id) {
      return NextResponse.json({ error: 'Only the team owner can disband the team.' }, { status: 403 })
    }

    // 3. CRITICAL SAFETY CHECK: Cannot disband a team that has scored
    if (team.score > 0) {
      return NextResponse.json({ error: 'Cannot disband a team that has already scored points.' }, { status: 400 })
    }

    // Check if team disbanding is enabled in ctf_settings
    const { data: ctfSettings } = await supabase
      .from('ctf_settings')
      .select('team_disband_enabled')
      .eq('id', 1)
      .single()

    if (ctfSettings && ctfSettings.team_disband_enabled === false) {
      return NextResponse.json({ error: 'Team disbanding is currently disabled by the organizers.' }, { status: 403 })
    }

    // 4. Disband the team: set team_id = null for all members
    const { error: membersUpdateError } = await supabase
      .from('users')
      .update({ team_id: null })
      .eq('team_id', teamId)

    if (membersUpdateError) {
      console.error('[Team Disband] Failed to clear team members:', {
        message: membersUpdateError.message,
        details: membersUpdateError.details,
        hint: membersUpdateError.hint,
        code: membersUpdateError.code,
      })
      console.error('[Team Disband] Full error:', membersUpdateError)
      return NextResponse.json({
        error: `Failed to clear team members: ${membersUpdateError.message}`,
        details: membersUpdateError.details,
        hint: membersUpdateError.hint,
        code: membersUpdateError.code
      }, { status: 500 })
    }

    // 5. Delete the team
    const { error: deleteError } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId)

    if (deleteError) {
      console.error('[Team Disband] Failed to delete team:', {
        message: deleteError.message,
        details: deleteError.details,
        hint: deleteError.hint,
        code: deleteError.code,
      })
      console.error('[Team Disband] Full error:', deleteError)
      return NextResponse.json({
        error: `Failed to delete the team: ${deleteError.message}`,
        details: deleteError.details,
        hint: deleteError.hint,
        code: deleteError.code
      }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      message: 'Team disbanded successfully.'
    })

  } catch (error: any) {
    console.error('Error in /api/team/disband:', error)
    return NextResponse.json({
      error: `Internal Server Error: ${error?.message || error || 'Unknown error'}`
    }, { status: 500 })
  }
}
