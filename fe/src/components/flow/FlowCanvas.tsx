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

const nodeTypes: NodeTypes = {
  iconTitle: IconTitleNode as unknown as ComponentType<NodeProps>
}

const initialNodes: Node[] = [
  {
    id: 'a',
    type: 'iconTitle',
    position: { x: 200, y: 60 },
    data: { title: 'API Gateway', subtitle: 'Edge', icon: '🛰️' }
  },
  {
    id: 'b',
    type: 'iconTitle',
    position: { x: 200, y: 240 },
    data: { title: 'Service', subtitle: 'Hono + Bun', icon: '⚙️' }
  }
]

const initialEdges: Edge[] = [{ id: 'a-b', source: 'a', target: 'b' }]

export default function FlowCanvas() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div className='h-[calc(100vh-4rem)] w-full rounded-xl border bg-background'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background className='[--xy-background-pattern-size:24px]' />
        <MiniMap
          pannable
          zoomable
          nodeColor={'#6366f1'}
          maskColor='rgba(0,0,0,0.05)'
        />
        <Controls />
      </ReactFlow>
    </div>
  )
}
