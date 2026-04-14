'use client';

import React, { useState, useEffect } from 'react';
import { GraphData, Person, Skill } from '@/lib/types';
import { X, User, Code2, Edit3, Check, Trash2, ShieldCheck } from 'lucide-react';

interface DetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId: string | null;
  selectedType: 'person' | 'skill' | null;
  data: GraphData;
  onUpdate: (updatedData: GraphData) => void;
}

const PROFICIENCY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  learning: { bg: 'bg-orange-400/10', text: 'text-orange-400', label: 'Learning' },
  familiar: { bg: 'bg-purple-400/10', text: 'text-purple-400', label: 'Familiar' },
  expert: { bg: 'bg-teal-400/10', text: 'text-teal-400', label: 'Expert' },
};

export default function DetailPanel({
  isOpen,
  onClose,
  selectedId,
  selectedType,
  data,
  onUpdate,
}: DetailPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editInfo, setEditInfo] = useState(''); // role or category

  const selectedItem = selectedType === 'person' 
    ? data.people.find(p => p.id === selectedId)
    : data.skills.find(s => s.id === selectedId);

  useEffect(() => {
    if (selectedItem) {
      setEditName(selectedItem.name);
      setEditInfo(selectedType === 'person' ? (selectedItem as Person).role : (selectedItem as Skill).category);
      setIsEditing(false);
    }
  }, [selectedId, selectedType, selectedItem]);

  if (!selectedId || !selectedItem) return null;

  const handleSave = () => {
    const newData = { ...data };
    if (selectedType === 'person') {
      newData.people = newData.people.map(p => 
        p.id === selectedId ? { ...p, name: editName, role: editInfo } : p
      );
    } else {
      newData.skills = newData.skills.map(s => 
        s.id === selectedId ? { ...s, name: editName, category: editInfo } : s
      );
    }
    onUpdate(newData);
    setIsEditing(false);
  };

  const handleDeleteItem = () => {
    if (!window.confirm(`Are you sure you want to delete this ${selectedType}?`)) return;
    const newData = { ...data };
    if (selectedType === 'person') {
      newData.people = newData.people.filter(p => p.id !== selectedId);
      newData.connections = newData.connections.filter(c => c.personId !== selectedId);
    } else {
      newData.skills = newData.skills.filter(s => s.id !== selectedId);
      newData.connections = newData.connections.filter(c => c.skillId !== selectedId);
    }
    onUpdate(newData);
    onClose();
  };

  const relatedConnections = data.connections.filter(c => 
    selectedType === 'person' ? c.personId === selectedId : c.skillId === selectedId
  );

  const proficiencyStats = relatedConnections.reduce((acc, c) => {
    acc[c.proficiency] = (acc[c.proficiency] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-96 bg-slate-950/60 border-l border-white/5 shadow-2xl backdrop-blur-2xl transform transition-transform duration-500 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col p-8 overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className={`p-3 rounded-2xl ${selectedType === 'person' ? 'bg-rose-500/10 text-rose-400' : 'bg-teal-500/10 text-teal-400'}`}>
            {selectedType === 'person' ? <User size={24} /> : <Code2 size={24} />}
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Name</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                    {selectedType === 'person' ? 'Role' : 'Category'}
                  </label>
                  <input 
                    type="text" 
                    value={editInfo}
                    onChange={(e) => setEditInfo(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  />
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleSave}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-rose-500 hover:bg-rose-400 text-white rounded-xl font-bold shadow-lg shadow-rose-500/20 transition-all active:scale-95"
                    >
                        <Check size={18} />
                        <span>Save</span>
                    </button>
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 bg-slate-900 text-slate-300 rounded-xl font-bold hover:bg-slate-800 transition-all border border-white/5"
                    >
                        Cancel
                    </button>
                </div>
              </div>
            ) : (
              <div className="group relative">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${selectedType === 'person' ? 'bg-rose-500/10 text-rose-400' : 'bg-teal-500/10 text-teal-400'}`}>
                  {selectedType}
                </span>
                <h2 className="text-3xl font-bold text-white tracking-tight leading-tight">{selectedItem.name}</h2>
                <p className="text-slate-400 text-lg">{selectedType === 'person' ? (selectedItem as Person).role : (selectedItem as Skill).category}</p>
                
                <button 
                  onClick={() => setIsEditing(true)}
                  className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-rose-400 transition-colors bg-slate-900/50 px-4 py-2 rounded-lg border border-white/5 hover:border-rose-500/50 group"
                >
                  <Edit3 size={16} className="group-hover:rotate-12 transition-transform" />
                  Edit Detail
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="pt-8 border-t border-slate-800/50">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
              <ShieldCheck size={14} />
              Professional Stats
            </h3>
            <div className="grid grid-cols-3 gap-2">
                {Object.entries(PROFICIENCY_COLORS).map(([lvl, info]) => (
                    <div key={lvl} className={`p-3 rounded-2xl border border-slate-800/50 bg-slate-800/20 flex flex-col items-center justify-center`}>
                        <span className={`text-xl font-bold ${info.text}`}>{proficiencyStats[lvl] || 0}</span>
                        <span className="text-[8px] uppercase font-bold text-slate-500">{info.label}</span>
                    </div>
                ))}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/50">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
              {selectedType === 'person' ? <Code2 size={14} /> : <User size={14} />}
              {selectedType === 'person' ? 'Skills Matrix' : 'Team Expertise'}
            </h3>
            <div className="grid gap-3">
              {relatedConnections.map((c, i) => {
                const targetId = selectedType === 'person' ? c.skillId : c.personId;
                const target = selectedType === 'person' 
                  ? data.skills.find(s => s.id === targetId)
                  : data.people.find(p => p.id === targetId);
                
                const style = PROFICIENCY_COLORS[c.proficiency];

                const handleDeleteConnection = () => {
                  const newData = { ...data };
                  newData.connections = data.connections.filter(conn => 
                    !(conn.personId === c.personId && conn.skillId === c.skillId)
                  );
                  onUpdate(newData);
                };

                return (
                  <div key={i} className="group flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30 hover:bg-slate-800/60 hover:border-slate-600 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${style.bg.replace('/10', '')} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
                      <div>
                        <p className="text-sm font-bold text-slate-200">{target?.name}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-tighter ${style.text}`}>{style.label}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleDeleteConnection}
                      className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
              {relatedConnections.length === 0 && (
                <div className="text-center py-8 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700/50">
                  <p className="text-sm text-slate-500">No active connections found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-8 flex gap-3">
           <button 
            onClick={handleDeleteItem}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-sm font-bold transition-all border border-red-500/20"
           >
              <Trash2 size={18} />
              Remove {selectedType === 'person' ? 'Profile' : 'Skill'}
           </button>
        </div>
      </div>
    </div>
  );
}
