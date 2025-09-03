import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, query, channelId, maxResults = 10, accessToken } = body

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Access token is required' },
        { status: 400 }
      )
    }

    const base = 'https://www.googleapis.com/youtube/v3'

    if (action === 'search_videos') {
      if (!query) {
        return NextResponse.json(
          { success: false, error: 'Query is required for search' },
          { status: 400 }
        )
      }

      const url = `${base}/search?part=snippet&type=video&maxResults=${Math.min(
        maxResults,
        50
      )}&q=${encodeURIComponent(query)}`

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      if (!response.ok) {
        const errorData = await response.json()
        return NextResponse.json(
          {
            success: false,
            error: `YouTube API error: ${
              errorData.error?.message || response.statusText
            }`
          },
          { status: response.status }
        )
      }

      const result = await response.json()
      return NextResponse.json({
        success: true,
        data: {
          action: 'search_videos',
          query,
          items: (result.items || []).map((item: any) => ({
            id: item.id?.videoId,
            title: item.snippet?.title,
            channelTitle: item.snippet?.channelTitle,
            publishedAt: item.snippet?.publishedAt,
            thumbnail: item.snippet?.thumbnails?.default?.url
          }))
        }
      })
    }

    if (action === 'get_channel_videos') {
      if (!channelId) {
        return NextResponse.json(
          { success: false, error: 'channelId is required' },
          { status: 400 }
        )
      }

      const url = `${base}/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=${Math.min(
        maxResults,
        50
      )}`

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      if (!response.ok) {
        const errorData = await response.json()
        return NextResponse.json(
          {
            success: false,
            error: `YouTube API error: ${
              errorData.error?.message || response.statusText
            }`
          },
          { status: response.status }
        )
      }

      const result = await response.json()
      return NextResponse.json({
        success: true,
        data: {
          action: 'get_channel_videos',
          channelId,
          items: (result.items || []).map((item: any) => ({
            id: item.id?.videoId,
            title: item.snippet?.title,
            publishedAt: item.snippet?.publishedAt,
            thumbnail: item.snippet?.thumbnails?.default?.url
          }))
        }
      })
    }

    return NextResponse.json(
      { success: false, error: `Unsupported YouTube action: ${action}` },
      { status: 400 }
    )
  } catch (error) {
    console.error('YouTube API proxy error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
