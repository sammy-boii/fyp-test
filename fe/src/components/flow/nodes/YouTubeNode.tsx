'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { PlayCircle, Settings, Play } from 'lucide-react'
import {
  executeYouTubeAction,
  validateYouTubeAccessToken,
  type YouTubeConfig
} from '@/lib/api'

type YouTubeNodeData = {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  config?: YouTubeConfig
  isConfigured?: boolean
  isExecuting?: boolean
  lastExecution?: {
    status: 'success' | 'error'
    message: string
    timestamp: Date
  }
}

const handleBase =
  'w-3 h-3 !bg-primary !border-2 !border-background rounded-full'

export default function YouTubeNode({ data, id }: NodeProps) {
  const [nodeData, setNodeData] = useState<YouTubeNodeData>(
    data as YouTubeNodeData
  )
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleConfigSave = (config: YouTubeConfig) => {
    setNodeData((prev) => ({
      ...prev,
      config,
      isConfigured: true
    }))
    setIsSheetOpen(false)
  }

  const handleExecute = async () => {
    if (!nodeData.config?.accessToken) {
      alert('Please configure the YouTube node first')
      return
    }

    if (!validateYouTubeAccessToken(nodeData.config.accessToken)) {
      alert('Invalid Google access token format')
      return
    }

    setNodeData((prev) => ({ ...prev, isExecuting: true }))

    try {
      const result = await executeYouTubeAction({
        action: nodeData.config.action,
        query: nodeData.config.query,
        channelId: nodeData.config.channelId,
        maxResults: nodeData.config.maxResults,
        accessToken: nodeData.config.accessToken
      })

      setNodeData((prev) => ({
        ...prev,
        isExecuting: false,
        lastExecution: {
          status: result.success ? 'success' : 'error',
          message: result.success
            ? `YouTube ${nodeData.config?.action} completed successfully`
            : result.error || 'Unknown error occurred',
          timestamp: new Date()
        }
      }))
    } catch (error) {
      setNodeData((prev) => ({
        ...prev,
        isExecuting: false,
        lastExecution: {
          status: 'error',
          message: `Failed to ${nodeData.config?.action}: ${error}`,
          timestamp: new Date()
        }
      }))
    }
  }

  return (
    <div className='rounded-xl border bg-card text-card-foreground shadow-sm ring-1 ring-border/50 min-w-64'>
      <div className='flex items-center gap-3 p-4'>
        <div className='flex h-10 w-10 items-center justify-center rounded-md bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'>
          <PlayCircle className='h-5 w-5' />
        </div>
        <div className='flex min-w-0 flex-col flex-1'>
          <span className='truncate text-sm font-semibold'>
            {nodeData.title}
          </span>
          {nodeData.subtitle ? (
            <span className='truncate text-xs text-muted-foreground'>
              {nodeData.subtitle}
            </span>
          ) : null}
        </div>
        <div className='flex gap-1'>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                <Settings className='h-4 w-4' />
              </Button>
            </SheetTrigger>
            <SheetContent className='w-[400px] sm:w-[540px]'>
              <SheetHeader>
                <SheetTitle>Configure YouTube Node</SheetTitle>
                <SheetDescription>
                  Provide a Google OAuth access token and choose an action.
                </SheetDescription>
              </SheetHeader>
              <YouTubeConfigForm
                initialConfig={nodeData.config}
                onSave={handleConfigSave}
              />
            </SheetContent>
          </Sheet>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0'
            onClick={handleExecute}
            disabled={!nodeData.isConfigured || nodeData.isExecuting}
          >
            <Play
              className={`h-4 w-4 ${
                nodeData.isExecuting ? 'animate-spin' : ''
              }`}
            />
          </Button>
        </div>
      </div>

      <div className='px-4 pb-2'>
        <div className='flex items-center justify-between text-xs text-muted-foreground mb-2'>
          <span>Status:</span>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              nodeData.isConfigured
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            }`}
          >
            {nodeData.isConfigured ? 'Configured' : 'Not Configured'}
          </span>
        </div>
        {nodeData.lastExecution && (
          <div className='text-xs text-muted-foreground'>
            <div
              className={`flex items-center gap-1 ${
                nodeData.lastExecution.status === 'success'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              <span className='w-2 h-2 rounded-full bg-current'></span>
              {nodeData.lastExecution.message}
            </div>
            <div className='text-xs opacity-75 mt-1'>
              {nodeData.lastExecution.timestamp.toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>

      <div className='grid grid-cols-2 border-t'>
        <div className='px-3 py-2 text-xs text-muted-foreground'>input</div>
        <div className='px-3 py-2 text-right text-xs text-muted-foreground'>
          output
        </div>
      </div>

      <Handle type='target' position={Position.Top} className={handleBase} />
      <Handle type='source' position={Position.Bottom} className={handleBase} />
    </div>
  )
}

function YouTubeConfigForm({
  initialConfig,
  onSave
}: {
  initialConfig?: YouTubeConfig
  onSave: (config: YouTubeConfig) => void
}) {
  const [formData, setFormData] = useState<YouTubeConfig>({
    action: initialConfig?.action || 'search_videos',
    query: initialConfig?.query || '',
    channelId: initialConfig?.channelId || '',
    maxResults: initialConfig?.maxResults || 10,
    accessToken: initialConfig?.accessToken || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4 py-4'>
      <div className='space-y-2'>
        <Label htmlFor='action'>Action</Label>
        <Select
          value={formData.action}
          onValueChange={(value: 'search_videos' | 'get_channel_videos') =>
            setFormData((prev) => ({ ...prev, action: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Select action' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='search_videos'>Search Videos</SelectItem>
            <SelectItem value='get_channel_videos'>
              Get Channel Videos
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='accessToken'>Google Access Token</Label>
        <Input
          id='accessToken'
          type='password'
          placeholder='Enter Google OAuth access token'
          value={formData.accessToken}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, accessToken: e.target.value }))
          }
          required
        />
      </div>

      {formData.action === 'search_videos' && (
        <div className='space-y-2'>
          <Label htmlFor='query'>Query</Label>
          <Input
            id='query'
            placeholder='e.g., nextjs tutorials'
            value={formData.query}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, query: e.target.value }))
            }
            required
          />
        </div>
      )}

      {formData.action === 'get_channel_videos' && (
        <div className='space-y-2'>
          <Label htmlFor='channelId'>Channel ID</Label>
          <Input
            id='channelId'
            placeholder='UCxxxxxx'
            value={formData.channelId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, channelId: e.target.value }))
            }
            required
          />
        </div>
      )}

      <div className='space-y-2'>
        <Label htmlFor='maxResults'>Max Results</Label>
        <Input
          id='maxResults'
          type='number'
          min='1'
          max='50'
          value={formData.maxResults}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              maxResults: parseInt(e.target.value) || 10
            }))
          }
          required
        />
      </div>

      <div className='flex justify-end gap-2 pt-4'>
        <Button type='submit' className='w-full'>
          Save Configuration
        </Button>
      </div>
    </form>
  )
}
