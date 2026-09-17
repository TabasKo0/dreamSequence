import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: settings } = await supabase.from('ctf_settings').select('team_leave_enabled').eq('id', 1).single()
    if (settings && settings.team_leave_enabled === false) {
      return NextResponse.json({ error: 'Leaving or modifying team rosters is currently disabled.' }, { status: 403 })
    }

    const { error: rpcError } = await supabase.rpc('leave_team')

    if (rpcError) {
      if (rpcError.message.includes('Owner cannot leave')) {
        return NextResponse.json({ error: 'Owner cannot leave. You must delete the team instead.' }, { status: 400 })
      }
      if (rpcError.message.includes('User is not in a team')) {
        return NextResponse.json({ error: 'You are not currently in a team.' }, { status: 400 })
      }
      return NextResponse.json({ error: rpcError.message || 'Failed to leave team.' }, { status: 400 })
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
