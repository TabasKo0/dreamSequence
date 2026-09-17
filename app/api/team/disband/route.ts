import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: settings } = await supabase.from('ctf_settings').select('team_disband_enabled').eq('id', 1).single()
    if (settings && settings.team_disband_enabled === false) {
      return NextResponse.json({ error: 'Team disbanding is currently disabled by the organizers.' }, { status: 403 })
    }

    const { teamId } = await request.json()
    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required.' }, { status: 400 })
    }

    const { error: rpcError } = await supabase.rpc('delete_team', { p_team_id: teamId })

    if (rpcError) {
      if (rpcError.message.includes('Only the team owner can delete')) {
        return NextResponse.json({ error: 'Only the team owner can delete the team.' }, { status: 403 })
      }
      if (rpcError.message.includes('Team not found')) {
        return NextResponse.json({ error: 'Team not found.' }, { status: 404 })
      }
      return NextResponse.json({ error: rpcError.message || 'Failed to disband team.' }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      message: 'Team disbanded successfully.'
    })

  } catch (error) {
    console.error('Error in /api/team/disband:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
