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

    const { data: settings } = await supabase.from('ctf_settings').select('team_creation_enabled').eq('id', 1).single()
    if (settings && settings.team_creation_enabled === false) {
      return NextResponse.json({ error: 'Team creation is currently disabled by the organizers.' }, { status: 403 })
    }

    const { name } = await request.json()
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Team name is required.' }, { status: 400 })
    }

    const joinToken = crypto.randomBytes(16).toString('hex')

    const { data: teamId, error: rpcError } = await supabase.rpc('create_team', {
      p_name: name.trim(),
      p_join_token: joinToken
    })

    if (rpcError) {
      if (rpcError.code === '23505') {
        return NextResponse.json({ error: 'Team name is already taken.' }, { status: 400 })
      }
      if (rpcError.message === 'User is already in a team') {
        return NextResponse.json({ error: 'You are already in a team.' }, { status: 400 })
      }
      return NextResponse.json({ error: rpcError.message || 'Failed to create team.' }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      message: 'Team created successfully.',
      teamId: teamId,
      joinToken
    })

  } catch (error) {
    console.error('Error in /api/team/create:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}