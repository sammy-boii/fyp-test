import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      provider,
      model,
      prompt,
      apiKey,
      maxTokens = 1000,
      temperature = 0.7
    } = body

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key is required' },
        { status: 400 }
      )
    }

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      )
    }

    let response
    let result

    switch (provider) {
      case 'openai':
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: maxTokens,
            temperature
          })
        })
        break

      case 'anthropic':
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model,
            max_tokens: maxTokens,
            temperature,
            messages: [{ role: 'user', content: prompt }]
          })
        })
        break

      case 'google':
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: prompt }]
                }
              ],
              generationConfig: {
                maxOutputTokens: maxTokens,
                temperature
              }
            })
          }
        )
        break

      case 'groq':
        response = await fetch(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model,
              messages: [{ role: 'user', content: prompt }],
              max_tokens: maxTokens,
              temperature
            })
          }
        )
        break

      default:
        return NextResponse.json(
          { success: false, error: `Unsupported AI provider: ${provider}` },
          { status: 400 }
        )
    }

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        {
          success: false,
          error: `AI API error: ${
            errorData.error?.message || response.statusText
          }`
        },
        { status: response.status }
      )
    }

    result = await response.json()

    // Parse response based on provider
    let aiResponse = ''
    switch (provider) {
      case 'openai':
      case 'groq':
        aiResponse = result.choices?.[0]?.message?.content || 'No response'
        break
      case 'anthropic':
        aiResponse = result.content?.[0]?.text || 'No response'
        break
      case 'google':
        aiResponse =
          result.candidates?.[0]?.content?.parts?.[0]?.text || 'No response'
        break
    }

    return NextResponse.json({
      success: true,
      data: {
        provider,
        model,
        prompt,
        response: aiResponse,
        usage: result.usage || {},
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('AI API proxy error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
