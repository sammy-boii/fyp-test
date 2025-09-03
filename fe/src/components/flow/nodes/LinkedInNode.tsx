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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Linkedin, Settings, Play } from 'lucide-react'
import {
  executeLinkedInAction,
  validateLinkedInToken,
  type LinkedInConfig
} from '@/lib/api'

type LinkedInNodeData = {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  config?: LinkedInConfig
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

export default function LinkedInNode({ data, id }: NodeProps) {
  const [nodeData, setNodeData] = useState<LinkedInNodeData>(
    data as LinkedInNodeData
  )
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleConfigSave = (config: LinkedInConfig) => {
    setNodeData((prev) => ({
      ...prev,
      config,
      isConfigured: true
    }))
    setIsSheetOpen(false)
  }

  const handleExecute = async () => {
    if (!nodeData.config?.accessToken) {
      alert('Please configure the LinkedIn node first')
      return
    }

    if (!validateLinkedInToken(nodeData.config.accessToken)) {
      alert('Invalid LinkedIn access token format')
      return
    }

    setNodeData((prev) => ({ ...prev, isExecuting: true }))

    try {
      const result = await executeLinkedInAction({
        action: nodeData.config.action,
        authorUrn: nodeData.config.authorUrn,
        text: nodeData.config.text,
        accessToken: nodeData.config.accessToken
      })

      setNodeData((prev) => ({
        ...prev,
        isExecuting: false,
        lastExecution: {
          status: result.success ? 'success' : 'error',
          message: result.success
            ? `LinkedIn ${nodeData.config?.action} completed successfully`
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
        <div className='flex h-10 w-10 items-center justify-center rounded-md bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400'>
          <Linkedin className='h-5 w-5' />
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
                <SheetTitle>Configure LinkedIn Node</SheetTitle>
                <SheetDescription>
                  Provide a LinkedIn OAuth access token. To post, provide author
                  URN and text.
                </SheetDescription>
              </SheetHeader>
              <LinkedInConfigForm
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

function LinkedInConfigForm({
  initialConfig,
  onSave
}: {
  initialConfig?: LinkedInConfig
  onSave: (config: LinkedInConfig) => void
}) {
  const [formData, setFormData] = useState<LinkedInConfig>({
    action: initialConfig?.action || 'create_post',
    authorUrn: initialConfig?.authorUrn || '',
    text: initialConfig?.text || '',
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
          onValueChange={(value: 'create_post' | 'get_profile_posts') =>
            setFormData((prev) => ({ ...prev, action: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Select action' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='create_post'>Create Post</SelectItem>
            <SelectItem value='get_profile_posts'>Get Profile Posts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='accessToken'>Access Token</Label>
        <Input
          id='accessToken'
          type='password'
          placeholder='Enter LinkedIn OAuth access token'
          value={formData.accessToken}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, accessToken: e.target.value }))
          }
          required
        />
      </div>

      {(formData.action === 'create_post' ||
        formData.action === 'get_profile_posts') && (
        <div className='space-y-2'>
          <Label htmlFor='authorUrn'>Author URN</Label>
          <Input
            id='authorUrn'
            placeholder='urn:li:person:xxxx or urn:li:organization:xxxx'
            value={formData.authorUrn}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, authorUrn: e.target.value }))
            }
            required
          />
        </div>
      )}

      {formData.action === 'create_post' && (
        <div className='space-y-2'>
          <Label htmlFor='text'>Post Text</Label>
          <Textarea
            id='text'
            placeholder="What's on your mind?"
            value={formData.text}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, text: e.target.value }))
            }
            rows={3}
            required
          />
        </div>
      )}

      <div className='flex justify-end gap-2 pt-4'>
        <Button type='submit' className='w-full'>
          Save Configuration
        </Button>
      </div>
    </form>
  )
}
