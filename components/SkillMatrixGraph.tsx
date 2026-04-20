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
import { Users, Code2, Layers, Trash2, Network, Sun, Plus, Link as LinkIcon, LayoutTemplate, ChevronDown, Moon } from 'lucide-react';
import DetailPanel from './DetailPanel';
import CRUDPanel from './CRUDPanel';
import SummaryPanel from './SummaryPanel';

// Node Components with entrance animation
const PersonNode = ({ data, selected }: any) => {
  return (
    <div className={`relative group transition-all ${selected ? 'z-50' : 'z-10'}`}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className={`flex flex-col items-center justify-center w-[60px] h-[60px] rounded-full border-2 transition-all ${data.isDarkMode ? 'border-indigo-400 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'border-indigo-500 bg-white shadow-lg'} ${selected ? 'ring-4 ring-indigo-300 scale-110 shadow-[0_0_30px_rgba(99,102,241,0.6)]' : ''}`}>
        <div className={`text-[10px] font-bold text-center px-1 truncate w-full ${data.isDarkMode ? 'text-white' : 'text-indigo-600'}`}>{data.name}</div>
      </div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <button 
        onClick={(e) => { e.stopPropagation(); data.onDelete(); }}
        className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md z-50"
      >
        <Trash2 size={10} />
      </button>
    </div>
  );
};

const CATEGORY_COLORS: Record<string, string> = {
  'Frontend': 'border-purple-500 text-purple-400',
  'Backend': 'border-pink-500 text-pink-400',
  'DevOps': 'border-orange-500 text-orange-400',
  'Design': 'border-teal-500 text-teal-400',
  'Data Science': 'border-blue-500 text-blue-400',
  'Product': 'border-yellow-500 text-yellow-400',
};

