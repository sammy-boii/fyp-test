import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// GitHub webhook endpoint
// Configure this URL in your GitHub repository settings > Webhooks
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-hub-signature-256')
    const event = request.headers.get('x-github-event')

    // Verify GitHub webhook signature (optional but recommended)
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET
    if (webhookSecret && signature) {
      const expectedSignature =
        'sha256=' +
        crypto.createHmac('sha256', webhookSecret).update(body).digest('hex')

      if (signature !== expectedSignature) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 403 }
        )
      }
    }

    const data = JSON.parse(body)

    // Handle different GitHub events
    switch (event) {
      case 'issues':
        if (data.action === 'opened') {
          console.log('New GitHub issue created:', {
            issueNumber: data.issue.number,
            title: data.issue.title,
            repository: data.repository.full_name,
            author: data.issue.user.login,
            createdAt: data.issue.created_at
          })

          // TODO: Trigger workflow execution
          // await triggerWorkflow('github_issue_trigger', {
          //   issueNumber: data.issue.number,
          //   title: data.issue.title,
          //   repository: data.repository.full_name,
          //   author: data.issue.user.login,
          //   body: data.issue.body
          // })

          return NextResponse.json({
            success: true,
            message: 'GitHub issue webhook processed',
            triggered: true
          })
        }
        break

      case 'push':
        console.log('GitHub push event:', {
          repository: data.repository.full_name,
          commits: data.commits.length,
          pusher: data.pusher.name,
          ref: data.ref
        })

        return NextResponse.json({
          success: true,
          message: 'GitHub push webhook processed'
        })

      case 'pull_request':
        if (data.action === 'opened') {
          console.log('New GitHub PR created:', {
            prNumber: data.pull_request.number,
            title: data.pull_request.title,
            repository: data.repository.full_name,
            author: data.pull_request.user.login
          })

          return NextResponse.json({
            success: true,
            message: 'GitHub PR webhook processed'
          })
        }
        break

      default:
        console.log(`Unhandled GitHub event: ${event}`)
    }

    return NextResponse.json({
      success: true,
      message: 'GitHub webhook received'
    })
  } catch (error) {
    console.error('GitHub webhook error:', error)
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'GitHub webhook endpoint' })
}
