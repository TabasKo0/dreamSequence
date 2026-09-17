import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ success: false, status: 'error', message: 'User ID is required.' }, { status: 400 })
    }

    // Call the secure RPC function to verify privileges and fetch participant data
    const { data: participantData, error: rpcError } = await supabase.rpc('scan_participant', { 
      p_scanned_user_id: userId 
    })

    if (rpcError) {
      const msg = rpcError.message || ''
      if (msg.includes('Unauthorized')) {
        return NextResponse.json({ success: false, status: 'error', message: 'Unauthorized' }, { status: 401 })
      }
      if (msg.includes('Forbidden')) {
        return NextResponse.json({ success: false, status: 'error', message: 'Forbidden. You lack scanning privileges.' }, { status: 403 })
      }
      if (msg.includes('not found')) {
        return NextResponse.json({ success: false, status: 'error', message: msg }, { status: 404 })
      }
      return NextResponse.json({ success: false, status: 'error', message: msg }, { status: 500 })
    }

    // Forward the request to Google Sheets App Script Web App
    const sheetsUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL
    if (!sheetsUrl) {
      console.error("Missing GOOGLE_SHEETS_WEBAPP_URL")
      return NextResponse.json({ success: false, status: 'error', message: 'Server configuration error.' }, { status: 500 })
    }

    const sheetsResponse = await fetch(sheetsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: process.env.SHEETS_SECRET_KEY,
        reg_no: participantData.reg_no,
        email: participantData.email
      })
    })

    if (!sheetsResponse.ok) {
      console.error(`Google Sheets sync failed with status ${sheetsResponse.status}`)
      return NextResponse.json({ success: false, status: 'error', message: 'Failed to communicate with attendance system.' }, { status: 500 })
    }

    const sheetsData = await sheetsResponse.json()
    
    // Return the exact response from Apps Script, plus the reg_no
    return NextResponse.json({
      ...sheetsData,
      reg_no: participantData.reg_no
    })

  } catch (error) {
    console.error('Error in /api/scanner/attendance:', error)
    return NextResponse.json({ success: false, status: 'error', message: 'Internal Server Error' }, { status: 500 })
  }
}
