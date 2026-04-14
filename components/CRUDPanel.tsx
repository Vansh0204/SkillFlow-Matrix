'use client';

import React, { useState } from 'react';
import { GraphData, Person, Skill, Connection } from '@/lib/types';
import { UserPlus, Zap, Link, ChevronDown, ChevronUp } from 'lucide-react';

interface CRUDPanelProps {
  data: GraphData;
  onUpdate: (updatedData: GraphData) => void;
}

const CATEGORIES = ['Frontend', 'Backend', 'DevOps', 'Design', 'Data Science', 'Product'];

export default function CRUDPanel({ data, onUpdate }: CRUDPanelProps) {
  const [openSection, setOpenSection] = useState<'person' | 'skill' | 'connection' | null>(null);

  // Form States
  const [personName, setPersonName] = useState('');
  const [personRole, setPersonRole] = useState('');

  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState(CATEGORIES[0]);

  const [connPersonId, setConnPersonId] = useState('');
  const [connSkillId, setConnSkillId] = useState('');
  const [connProficiency, setConnProficiency] = useState<Connection['proficiency']>('familiar');

  const toggleSection = (section: 'person' | 'skill' | 'connection') => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName || !personRole) return;

    const newPerson: Person = {
      id: `p-${Date.now()}`,
      name: personName,
      role: personRole,
    };

    onUpdate({
      ...data,
      people: [...data.people, newPerson],
    });

    setPersonName('');
    setPersonRole('');
    setOpenSection(null);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName) return;

    const newSkill: Skill = {
      id: `s-${Date.now()}`,
      name: skillName,
      category: skillCategory,
    };

    onUpdate({
      ...data,
      skills: [...data.skills, newSkill],
    });

    setSkillName('');
    setOpenSection(null);
  };

  const handleAddConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connPersonId || !connSkillId) return;

    const existingIndex = data.connections.findIndex(c => c.personId === connPersonId && c.skillId === connSkillId);

    if (existingIndex >= 0) {
      const updatedConnections = [...data.connections];
      updatedConnections[existingIndex] = { ...updatedConnections[existingIndex], proficiency: connProficiency };
      onUpdate({ ...data, connections: updatedConnections });
    } else {
      const newConnection: Connection = {
        personId: connPersonId,
        skillId: connSkillId,
        proficiency: connProficiency,
      };
      onUpdate({
        ...data,
        connections: [...data.connections, newConnection],
      });
    }

    setConnPersonId('');
    setConnSkillId('');
    setOpenSection(null);
  };

  return (
    <div className="absolute top-24 left-8 w-80 space-y-4 z-40">
      {/* Add Person */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <button 
          onClick={() => toggleSection('person')}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <UserPlus size={18} className="text-rose-400" />
            <span className="text-sm font-bold text-slate-200">Add Team Member</span>
          </div>
          {openSection === 'person' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {openSection === 'person' && (
          <form onSubmit={handleAddPerson} className="p-4 pt-0 space-y-4 animate-in slide-in-from-top duration-300">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500">Name</label>
              <input 
                type="text" 
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="e.g. Satoshi Nakamoto"
                className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500">Role</label>
              <input 
                type="text" 
                value={personRole}
                onChange={(e) => setPersonRole(e.target.value)}
                placeholder="e.g. Lead Developer"
                className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <button className="w-full py-2 bg-rose-500 hover:bg-rose-400 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-rose-500/20">
              Create Member
            </button>
          </form>
        )}
      </div>

      {/* Add Skill */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <button 
          onClick={() => toggleSection('skill')}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Zap size={18} className="text-teal-400" />
            <span className="text-sm font-bold text-slate-200">Add New Skill</span>
          </div>
          {openSection === 'skill' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {openSection === 'skill' && (
          <form onSubmit={handleAddSkill} className="p-4 pt-0 space-y-4 animate-in slide-in-from-top duration-300">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500">Skill Name</label>
              <input 
                type="text" 
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. Rust / Web3"
                className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500">Category</label>
              <select 
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-teal-500/20">
              Register Skill
            </button>
          </form>
        )}
      </div>

      {/* Add Connection */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <button 
          onClick={() => toggleSection('connection')}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Link size={18} className="text-orange-400" />
            <span className="text-sm font-bold text-slate-200">Update Matrix</span>
          </div>
          {openSection === 'connection' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {openSection === 'connection' && (
          <form onSubmit={handleAddConnection} className="p-4 pt-0 space-y-4 animate-in slide-in-from-top duration-300">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500">Select Person</label>
              <select 
                value={connPersonId}
                onChange={(e) => setConnPersonId(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="">- Select -</option>
                {data.people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500">Select Skill</label>
              <select 
                value={connSkillId}
                onChange={(e) => setConnSkillId(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="">- Select -</option>
                {data.skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-500">Proficiency</label>
              <div className="flex justify-between items-center bg-slate-950/50 p-1 rounded-lg border border-white/5">
                {(['learning', 'familiar', 'expert'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setConnProficiency(p)}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded transition-all ${connProficiency === p ? 'bg-orange-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <button className="w-full py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-orange-500/20">
              Apply Connection
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
