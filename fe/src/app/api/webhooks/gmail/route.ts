import { NextRequest, NextResponse } from 'next/server'

// Gmail webhook endpoint
// Configure this URL in Google Cloud Console > Gmail API > Push Notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('BODY', body)

    // Gmail sends a verification token on initial setup
    if (body.type === 'verification') {
      const verificationToken = process.env.GMAIL_VERIFICATION_TOKEN
      if (body.token === verificationToken) {
        return NextResponse.json({ success: true })
      }
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 403 }
      )
    }

    // Handle actual Gmail notifications
    if (body.type === 'new_email') {
      const { emailData } = body

      // Here you would trigger your workflow
      // For now, we'll just log and return success
      console.log('New Gmail received:', {
        from: emailData.from,
        subject: emailData.subject,
        timestamp: new Date().toISOString()
      })

      // TODO: Trigger workflow execution
      // await triggerWorkflow('gmail_trigger', emailData)

      return NextResponse.json({
        success: true,
        message: 'Gmail webhook processed',
        triggered: true
      })
    }

    return NextResponse.json({ success: true, message: 'Webhook received' })
  } catch (error) {
    console.error('Gmail webhook error:', error)
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const challenge = searchParams.get('challenge')

  if (challenge) {
    // Return the challenge for webhook verification
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ message: 'Gmail webhook endpoint' })
}
