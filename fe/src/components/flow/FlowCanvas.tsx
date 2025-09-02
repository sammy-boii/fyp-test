'use client'

import React, { useCallback, type ComponentType } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  addEdge,
  type Edge,
  type Node,
  type Connection,
  type NodeTypes,
  type NodeProps
} from '@xyflow/react'
import IconTitleNode from './nodes/IconTitleNode'
import GmailNode from './nodes/GmailNode'
import GoogleDriveNode from './nodes/GoogleDriveNode'
import { Button } from '@/components/ui/button'
import { Plus, Play, Square } from 'lucide-react'

const nodeTypes: NodeTypes = {
  iconTitle: IconTitleNode as unknown as ComponentType<NodeProps>,
  gmail: GmailNode as unknown as ComponentType<NodeProps>,
  googleDrive: GoogleDriveNode as unknown as ComponentType<NodeProps>
}

const initialNodes: Node[] = [
  {
    id: 'gmail-1',
    type: 'gmail',
    position: { x: 100, y: 100 },
    data: { title: 'Gmail', subtitle: 'Send Email' }
  },
  {
    id: 'drive-1',
    type: 'googleDrive',
    position: { x: 400, y: 100 },
    data: { title: 'Google Drive', subtitle: 'Upload File' }
  }
]

const initialEdges: Edge[] = [
  {
    id: 'gmail-drive',
    source: 'gmail-1',
    target: 'drive-1',
    style: { stroke: '#6366f1', strokeWidth: 2 },
    animated: true
  }
]

export default function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [isExecuting, setIsExecuting] = React.useState(false)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const addGmailNode = useCallback(() => {
    const newNode: Node = {
      id: `gmail-${Date.now()}`,
      type: 'gmail',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { title: 'Gmail', subtitle: 'Send Email' }
    }
    setNodes((nds) => [...nds, newNode])
  }, [setNodes])

  const addGoogleDriveNode = useCallback(() => {
    const newNode: Node = {
      id: `drive-${Date.now()}`,
      type: 'googleDrive',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { title: 'Google Drive', subtitle: 'Upload File' }
    }
    setNodes((nds) => [...nds, newNode])
  }, [setNodes])

  const executeWorkflow = useCallback(async () => {
    setIsExecuting(true)
    // Simulate workflow execution
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsExecuting(false)
  }, [])

  return (
    <div className='h-[calc(100vh-4rem)] w-full rounded-xl border bg-background relative'>
      {/* Toolbar */}
      <div className='absolute top-4 left-4 z-10 flex gap-2'>
        <Button
          onClick={addGmailNode}
          size='sm'
          variant='outline'
          className='bg-background/80 backdrop-blur-sm'
        >
          <Plus className='h-4 w-4 mr-2' />
          Gmail
        </Button>
        <Button
          onClick={addGoogleDriveNode}
          size='sm'
          variant='outline'
          className='bg-background/80 backdrop-blur-sm'
        >
          <Plus className='h-4 w-4 mr-2' />
          Drive
        </Button>
        <Button
          onClick={executeWorkflow}
          size='sm'
          disabled={isExecuting}
          className='bg-background/80 backdrop-blur-sm'
        >
          {isExecuting ? (
            <Square className='h-4 w-4 mr-2 animate-pulse' />
          ) : (
            <Play className='h-4 w-4 mr-2' />
          )}
          {isExecuting ? 'Executing...' : 'Execute'}
        </Button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className='bg-slate-50 dark:bg-slate-900'
      >
        <Background
          className='[--xy-background-pattern-size:24px]'
          color='#e2e8f0'
          gap={24}
        />
        <MiniMap
          pannable
          zoomable
          nodeColor={'#6366f1'}
          maskColor='rgba(0,0,0,0.05)'
          className='!bg-background/80 backdrop-blur-sm border'
        />
        <Controls className='!bg-background/80 backdrop-blur-sm border' />
      </ReactFlow>
    </div>
  )
}
