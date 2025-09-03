// API utilities for Gmail and Google Drive integration
// Note: In a real application, these would be server-side API routes for security

interface GmailMessage {
  id: string
  threadId: string
}

interface GmailMessageDetail {
  id: string
  threadId: string
  payload?: {
    headers?: Array<{
      name: string
      value: string
    }>
  }
  snippet?: string
}

interface GmailMessagesResponse {
  messages?: GmailMessage[]
}

export interface GmailConfig {
  action: 'send' | 'read' | 'search'
  recipient?: string
  subject?: string
  message?: string
  searchQuery?: string
  accessToken: string
}

export interface GoogleDriveConfig {
  action: 'upload' | 'download' | 'list' | 'search' | 'create_folder'
  fileName?: string
  fileContent?: string
  folderId?: string
  searchQuery?: string
  accessToken: string
}

export interface DiscordConfig {
  action: 'send_message' | 'send_embed' | 'get_channel_messages'
  channelId?: string
  message?: string
  embedTitle?: string
  embedDescription?: string
  embedColor?: string
  botToken?: string
}

export interface TwitterConfig {
  action: 'get_timeline' | 'get_trending' | 'get_user_tweets'
  username?: string
  count?: number
  bearerToken?: string
}

export interface YouTubeConfig {
  action: 'search_videos' | 'get_channel_videos'
  query?: string
  channelId?: string
  maxResults?: number
  accessToken?: string
}

export interface LinkedInConfig {
  action: 'create_post' | 'get_profile_posts'
  authorUrn?: string
  text?: string
  accessToken?: string
}

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'google' | 'groq'
  model: string
  prompt: string
  apiKey: string
  maxTokens?: number
  temperature?: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

