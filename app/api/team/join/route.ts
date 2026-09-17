import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: settings } = await supabase.from('ctf_settings').select('team_join_enabled').eq('id', 1).single()
    if (settings && settings.team_join_enabled === false) {
      return NextResponse.json({ error: 'Joining teams is currently disabled.' }, { status: 403 })
    }

    const { join_token } = await request.json()
    if (!join_token || typeof join_token !== 'string') {
      return NextResponse.json({ error: 'Join token is required.' }, { status: 400 })
    }

    const { data: teamId, error: rpcError } = await supabase.rpc('join_team', {
      p_join_token: join_token.trim()
    })

    if (rpcError) {
      if (rpcError.message === 'Invalid join token') {
        return NextResponse.json({ error: 'Invalid or expired team token.' }, { status: 404 })
      }
      if (rpcError.message === 'User is already in a team') {
        return NextResponse.json({ error: 'You are already in a team.' }, { status: 400 })
      }
      return NextResponse.json({ error: rpcError.message || 'Failed to join team.' }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      message: 'Successfully joined the team.',
      teamId: teamId
    })

  } catch (error) {
    console.error('Error in /api/team/join:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