const SkillNode = ({ data, selected }: any) => {
  const catStyle = CATEGORY_COLORS[data.category] || 'border-slate-500 text-slate-400';
  return (
    <div className={`relative group transition-all ${selected ? 'z-50' : 'z-10'}`}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className={`flex flex-col items-center justify-center w-32 h-10 rounded-md border-2 backdrop-blur-sm transition-all ${catStyle} ${data.isDarkMode ? 'bg-slate-900/80 shadow-lg' : 'bg-white shadow-md'} ${selected ? 'scale-110 shadow-xl' : ''}`}>
        <div className={`text-[11px] font-bold text-center px-2 truncate w-full ${data.isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{data.name}</div>
      </div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <button 
        onClick={(e) => { e.stopPropagation(); data.onDelete(); }}
        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md z-50"
      >
        <Trash2 size={10} />
      </button>
    </div>
  );
};

const nodeTypes = {
  person: PersonNode,
  skill: SkillNode,
};

const PROFICIENCY_COLORS: Record<string, string> = {
  learning: '#eab308', // Yellow
  familiar: '#3b82f6', // Blue
  expert: '#22c55e',   // Green
};

export default function SkillMatrixGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [fullData, setFullData] = useState<GraphData | null>(null);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'person' | 'skill' | null>(null);

  const [isCRUDOpen, setIsCRUDOpen] = useState(false);
  const [crudSection, setCrudSection] = useState<'person' | 'skill' | 'connection' | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'horizontal' | 'vertical' | 'circular'>('horizontal');
  const [isLayoutMenuOpen, setIsLayoutMenuOpen] = useState(false);

  const onConnect = useCallback(
    (params: FlowConnection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const getLayoutedElements = useCallback((nodes: Node[], edges: Edge[], mode: 'horizontal' | 'vertical' | 'circular' = 'horizontal') => {
    if (mode === 'circular') {
        const radius = Math.max(nodes.length * 25, 300);
        const center = { x: radius, y: radius };
        
        return nodes.map((node, index) => {
            const angle = (index / nodes.length) * 2 * Math.PI;
            return {
                ...node,
                position: {
                    x: center.x + radius * Math.cos(angle),
                    y: center.y + radius * Math.sin(angle),
                }
            };
        });
    }

    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ 
      rankdir: mode === 'horizontal' ? 'LR' : 'TB',
      nodesep: 80,
      ranksep: 200,
      marginx: 50,
      marginy: 50
    });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 180, height: 180 });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
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
          isDarkMode,
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
          isDarkMode,
          onDelete: () => handleNodeDelete(s.id, 'skill')
        },
        position: { x: 0, y: 0 },
      })),
    ];

    const initialEdges: Edge[] = data.connections.map((c) => ({
      id: `${c.personId}-${c.skillId}`,
      source: c.personId,
      target: c.skillId,
      style: { stroke: PROFICIENCY_COLORS[c.proficiency], strokeWidth: 2, strokeDasharray: '4 4' },
      animated: false,
    }));

    const layoutedNodes = getLayoutedElements(initialNodes, initialEdges, layoutMode);
    
    // PERSISTENCE LOCK: Save any newly calculated positions immediately
    // to prevent the "jumping" behavior when adding connections.
    const currentStored = getNodePositions();
    let hasNewPositions = false;
    
    layoutedNodes.forEach(node => {
      if (!currentStored[node.id]) {
        currentStored[node.id] = node.position;
        hasNewPositions = true;
      }
    });

    if (hasNewPositions) {
      saveNodePositions(currentStored);
    }

    setNodes(layoutedNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges, getLayoutedElements, handleNodeDelete, isDarkMode, layoutMode]);

  useEffect(() => {
    const data = getGraphData();
    setFullData(data);
  }, []);

  useEffect(() => {
    if (fullData) {
        refreshFlow(fullData);
    }
  }, [fullData, refreshFlow, isDarkMode]);

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
      setEdges(eds => eds.map(e => ({ 
        ...e, 
        style: { ...e.style, opacity: 1, strokeWidth: 3 },
        labelStyle: { ...e.labelStyle, opacity: 1 },
        labelBgStyle: { ...e.labelBgStyle, fillOpacity: 0.9 },
        animated: true 
      })));
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
            style: { ...n.style, opacity: connectedNodeIds.has(n.id) ? 1 : 0.4 }
        })));

        // Return updated edges
        return eds.map(e => {
            const sId = typeof e.source === 'string' ? e.source : (e.source as any).id;
            const tId = typeof e.target === 'string' ? e.target : (e.target as any).id;
            const isConnected = sId === selectedId || tId === selectedId;
            return {
                ...e,
                style: { 
                    ...e.style, 
                    opacity: isConnected ? 1 : 0.15,
                    strokeWidth: isConnected ? 3 : 2,
                    strokeDasharray: '4 4'
                },
                animated: false
            };
        });
    });
  }, [selectedId, setNodes, setEdges]);

  if (!fullData) return <div className={`flex items-center justify-center h-screen ${isDarkMode ? 'bg-[#121422] text-white' : 'bg-slate-50 text-slate-900'}`}>Loading Matrix...</div>;

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-[#121422] text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans overflow-hidden transition-colors duration-300`}>
      <header className={`flex items-center justify-between px-6 py-4 ${isDarkMode ? 'bg-[#1e2238] border-white/5' : 'bg-white border-slate-200 shadow-sm'} border-b z-50 transition-colors`}>
        <div className="flex items-center gap-3">
          <Network className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} w-6 h-6`} />
          <div>
            <h1 className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'} leading-tight`}>
              Team Skill Matrix
            </h1>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>{fullData.people.length} people · {fullData.skills.length} skills · {fullData.connections.length} connections</p>
          </div>
        </div>
        
        <div className={`hidden lg:flex items-center gap-6 text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Person</div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Skill</div>
          <div className="flex items-center gap-2 px-1"><div className="w-4 h-1 rounded-full bg-yellow-500" /> Learning</div>
          <div className="flex items-center gap-2 px-1"><div className="w-4 h-1 rounded-full bg-blue-500" /> Familiar</div>
          <div className="flex items-center gap-2 px-1"><div className="w-4 h-1 rounded-full bg-green-500" /> Expert</div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setCrudSection('person');
              setIsCRUDOpen(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 ${isDarkMode ? 'bg-[#121422] hover:bg-[#2a2d46] text-white border-white/10' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'} rounded-md text-xs font-semibold border transition-colors focus:outline-none shadow-sm`}
          >
            <Plus size={14} /> Add Person
          </button>
          <button 
            onClick={() => {
              setCrudSection('skill');
              setIsCRUDOpen(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 ${isDarkMode ? 'bg-[#121422] hover:bg-[#2a2d46] text-white border-white/10' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'} rounded-md text-xs font-semibold border transition-colors focus:outline-none shadow-sm`}
          >
            <Plus size={14} /> Add Skill
          </button>
          <button 
            onClick={() => {
              setCrudSection('connection');
              setIsCRUDOpen(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 ${isDarkMode ? 'bg-[#121422] hover:bg-[#2a2d46] text-white border-white/10' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'} rounded-md text-xs font-semibold border transition-colors focus:outline-none shadow-sm`}
          >
            <LinkIcon size={14} /> Add Connection
          </button>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 ml-2 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-indigo-600'} transition-colors focus:outline-none`}
          >
             {isDarkMode ? <Sun size={18} /> : <Moon size={18} />} 
          </button>
        </div>
      </header>

      <main className="relative flex-1 flex overflow-hidden">
        {/* CRUD Panel Drawer (overlaid or modal) */}
        <div className={`
          absolute left-4 top-4 bottom-4 w-80 
          ${isDarkMode ? 'bg-[#1e2238] border-white/10 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'} rounded-xl z-[70] transition-transform duration-500 
          p-4 border
          ${isCRUDOpen ? 'translate-x-0' : '-translate-x-[150%]'}
        `}>
          <div className={`flex justify-between items-center mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <h2 className="font-bold text-lg">Edit Matrix</h2>
            <button onClick={() => {
              setIsCRUDOpen(false);
              setCrudSection(null);
            }} className={`${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'} font-bold text-xl transition-colors`}>&times;</button>
          </div>
          <CRUDPanel data={fullData} onUpdate={handleUpdate} isDarkMode={isDarkMode} initialSection={crudSection} />
        </div>

        <div className={`flex-1 relative ${isDarkMode ? 'bg-[#121422]' : 'bg-slate-50'}`}>
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
            fitViewOptions={{ padding: 0.2, duration: 800, minZoom: 0.6 }}
            snapToGrid
            snapGrid={[15, 15]}
            colorMode={isDarkMode ? 'dark' : 'light'}
            minZoom={0.1}
            maxZoom={4}
            defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
            panOnScroll
            selectionOnDrag
          >
            <Background 
              color={isDarkMode ? "#6366f1" : "#94a3b8"} 
              gap={24} 
              size={1} 
              variant={"dots" as any} 
              style={{ opacity: isDarkMode ? 0.1 : 0.2 }} 
            />
            <Controls 
              position="bottom-left"
              showInteractive={false}
              className={`${isDarkMode ? 'bg-[#1e2238] border-white/10 shadow-2xl' : 'bg-white border-slate-200 shadow-lg'} border rounded-md overflow-hidden mb-8 ml-4 z-[100]`}
            />
            <div className="absolute bottom-10 left-16 z-[100] flex flex-col items-start gap-1">
              <div className={`flex items-center ${isDarkMode ? 'bg-[#1e2238] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 shadow-lg'} rounded-md border overflow-hidden text-xs`}>
                <div 
                  onClick={() => setIsLayoutMenuOpen(!isLayoutMenuOpen)}
                  className={`px-3 py-1.5 flex items-center gap-2 border-r ${isDarkMode ? 'border-white/10' : 'border-slate-200'} cursor-pointer hover:bg-black/5 capitalize`}
                >
                  <LayoutTemplate size={14} className="opacity-70" />
                  <span className="font-semibold">{layoutMode === 'horizontal' ? 'Bipartite' : layoutMode}</span>
                </div>
                <div 
                   onClick={() => setIsLayoutMenuOpen(!isLayoutMenuOpen)}
                   className="px-2 py-1.5 cursor-pointer hover:bg-black/5"
                >
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isLayoutMenuOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {isLayoutMenuOpen && (
                <div className={`w-32 animate-in slide-in-from-bottom-2 duration-200 ${isDarkMode ? 'bg-[#1e2238] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 shadow-xl'} border rounded-md overflow-hidden text-xs`}>
                  {(['horizontal', 'vertical', 'circular'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => {
                        setLayoutMode(mode);
                        setIsLayoutMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-black/5 capitalize transition-colors ${layoutMode === mode ? (isDarkMode ? 'bg-white/5' : 'bg-slate-50') : ''}`}
                    >
                      {mode === 'horizontal' ? 'Bipartite' : mode}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Legend removed, it's now in the header */}
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
          isDarkMode={isDarkMode}
        />

        <div className={`w-[320px] ${isDarkMode ? 'bg-[#1e2238] border-white/5' : 'bg-white border-slate-200 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]'} border-l flex flex-col z-[50] transition-colors`}>
          <SummaryPanel data={fullData} isDarkMode={isDarkMode} />
        </div>
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
