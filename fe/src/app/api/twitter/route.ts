import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, username, count, bearerToken } = body

    if (!bearerToken) {
      return NextResponse.json(
        { success: false, error: 'Bearer token is required' },
        { status: 400 }
      )
    }

    let url = ''
    let params = ''

    if (action === 'get_timeline') {
      url = 'https://api.twitter.com/2/tweets/search/recent'
      params = `?query=from:followed_user&max_results=${count}`
    } else if (action === 'get_trending') {
      url = 'https://api.twitter.com/2/tweets/search/recent'
      params = `?query=trending&max_results=${count}`
    } else if (action === 'get_user_tweets') {
      if (!username) {
        return NextResponse.json(
          { success: false, error: 'Username is required for user tweets' },
          { status: 400 }
        )
      }

      // First get user ID from username
      const userResponse = await fetch(
        `https://api.twitter.com/2/users/by/username/${username}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${bearerToken}`
          }
        }
      )

      if (!userResponse.ok) {
        const errorData = await userResponse.json()
        return NextResponse.json(
          {
            success: false,
            error: `Twitter API error: ${
              errorData.detail || userResponse.statusText
            }`
          },
          { status: userResponse.status }
        )
      }

      const userResult = await userResponse.json()
      const userId = userResult.data.id

      // Then get user's tweets
      const tweetsResponse = await fetch(
        `https://api.twitter.com/2/users/${userId}/tweets?max_results=${count}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${bearerToken}`
          }
        }
      )

      if (!tweetsResponse.ok) {
        const errorData = await tweetsResponse.json()
        return NextResponse.json(
          {
            success: false,
            error: `Twitter API error: ${
              errorData.detail || tweetsResponse.statusText
            }`
          },
          { status: tweetsResponse.status }
        )
      }

      const tweetsResult = await tweetsResponse.json()

      return NextResponse.json({
        success: true,
        data: {
          action: 'user_tweets',
          username: username,
          userId: userId,
          tweets: tweetsResult.data || [],
          count: tweetsResult.data?.length || 0,
          retrievedAt: new Date().toISOString()
        }
      })
    } else {
      return NextResponse.json(
        { success: false, error: `Unsupported Twitter action: ${action}` },
        { status: 400 }
      )
    }

    // For timeline and trending actions
    const response = await fetch(`${url}${params}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        {
          success: false,
          error: `Twitter API error: ${errorData.detail || response.statusText}`
        },
        { status: response.status }
      )
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      data: {
        action: action,
        tweets: result.data || [],
        count: result.data?.length || 0,
        retrievedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Twitter API proxy error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
