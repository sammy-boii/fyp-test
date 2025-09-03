import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      action,
      channelId,
      message,
      embedTitle,
      embedDescription,
      embedColor,
      botToken
    } = body

    if (!botToken) {
      return NextResponse.json(
        { success: false, error: 'Bot token is required' },
        { status: 400 }
      )
    }

    if (!channelId) {
      return NextResponse.json(
        { success: false, error: 'Channel ID is required' },
        { status: 400 }
      )
    }

    if (action === 'send_message') {
      if (!message) {
        return NextResponse.json(
          { success: false, error: 'Message content is required' },
          { status: 400 }
        )
      }

      // Make Discord API call to send message
      const response = await fetch(
        `https://discord.com/api/v10/channels/${channelId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bot ${botToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: message
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        let errorMessage = errorData.message || response.statusText

        // Provide more helpful error messages
        if (response.status === 403) {
          errorMessage =
            'Bot lacks permissions. Check: 1) Bot has "Send Messages" permission 2) Bot role is above channel permissions 3) Channel allows bot access'
        } else if (response.status === 401) {
          errorMessage = 'Invalid bot token. Please check your bot token'
        } else if (response.status === 404) {
          errorMessage =
            'Channel not found. Check your channel ID and ensure bot is in the server'
        }

        return NextResponse.json(
          { success: false, error: `Discord API error: ${errorMessage}` },
          { status: response.status }
        )
      }

      const result = await response.json()

      return NextResponse.json({
        success: true,
        data: {
          messageId: result.id,
          channelId: channelId,
          content: message,
          sentAt: new Date().toISOString()
        }
      })
    }

    if (action === 'send_embed') {
      if (!message || !embedTitle || !embedDescription) {
        return NextResponse.json(
          {
            success: false,
            error: 'Message, embed title, and description are required'
          },
          { status: 400 }
        )
      }

      // Make Discord API call to send embed
      const response = await fetch(
        `https://discord.com/api/v10/channels/${channelId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bot ${botToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: message,
            embeds: [
              {
                title: embedTitle,
                description: embedDescription,
                color: parseInt(embedColor?.replace('#', '') || '5865F2', 16),
                timestamp: new Date().toISOString()
              }
            ]
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        let errorMessage = errorData.message || response.statusText

        if (response.status === 403) {
          errorMessage =
            'Bot lacks permissions. Check: 1) Bot has "Send Messages" and "Embed Links" permissions 2) Bot role is above channel permissions'
        }

        return NextResponse.json(
          { success: false, error: `Discord API error: ${errorMessage}` },
          { status: response.status }
        )
      }

      const result = await response.json()

      return NextResponse.json({
        success: true,
        data: {
          messageId: result.id,
          channelId: channelId,
          embedTitle: embedTitle,
          embedDescription: embedDescription,
          sentAt: new Date().toISOString()
        }
      })
    }

    if (action === 'get_channel_messages') {
      // Make Discord API call to get channel messages
      const response = await fetch(
        `https://discord.com/api/v10/channels/${channelId}/messages?limit=10`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bot ${botToken}`
          }
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        let errorMessage = errorData.message || response.statusText

        if (response.status === 403) {
          errorMessage =
            'Bot lacks permissions. Check: 1) Bot has "Read Message History" permission 2) Bot role is above channel permissions'
        }

        return NextResponse.json(
          { success: false, error: `Discord API error: ${errorMessage}` },
          { status: response.status }
        )
      }

      const messages = await response.json()

      return NextResponse.json({
        success: true,
        data: {
          channelId: channelId,
          messages: messages.map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            author: msg.author.username,
            timestamp: msg.timestamp
          }))
        }
      })
    }

    return NextResponse.json(
      { success: false, error: `Unsupported Discord action: ${action}` },
      { status: 400 }
    )
  } catch (error) {
    console.error('Discord API proxy error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
