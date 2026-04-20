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
  isDarkMode?: boolean;
}

const PROFICIENCY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  learning: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'Learning' },
  familiar: { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'Familiar' },
  expert: { bg: 'bg-green-500/10', text: 'text-green-500', label: 'Expert' },
};

export default function DetailPanel({
  isOpen,
  onClose,
  selectedId,
  selectedType,
  data,
  onUpdate,
  isDarkMode = true,
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
      className={`fixed inset-y-0 right-0 w-full sm:w-[320px] ${isDarkMode ? 'bg-[#1e2238] border-white/5 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'} border-l transform transition-transform duration-500 ease-in-out z-[80] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col p-8 overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className={`p-3 rounded-2xl ${selectedType === 'person' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-purple-500/10 text-purple-400'}`}>
            {selectedType === 'person' ? <User size={24} /> : <Code2 size={24} />}
          </div>
          <button 
            onClick={onClose}
            className={`p-2 ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'} rounded-full transition-all`}
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
                    className={`w-full ${isDarkMode ? 'bg-[#121422] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold`}
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
                    className={`w-full ${isDarkMode ? 'bg-[#121422] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm`}
                  />
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleSave}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-bold transition-all active:scale-95 text-sm"
                    >
                        <Check size={18} />
                        <span>Save</span>
                    </button>
                    <button 
                        onClick={() => setIsEditing(false)}
                        className={`px-6 py-3 ${isDarkMode ? 'bg-[#121422] text-slate-300 hover:bg-[#2a2d46] border-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'} rounded-xl font-bold transition-all border text-sm`}
                    >
                        Cancel
                    </button>
                </div>
              </div>
            ) : (
              <div className="group relative">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-2 ${selectedType === 'person' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-purple-500/10 text-purple-400'}`}>
                  {selectedType}
                </span>
                <h2 className={`text-3xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tight leading-tight`}>{selectedItem.name}</h2>
                <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-lg font-mono tracking-tighter`}>{selectedType === 'person' ? (selectedItem as Person).role : (selectedItem as Skill).category}</p>
                
                <button 
                  onClick={() => setIsEditing(true)}
                  className={`mt-6 flex items-center gap-2 text-sm font-semibold transition-colors ${isDarkMode ? 'text-slate-500 hover:text-indigo-400 bg-[#121422] border-white/5 hover:border-indigo-500/50' : 'text-slate-600 hover:text-indigo-600 bg-slate-50 border-slate-200 hover:border-indigo-200'} px-4 py-2 rounded-lg border group`}
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
                    <div key={lvl} className={`p-3 rounded-2xl border ${isDarkMode ? 'border-white/5 bg-[#121422]' : 'border-slate-100 bg-slate-50 shadow-sm'} flex flex-col items-center justify-center`}>
                        <span className={`text-xl font-bold ${info.text}`}>{proficiencyStats[lvl] || 0}</span>
                        <span className={`text-[8px] uppercase font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{info.label}</span>
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
                  <div key={i} className={`group flex items-center justify-between p-4 ${isDarkMode ? 'bg-[#121422] border-white/5 hover:bg-[#2a2d46] hover:border-white/10' : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-indigo-200 shadow-sm'} rounded-2xl border transition-all duration-300`}>
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
                <div className={`text-center py-8 ${isDarkMode ? 'bg-[#121422] border-white/10' : 'bg-slate-50 border-slate-200'} rounded-2xl border border-dashed`}>
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
