'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronRight, Info, Play, Settings } from 'lucide-react'

export default function DemoInstructions() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className='mb-6'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <Info className='h-5 w-5' />
              How to Use This Workflow Tool
            </CardTitle>
            <CardDescription>
              Follow these steps to create and execute your first automation
              workflow
            </CardDescription>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className='h-4 w-4' />
            ) : (
              <ChevronRight className='h-4 w-4' />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='space-y-3'>
              <h4 className='font-semibold flex items-center gap-2'>
                <Badge variant='outline'>1</Badge>
                Add Nodes
              </h4>
              <p className='text-sm text-muted-foreground'>
                Click the "Gmail" or "Drive" buttons in the toolbar to add nodes
                to your workflow canvas.
              </p>
            </div>

            <div className='space-y-3'>
              <h4 className='font-semibold flex items-center gap-2'>
                <Badge variant='outline'>2</Badge>
                Configure Nodes
              </h4>
              <p className='text-sm text-muted-foreground'>
                Click the <Settings className='h-3 w-3 inline' /> icon on any
                node to configure its settings and provide your Google API
                access token.
              </p>
            </div>

            <div className='space-y-3'>
              <h4 className='font-semibold flex items-center gap-2'>
                <Badge variant='outline'>3</Badge>
                Connect Nodes
              </h4>
              <p className='text-sm text-muted-foreground'>
                Drag from the output handle (bottom) of one node to the input
                handle (top) of another to create connections.
              </p>
            </div>

            <div className='space-y-3'>
              <h4 className='font-semibold flex items-center gap-2'>
                <Badge variant='outline'>4</Badge>
                Execute Workflow
              </h4>
              <p className='text-sm text-muted-foreground'>
                Click the <Play className='h-3 w-3 inline' /> icon on individual
                nodes or use the "Execute" button to run the entire workflow.
              </p>
            </div>
          </div>

          <div className='border-t pt-4'>
            <h4 className='font-semibold mb-2'>
              🔑 Getting Google API Access Tokens
            </h4>
            <p className='text-sm text-muted-foreground mb-3'>
              To use Gmail and Google Drive nodes, you'll need to set up Google
              API credentials:
            </p>
            <ol className='text-sm text-muted-foreground space-y-1 ml-4'>
              <li>
                1. Go to{' '}
                <a
                  href='https://console.cloud.google.com/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline'
                >
                  Google Cloud Console
                </a>
              </li>
              <li>2. Enable Gmail API and Google Drive API</li>
              <li>3. Create OAuth 2.0 credentials</li>
              <li>
                4. Use{' '}
                <a
                  href='https://developers.google.com/oauthplayground/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline'
                >
                  OAuth 2.0 Playground
                </a>{' '}
                to get access tokens
              </li>
              <li>
                5. See{' '}
                <code className='bg-muted px-1 rounded text-xs'>
                  GOOGLE_API_SETUP.md
                </code>{' '}
                for detailed instructions
              </li>
            </ol>
          </div>

          <div className='border-t pt-4'>
            <h4 className='font-semibold mb-2'>✨ Features</h4>
            <div className='grid gap-2 md:grid-cols-2'>
              <div className='flex items-center gap-2 text-sm'>
                <Badge variant='secondary' className='text-xs'>
                  Gmail
                </Badge>
                <span className='text-muted-foreground'>
                  Send, read, and search emails
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <Badge variant='secondary' className='text-xs'>
                  Drive
                </Badge>
                <span className='text-muted-foreground'>
                  Upload, download, list, and search files
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <Badge variant='secondary' className='text-xs'>
                  Discord
                </Badge>
                <span className='text-muted-foreground'>
                  Send messages, embeds, and read channel messages
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <Badge variant='secondary' className='text-xs'>
                  Twitter
                </Badge>
                <span className='text-muted-foreground'>
                  Get timeline, trending topics, and user tweets
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <Badge variant='secondary' className='text-xs'>
                  Visual
                </Badge>
                <span className='text-muted-foreground'>
                  Drag-and-drop workflow builder
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <Badge variant='secondary' className='text-xs'>
                  Real-time
                </Badge>
                <span className='text-muted-foreground'>
                  Live execution status and results
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
