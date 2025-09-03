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
import { Twitter, Settings, Play } from 'lucide-react'
import { getTwitterData, validateTwitterToken } from '@/lib/api'

type TwitterNodeData = {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  config?: {
    action: 'get_timeline' | 'get_trending' | 'get_user_tweets'
    username?: string
    count?: number
    bearerToken?: string
  }
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

export default function TwitterNode({ data, id }: NodeProps) {
  const [nodeData, setNodeData] = useState<TwitterNodeData>(
    data as TwitterNodeData
  )
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleConfigSave = (config: TwitterNodeData['config']) => {
    setNodeData((prev) => ({
      ...prev,
      config,
      isConfigured: true
    }))
    setIsSheetOpen(false)
  }

  const handleExecute = async () => {
    if (!nodeData.config?.bearerToken) {
      alert('Please configure the Twitter node first')
      return
    }

    if (!validateTwitterToken(nodeData.config.bearerToken)) {
      alert('Invalid Twitter bearer token format')
      return
    }

    setNodeData((prev) => ({ ...prev, isExecuting: true }))

    try {
      const result = await getTwitterData(nodeData.config)

      setNodeData((prev) => ({
        ...prev,
        isExecuting: false,
        lastExecution: {
          status: result.success ? 'success' : 'error',
          message: result.success
            ? `Twitter ${nodeData.config?.action} completed successfully`
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
          message: `Failed to ${nodeData.config?.action} Twitter data: ${error}`,
          timestamp: new Date()
        }
      }))
    }
  }

  return (
    <div className='rounded-xl border bg-card text-card-foreground shadow-sm ring-1 ring-border/50 min-w-64'>
      <div className='flex items-center gap-3 p-4'>
        <div className='flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'>
          <Twitter className='h-5 w-5' />
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
                <SheetTitle>Configure Twitter Node</SheetTitle>
                <SheetDescription>
                  Set up your Twitter node configuration. You'll need to provide
                  a bearer token from Twitter API v2.
                </SheetDescription>
              </SheetHeader>
              <TwitterConfigForm
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

function TwitterConfigForm({
  initialConfig,
  onSave
}: {
  initialConfig?: TwitterNodeData['config']
  onSave: (config: TwitterNodeData['config']) => void
}) {
  const [formData, setFormData] = useState({
    action: initialConfig?.action || 'get_timeline',
    username: initialConfig?.username || '',
    count: initialConfig?.count || 10,
    bearerToken: initialConfig?.bearerToken || ''
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
          onValueChange={(
            value: 'get_timeline' | 'get_trending' | 'get_user_tweets'
          ) => setFormData((prev) => ({ ...prev, action: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select action' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='get_timeline'>Get Home Timeline</SelectItem>
            <SelectItem value='get_trending'>Get Trending Topics</SelectItem>
            <SelectItem value='get_user_tweets'>Get User Tweets</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='bearerToken'>Bearer Token</Label>
        <Input
          id='bearerToken'
          type='password'
          placeholder='Enter your Twitter API v2 bearer token'
          value={formData.bearerToken}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, bearerToken: e.target.value }))
          }
          required
        />
        <p className='text-xs text-muted-foreground'>
          You can get this from Twitter Developer Portal when creating an app
        </p>
      </div>

      {formData.action === 'get_user_tweets' && (
        <div className='space-y-2'>
          <Label htmlFor='username'>Username (without @)</Label>
          <Input
            id='username'
            placeholder='Enter username (e.g., elonmusk)'
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, username: e.target.value }))
            }
            required
          />
          <p className='text-xs text-muted-foreground'>
            Enter the username without the @ symbol
          </p>
        </div>
      )}

      <div className='space-y-2'>
        <Label htmlFor='count'>Number of Results</Label>
        <Input
          id='count'
          type='number'
          min='1'
          max='100'
          placeholder='10'
          value={formData.count}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              count: parseInt(e.target.value) || 10
            }))
          }
          required
        />
        <p className='text-xs text-muted-foreground'>
          Maximum 100 results per request
        </p>
      </div>

      <div className='flex justify-end gap-2 pt-4'>
        <Button type='submit' className='w-full'>
          Save Configuration
        </Button>
      </div>
    </form>
  )
}
