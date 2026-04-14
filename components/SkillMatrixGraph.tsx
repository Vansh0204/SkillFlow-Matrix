/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection as FlowConnection,
  Edge,
  Node,
  Background,
  Controls,
  Panel,
  MarkerType,
  Handle,
  Position,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { GraphData } from '@/lib/types';
import { getGraphData, getNodePositions, saveNodePositions, saveGraphData } from '@/lib/storage';
import { Users, Code2, Layers, Trash2 } from 'lucide-react';
import DetailPanel from './DetailPanel';
import CRUDPanel from './CRUDPanel';
import SummaryPanel from './SummaryPanel';

// Node Components with entrance animation
const PersonNode = ({ data, selected }: any) => {
  return (
    <div className={`relative group animate-in zoom-in fade-in duration-500 fill-mode-backwards transition-all ${selected ? 'z-50' : 'z-10'}`}>
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-indigo-400 border-none opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className={`flex flex-col items-center justify-center w-24 h-24 rounded-full border-2 bg-slate-900 transition-all hover:scale-110 ${
        selected 
          ? 'border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.6)] scale-110' 
          : 'border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
      }`}>
        <div className={`p-2 rounded-full mb-1 transition-colors ${selected ? 'bg-indigo-500 text-white' : 'bg-indigo-500/10 text-indigo-400'}`}>
          <Users size={16} />
        </div>
        <div className="text-[10px] font-bold text-white text-center px-2 truncate w-full">{data.name}</div>
        <div className="text-[8px] text-slate-500 text-center truncate w-full px-2">{data.role}</div>
      </div>
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-indigo-400 border-none opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <button 
        onClick={(e) => { e.stopPropagation(); data.onDelete(); }}
        className="absolute -top-1 -right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg z-50"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
};

const SkillNode = ({ data, selected }: any) => {
  return (
    <div className={`relative group animate-in zoom-in fade-in duration-500 fill-mode-backwards transition-all ${selected ? 'z-50' : 'z-10'}`}>
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-emerald-400 border-none opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className={`flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 bg-slate-900 transition-all hover:scale-110 ${
        selected 
          ? 'border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.6)] scale-110' 
          : 'border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
      }`}>
        <div className={`p-2 rounded-lg mb-1 transition-colors ${selected ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-400'}`}>
          <Code2 size={16} />
        </div>
        <div className="text-[10px] font-bold text-white text-center px-2 truncate w-full">{data.name}</div>
        <div className="text-[8px] text-slate-500 text-center truncate w-full px-2">{data.category}</div>
      </div>
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-emerald-400 border-none opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <button 
        onClick={(e) => { e.stopPropagation(); data.onDelete(); }}
        className="absolute -top-1 -right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg z-50"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
};

const nodeTypes = {
  person: PersonNode,
  skill: SkillNode,
};

const PROFICIENCY_COLORS: Record<string, string> = {
  learning: '#facc15',
  familiar: '#60a5fa',
  expert: '#4ade80',
};

export default function SkillMatrixGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [fullData, setFullData] = useState<GraphData | null>(null);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'person' | 'skill' | null>(null);

  const onConnect = useCallback(
    (params: FlowConnection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const getLayoutedElements = useCallback((nodes: Node[], edges: Edge[]) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'LR' });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 150, height: 150 });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const storedPositions = getNodePositions();

    return nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      const storedPos = storedPositions[node.id];
      
      return {
        ...node,
        position: storedPos || {
          x: nodeWithPosition.x - 75,
          y: nodeWithPosition.y - 75,
        },
      };
    });
  }, []);

  const handleNodeDelete = useCallback((id: string, type: 'person' | 'skill') => {
    setFullData(prev => {
      if (!prev) return null;
      const newData = { ...prev };
      if (type === 'person') {
        newData.people = newData.people.filter(p => p.id !== id);
        newData.connections = newData.connections.filter(c => c.personId !== id);
      } else {
        newData.skills = newData.skills.filter(s => s.id !== id);
        newData.connections = newData.connections.filter(c => c.skillId !== id);
      }
      
      saveGraphData(newData);
      return newData;
    });
    setSelectedId(null);
  }, []);

  const refreshFlow = useCallback((data: GraphData) => {
    const initialNodes: Node[] = [
      ...data.people.map((p) => ({
        id: p.id,
        type: 'person',
        data: { 
          name: p.name, 
          role: p.role,
          onDelete: () => handleNodeDelete(p.id, 'person')
        },
        position: { x: 0, y: 0 },
      })),
      ...data.skills.map((s) => ({
        id: s.id,
        type: 'skill',
        data: { 
          name: s.name, 
          category: s.category,
          onDelete: () => handleNodeDelete(s.id, 'skill')
        },
        position: { x: 0, y: 0 },
      })),
    ];

    const initialEdges: Edge[] = data.connections.map((c) => ({
      id: `${c.personId}-${c.skillId}`,
      source: c.personId,
      target: c.skillId,
      label: c.proficiency,
      labelBgPadding: [4, 2],
      labelBgBorderRadius: 4,
      labelBgStyle: { fill: '#1e293b', color: '#fff', fillOpacity: 0.8 },
      labelStyle: { fill: '#fff', fontSize: 10, fontWeight: 700 },
      style: { stroke: PROFICIENCY_COLORS[c.proficiency], strokeWidth: 3 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: PROFICIENCY_COLORS[c.proficiency],
      },
      animated: true,
    }));

    const layoutedNodes = getLayoutedElements(initialNodes, initialEdges);
    setNodes(layoutedNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges, getLayoutedElements, handleNodeDelete]);

  useEffect(() => {
    const data = getGraphData();
    setFullData(data);
  }, []);

  useEffect(() => {
    if (fullData) {
        refreshFlow(fullData);
    }
  }, [fullData, refreshFlow]);

  const onNodeClick = (_: any, node: Node) => {
    setSelectedId(node.id);
    setSelectedType(node.type as 'person' | 'skill');
  };

  const onNodeDragStop = (_: any, node: Node) => {
    const currentPositions = getNodePositions();
    currentPositions[node.id] = node.position;
    saveNodePositions(currentPositions);
  };

  const handleUpdate = (updatedData: GraphData) => {
    setFullData(updatedData);
    saveGraphData(updatedData);
  };

  // Highlighting/Dimming Logic
  useEffect(() => {
    if (!selectedId) {
      setNodes(nds => nds.map(n => ({ ...n, style: { ...n.style, opacity: 1 } })));
      setEdges(eds => eds.map(e => ({ ...e, style: { ...e.style, opacity: 1 } })));
      return;
    }

    // We can't rely on 'edges' dependency directly as it triggers an infinite loop 
    // when we update edge styles. Instead, we use the functional update to get 
    // the latest state or just accept that highlights update on selection.
    
    setEdges(eds => {
        const connectedNodeIds = new Set<string>();
        connectedNodeIds.add(selectedId);

        // Find connected nodes from current edges
        eds.forEach(e => {
            const sId = typeof e.source === 'string' ? e.source : (e.source as any).id;
            const tId = typeof e.target === 'string' ? e.target : (e.target as any).id;
            if (sId === selectedId) connectedNodeIds.add(tId);
            if (tId === selectedId) connectedNodeIds.add(sId);
        });

        // Update nodes opacity
        setNodes(nds => nds.map(n => ({
            ...n,
            style: { ...n.style, opacity: connectedNodeIds.has(n.id) ? 1 : 0.15 }
        })));

        // Return updated edges
        return eds.map(e => {
            const sId = typeof e.source === 'string' ? e.source : (e.source as any).id;
            const tId = typeof e.target === 'string' ? e.target : (e.target as any).id;
            const isConnected = sId === selectedId || tId === selectedId;
            return {
                ...e,
                style: { ...e.style, opacity: isConnected ? 1 : 0.1 }
            };
        });
    });
  }, [selectedId, setNodes, setEdges]);

  if (!fullData) return <div className="flex items-center justify-center h-screen bg-slate-950 text-white">Loading Matrix...</div>;

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <header className="flex items-center justify-between px-8 py-6 bg-slate-900/50 border-b border-slate-800 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <Layers className="text-indigo-400 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              SkillFlow Matrix
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">Dynamic Capability Graph</p>
          </div>
        </div>
      </header>

      <main className="relative flex-1 flex overflow-hidden">
        <CRUDPanel data={fullData} onUpdate={handleUpdate} />

        <div className="flex-1 relative bg-slate-950">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onNodeDragStop={onNodeDragStop}
            onPaneClick={() => {
                setSelectedId(null);
                setSelectedType(null);
            }}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
            colorMode="dark"
          >
            <Background color="#334155" gap={20} />
            <Controls />
            <MiniMap 
              nodeColor={(node) => node.type === 'person' ? '#818cf8' : '#34d399'}
              maskColor="rgba(15, 23, 42, 0.7)"
              style={{ backgroundColor: '#1e293b', borderRadius: '8px' }}
            />
            <Panel position="bottom-left" className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-2xl mb-8 ml-8">
              <div className="flex gap-4">
                {Object.entries(PROFICIENCY_COLORS).map(([level, color]) => (
                  <div key={level} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{level}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </ReactFlow>
        </div>

        <DetailPanel 
          isOpen={!!selectedId}
          onClose={() => {
            setSelectedId(null);
            setSelectedType(null);
          }}
          selectedId={selectedId}
          selectedType={selectedType}
          data={fullData}
          onUpdate={handleUpdate}
        />

        {selectedId && (
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-40 animate-in fade-in duration-300" 
            onClick={() => {
              setSelectedId(null);
              setSelectedType(null);
            }}
          />
        )}

        <SummaryPanel data={fullData} />
      </main>

      <style jsx global>{`
        .react-flow__edge-path {
          stroke-dasharray: 5;
          stroke-dashoffset: 0;
          transition: stroke-dashoffset 2s linear, opacity 0.5s ease;
        }
        .react-flow__edge.animated .react-flow__edge-path {
          animation: flow 2s linear infinite;
        }
        @keyframes flow {
           from { stroke-dashoffset: 10; }
           to { stroke-dashoffset: 0; }
        }
        
        .react-flow__node {
            border-radius: 9999px;
            border: none;
            background: transparent;
            transition: opacity 0.5s ease;
        }
        
        .react-flow__handle {
            background: #94a3b8;
            border: 2px solid #1e293b;
        }

        .react-flow__controls button {
            background: #1e293b;
            color: #94a3b8;
            border-bottom: 1px solid #334155;
        }
        .react-flow__controls button:hover {
            background: #334155;
        }
        .react-flow__controls button svg {
            fill: currentColor;
        }

        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-in {
          animation: zoomIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
