import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { targetUserId } = await request.json()
    if (!targetUserId || typeof targetUserId !== 'string') {
      return NextResponse.json({ error: 'Target user ID is required.' }, { status: 400 })
    }

    const { error: rpcError } = await supabase.rpc('kick_team_member', { target_user_id: targetUserId })

    if (rpcError) {
      return NextResponse.json({ error: rpcError.message || 'Failed to kick the member. Please try again.' }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      message: 'Member kicked successfully.'
    })

  } catch (error) {
    console.error('Error in /api/team/kick:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
