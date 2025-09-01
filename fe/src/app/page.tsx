'use client'

import {
  ReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Node,
  Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  addEdge
} from '@xyflow/react'

import { useState, useCallback, ComponentProps } from 'react'

const initialNodes: Node[] = [
  {
    id: 'n1',
    position: { x: 0, y: 0 },
    data: { label: 'Node 1' },
    type: 'input'
  },

  {
    id: 'n2',
    position: { x: 100, y: 100 },
    data: { label: 'Node 2' }
  },
  {
    id: 'n3',
    position: { x: 50, y: 50 },
    data: { value: '123' },
    type: 'textUpdater'
  }
]

const initialEdges: Edge[] = [
  {
    id: 'n1-n2',
    source: 'n1',
    target: 'n2',
    label: 'connects with',
    type: 'step'
  }
]

const nodeTypes = {
  textUpdater: TextUpdaterNode
}

export function TextUpdaterNode(props: ComponentProps<'div'>) {
  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value)
  }, [])

  return (
    <div className='text-updater-node'>
      <div>
        <label htmlFor='text'>Text:</label>
        <input id='text' name='text' onChange={onChange} />
      </div>
    </div>
  )
}

export default function App() {
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)

  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  )
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  )

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  )

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        edges={edges}
        nodes={nodes}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
