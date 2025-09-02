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

export interface ApiResponse<T = any> {
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
