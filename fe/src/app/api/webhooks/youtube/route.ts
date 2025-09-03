import { NextRequest, NextResponse } from 'next/server'

// YouTube webhook endpoint
// Configure this URL in Google Cloud Console > YouTube Data API > Push Notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // YouTube sends different types of notifications
    if (body.type === 'video_uploaded') {
      const { videoData } = body

      console.log('New YouTube video uploaded:', {
        videoId: videoData.videoId,
        title: videoData.title,
        channelId: videoData.channelId,
        channelTitle: videoData.channelTitle,
        publishedAt: videoData.publishedAt
      })

      // TODO: Trigger workflow execution
      // await triggerWorkflow('youtube_trigger', videoData)

      return NextResponse.json({
        success: true,
        message: 'YouTube webhook processed',
        triggered: true
      })
    }

    if (body.type === 'channel_update') {
      const { channelData } = body

      console.log('YouTube channel updated:', {
        channelId: channelData.channelId,
        title: channelData.title,
        updatedAt: new Date().toISOString()
      })

      return NextResponse.json({
        success: true,
        message: 'YouTube channel webhook processed'
      })
    }

    return NextResponse.json({
      success: true,
      message: 'YouTube webhook received'
    })
  } catch (error) {
    console.error('YouTube webhook error:', error)
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
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ message: 'YouTube webhook endpoint' })
}
