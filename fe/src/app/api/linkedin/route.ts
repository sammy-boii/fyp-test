import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, authorUrn, text, accessToken } = body

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Access token is required' },
        { status: 400 }
      )
    }

    const base = 'https://api.linkedin.com/v2'

    if (action === 'create_post') {
      if (!authorUrn || !text) {
        return NextResponse.json(
          { success: false, error: 'authorUrn and text are required' },
          { status: 400 }
        )
      }

      // Share on behalf of a person or organization (UGC Post)
      const response = await fetch(`${base}/ugcPosts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          author: authorUrn, // e.g., 'urn:li:person:xxxx' or 'urn:li:organization:xxxx'
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: { text },
              shareMediaCategory: 'NONE'
            }
          },
          visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        return NextResponse.json(
          {
            success: false,
            error: `LinkedIn API error: ${
              errorData.message || response.statusText
            }`
          },
          { status: response.status }
        )
      }

      const result = await response.json()
      return NextResponse.json({
        success: true,
        data: { action: 'create_post', result }
      })
    }

    if (action === 'get_profile_posts') {
      if (!authorUrn) {
        return NextResponse.json(
          { success: false, error: 'authorUrn is required' },
          { status: 400 }
        )
      }

      // Fetch recent posts by author (UGC Posts)
      const response = await fetch(
        `${base}/ugcPosts?q=authors&authors=List(${encodeURIComponent(
          authorUrn
        )})&sortBy=LAST_MODIFIED&count=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0'
          }
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        return NextResponse.json(
          {
            success: false,
            error: `LinkedIn API error: ${
              errorData.message || response.statusText
            }`
          },
          { status: response.status }
        )
      }

      const result = await response.json()
      return NextResponse.json({
        success: true,
        data: { action: 'get_profile_posts', result }
      })
    }

    return NextResponse.json(
      { success: false, error: `Unsupported LinkedIn action: ${action}` },
      { status: 400 }
    )
  } catch (error) {
    console.error('LinkedIn API proxy error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