// Gmail API functions
export async function sendGmailEmail(
  config: GmailConfig
): Promise<ApiResponse> {
  try {
    if (!config.accessToken) {
      throw new Error('Access token is required')
    }

    if (config.action === 'send') {
      if (!config.recipient || !config.subject || !config.message) {
        throw new Error(
          'Recipient, subject, and message are required for sending emails'
        )
      }

      // Create email message in base64 format (Gmail API requirement)
      const emailContent = [
        `To: ${config.recipient}`,
        `Subject: ${config.subject}`,
        '',
        config.message
      ].join('\n')

      const base64Email = btoa(emailContent)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')

      // Make actual Gmail API call
      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            raw: base64Email
          })
        }
      )

      if (!response.ok) {
        const errorData: { error?: { message?: string } } =
          await response.json()
        throw new Error(
          `Gmail API error: ${errorData.error?.message || response.statusText}`
        )
      }

      const result: { id: string } = await response.json()

      return {
        success: true,
        data: {
          messageId: result.id,
          recipient: config.recipient,
          subject: config.subject,
          sentAt: new Date().toISOString()
        }
      }
    }

    if (config.action === 'read') {
      // Make actual Gmail API call to list messages
      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${config.accessToken}`
          }
        }
      )

      if (!response.ok) {
        const errorData: { error?: { message?: string } } =
          await response.json()
        throw new Error(
          `Gmail API error: ${errorData.error?.message || response.statusText}`
        )
      }

      const messages: GmailMessagesResponse = await response.json()

      // Get details for each message
      const emailDetails = await Promise.all(
        messages.messages?.slice(0, 5).map(async (msg: GmailMessage) => {
          const detailResponse = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
            {
              headers: {
                Authorization: `Bearer ${config.accessToken}`
              }
            }
          )

          if (detailResponse.ok) {
            const detail: GmailMessageDetail = await detailResponse.json()
            const headers = detail.payload?.headers || []
            const subject =
              headers.find((h) => h.name === 'Subject')?.value || 'No Subject'
            const from =
              headers.find((h) => h.name === 'From')?.value || 'Unknown'
            const date =
              headers.find((h) => h.name === 'Date')?.value ||
              new Date().toISOString()

            return {
              id: msg.id,
              subject,
              from,
              date,
              snippet: detail.snippet || 'No content'
            }
          }
          return null
        }) || []
      )

      return {
        success: true,
        data: {
          emails: emailDetails.filter(Boolean)
        }
      }
    }

    if (config.action === 'search') {
      if (!config.searchQuery) {
        throw new Error('Search query is required for search action')
      }

      // Make actual Gmail API call to search messages
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(
          config.searchQuery
        )}&maxResults=10`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${config.accessToken}`
          }
        }
      )

      if (!response.ok) {
        const errorData: { error?: { message?: string } } =
          await response.json()
        throw new Error(
          `Gmail API error: ${errorData.error?.message || response.statusText}`
        )
      }

      const messages: GmailMessagesResponse = await response.json()

      // Get details for search results
      const searchResults = await Promise.all(
        messages.messages?.slice(0, 5).map(async (msg: GmailMessage) => {
          const detailResponse = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
            {
              headers: {
                Authorization: `Bearer ${config.accessToken}`
              }
            }
          )

          if (detailResponse.ok) {
            const detail: GmailMessageDetail = await detailResponse.json()
            const headers = detail.payload?.headers || []
            const subject =
              headers.find((h) => h.name === 'Subject')?.value || 'No Subject'
            const from =
              headers.find((h) => h.name === 'From')?.value || 'Unknown'
            const date =
              headers.find((h) => h.name === 'Date')?.value ||
              new Date().toISOString()

            return {
              id: msg.id,
              subject,
              from,
              date,
              snippet: detail.snippet || 'No content'
            }
          }
          return null
        }) || []
      )

      return {
        success: true,
        data: {
          query: config.searchQuery,
          results: searchResults.filter(Boolean)
        }
      }
    }

    throw new Error(`Unsupported Gmail action: ${config.action}`)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Google Drive API functions
export async function executeGoogleDriveAction(
  config: GoogleDriveConfig
): Promise<ApiResponse> {
  try {
    if (!config.accessToken) {
      throw new Error('Access token is required')
    }

    if (config.action === 'upload') {
      if (!config.fileName) {
        throw new Error('File name is required for upload')
      }

      // Create file metadata
      const fileMetadata = {
        name: config.fileName,
        mimeType: 'text/plain'
      }

      // Create file content
      const fileContent = config.fileContent || 'Empty file content'

      // Make actual Google Drive API call to upload file
      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.accessToken}`
          },
          body: (() => {
            const boundary = '-------314159265358979323846'
            const delimiter = '\r\n--' + boundary + '\r\n'
            const close_delim = '\r\n--' + boundary + '--'

            const multipartRequestBody =
              delimiter +
              'Content-Type: application/json\r\n\r\n' +
              JSON.stringify(fileMetadata) +
              delimiter +
              'Content-Type: text/plain\r\n\r\n' +
              fileContent +
              close_delim

            return multipartRequestBody
          })()
        }
      )

      if (!response.ok) {
        const errorData: { error?: { message?: string } } =
          await response.json()
        throw new Error(
          `Google Drive API error: ${
            errorData.error?.message || response.statusText
          }`
        )
      }

      const result: { id: string; name: string; webViewLink?: string } =
        await response.json()

      return {
        success: true,
        data: {
          fileId: result.id,
          fileName: result.name,
          size: fileContent.length,
          uploadedAt: new Date().toISOString(),
          webViewLink:
            result.webViewLink ||
            `https://drive.google.com/file/d/${result.id}/view`
        }
      }
    }

    if (config.action === 'download') {
      if (!config.fileName) {
        throw new Error('File name is required for download')
      }

      // First, search for the file by name
      const searchResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(
          config.fileName
        )}'&fields=files(id,name)`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${config.accessToken}`
          }
        }
      )

      if (!searchResponse.ok) {
        const errorData: { error?: { message?: string } } =
          await searchResponse.json()
        throw new Error(
          `Google Drive API error: ${
            errorData.error?.message || searchResponse.statusText
          }`
        )
      }

      const searchResult: { files: Array<{ id: string; name: string }> } =
        await searchResponse.json()

      if (!searchResult.files || searchResult.files.length === 0) {
        throw new Error(`File '${config.fileName}' not found`)
      }

      const fileId = searchResult.files[0].id

      return {
        success: true,
        data: {
          fileId: fileId,
          fileName: config.fileName,
          downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
          downloadedAt: new Date().toISOString()
        }
      }
    }

    if (config.action === 'list') {
      // Make actual Google Drive API call to list files
      const response = await fetch(
        'https://www.googleapis.com/drive/v3/files?pageSize=10&fields=files(id,name,mimeType,size,createdTime,webViewLink)',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${config.accessToken}`
          }
        }
      )

      if (!response.ok) {
        const errorData: { error?: { message?: string } } =
          await response.json()
        throw new Error(
          `Google Drive API error: ${
            errorData.error?.message || response.statusText
          }`
        )
      }

      const result: {
        files: Array<{
          id: string
          name: string
          mimeType: string
          size: string
          createdTime: string
          webViewLink: string
        }>
      } = await response.json()

      return {
        success: true,
        data: {
          files: result.files.map((file) => ({
            id: file.id,
            name: file.name,
            mimeType: file.mimeType,
            size: parseInt(file.size) || 0,
            createdTime: file.createdTime,
            webViewLink: file.webViewLink
          }))
        }
      }
    }

    if (config.action === 'search') {
      if (!config.searchQuery) {
        throw new Error('Search query is required for search action')
      }

      // Make actual Google Drive API call to search files
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
          config.searchQuery
        )}&pageSize=10&fields=files(id,name,mimeType,size,createdTime,webViewLink)`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${config.accessToken}`
          }
        }
      )

      if (!response.ok) {
        const errorData: { error?: { message?: string } } =
          await response.json()
        throw new Error(
          `Google Drive API error: ${
            errorData.error?.message || response.statusText
          }`
        )
      }

      const result: {
        files: Array<{
          id: string
          name: string
          mimeType: string
          size: string
          createdTime: string
          webViewLink: string
        }>
      } = await response.json()

      return {
        success: true,
        data: {
          query: config.searchQuery,
          results: result.files.map((file) => ({
            id: file.id,
            name: file.name,
            mimeType: file.mimeType,
            size: parseInt(file.size) || 0,
            createdTime: file.createdTime,
            webViewLink: file.webViewLink
          }))
        }
      }
    }

    if (config.action === 'create_folder') {
      if (!config.fileName) {
        throw new Error('Folder name is required for creating folders')
      }

      // Create folder metadata
      const folderMetadata = {
        name: config.fileName,
        mimeType: 'application/vnd.google-apps.folder'
      }

      // Make actual Google Drive API call to create folder
      const response = await fetch(
        'https://www.googleapis.com/drive/v3/files',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(folderMetadata)
        }
      )

      if (!response.ok) {
        const errorData: { error?: { message?: string } } =
          await response.json()
        throw new Error(
          `Google Drive API error: ${
            errorData.error?.message || response.statusText
          }`
        )
      }

      const result: { id: string; name: string; webViewLink?: string } =
        await response.json()

      return {
        success: true,
        data: {
          folderId: result.id,
          name: result.name,
          createdTime: new Date().toISOString(),
          webViewLink:
            result.webViewLink ||
            `https://drive.google.com/drive/folders/${result.id}`
        }
      }
    }

    throw new Error(`Unsupported Google Drive action: ${config.action}`)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Helper function to validate access tokens (basic validation)
export function validateAccessToken(token: string): boolean {
  // In a real implementation, you would validate the token with Google's API
  // For now, we'll just check if it's not empty and has a reasonable length
  return token.length > 10 && token.includes('ya29.') // Basic Gmail/Drive token format check
}

// Helper function to get OAuth URL (for documentation purposes)
export function getGoogleOAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-client-id'
  const redirectUri =
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ||
    'http://localhost:3000/auth/callback'
  const scope =
    'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/drive.file'

  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&access_type=offline`
}

// Discord API functions
export async function sendDiscordMessage(
  config: DiscordConfig
): Promise<ApiResponse> {
  try {
    if (!config.botToken) {
      throw new Error('Bot token is required')
    }

    if (!config.channelId) {
      throw new Error('Channel ID is required')
    }

    // Use our Next.js API route to avoid CORS and get better error handling
    const response = await fetch('/api/discord', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Discord API request failed')
    }

    const result = await response.json()
    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Twitter API functions
export async function getTwitterData(
  config: TwitterConfig
): Promise<ApiResponse> {
  try {
    if (!config.bearerToken) {
      throw new Error('Bearer token is required')
    }

    // Use our Next.js API route to avoid CORS issues
    const response = await fetch('/api/twitter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Twitter API request failed')
    }

    const result = await response.json()
    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// YouTube API functions
export async function executeYouTubeAction(
  config: YouTubeConfig
): Promise<ApiResponse> {
  try {
    if (!config.accessToken) {
      throw new Error('Access token is required')
    }

    const response = await fetch('/api/youtube', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'YouTube API request failed')
    }

    const result = await response.json()
    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// LinkedIn API functions
export async function executeLinkedInAction(
  config: LinkedInConfig
): Promise<ApiResponse> {
  try {
    if (!config.accessToken) {
      throw new Error('Access token is required')
    }

    const response = await fetch('/api/linkedin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'LinkedIn API request failed')
    }

    const result = await response.json()
    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Helper function to validate Discord bot tokens (basic validation)
export function validateDiscordToken(token: string): boolean {
  // Discord bot tokens typically start with specific patterns
  return token.length > 50 && token.includes('.')
}

// Helper function to validate Twitter bearer tokens (basic validation)
export function validateTwitterToken(token: string): boolean {
  // Twitter bearer tokens are typically long and contain specific characters
  return token.length > 50 && token.includes('AAAA')
}

// Helper validation for YouTube (Google access token)
export function validateYouTubeAccessToken(token: string): boolean {
  return validateAccessToken(token)
}

// Helper validation for LinkedIn access tokens (very basic)
export function validateLinkedInToken(token: string): boolean {
  return token.length > 20
}

// AI API functions
export async function executeAIAction(config: AIConfig): Promise<ApiResponse> {
  try {
    if (!config.apiKey) {
      throw new Error('API key is required')
    }

    if (!config.prompt) {
      throw new Error('Prompt is required')
    }

    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'AI API request failed')
    }

    const result = await response.json()
    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Helper validation for AI API keys (basic)
export function validateAIToken(token: string, provider: string): boolean {
  if (!token || token.length < 10) return false

  switch (provider) {
    case 'openai':
      return token.startsWith('sk-')
    case 'anthropic':
      return token.startsWith('sk-ant-')
    case 'google':
      return token.length > 20 // Google API keys are long
    case 'groq':
      return token.startsWith('gsk_')
    default:
      return token.length > 10
  }
}
