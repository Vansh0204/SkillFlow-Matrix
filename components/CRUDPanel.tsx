'use client';

import React, { useState } from 'react';
import { GraphData, Person, Skill, Connection } from '@/lib/types';
import { UserPlus, Zap, Link, ChevronDown, ChevronUp } from 'lucide-react';

interface CRUDPanelProps {
  data: GraphData;
  onUpdate: (updatedData: GraphData) => void;
  isDarkMode?: boolean;
  initialSection?: 'person' | 'skill' | 'connection' | null;
}

const CATEGORIES = ['Frontend', 'Backend', 'DevOps', 'Design', 'Data Science', 'Product'];

export default function CRUDPanel({ data, onUpdate, isDarkMode = true, initialSection }: CRUDPanelProps) {
  const [openSection, setOpenSection] = useState<'person' | 'skill' | 'connection' | null>(null);
  
  React.useEffect(() => {
    if (initialSection) {
      setOpenSection(initialSection);
      setMobileAction(initialSection);
    }
  }, [initialSection]);

  const [mobileAction, setMobileAction] = useState<'person' | 'skill' | 'connection'>('person');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const ACTIONS = [
    { id: 'person', label: 'Add Team Member', icon: <UserPlus size={18} className="text-indigo-400" />, color: 'text-indigo-400' },
    { id: 'skill', label: 'Add New Skill', icon: <Zap size={18} className="text-purple-400" />, color: 'text-purple-400' },
    { id: 'connection', label: 'Update Matrix', icon: <Link size={18} className="text-slate-400" />, color: 'text-slate-400' },
  ] as const;


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
    <div className="w-full space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pb-48 px-1">

      {/* Mobile Action Dropdown */}
      <div className="lg:hidden relative">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between p-4 px-5 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              {ACTIONS.find(a => a.id === mobileAction)?.icon}
              <span className="text-sm font-bold text-slate-200">
                {ACTIONS.find(a => a.id === mobileAction)?.label}
              </span>
            </div>
            <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="border-t border-white/5 bg-slate-950/50 p-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
              {ACTIONS.map(action => (
                <button
                  key={action.id}
                  onClick={() => {
                    setMobileAction(action.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    mobileAction === action.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {action.icon}
                  <span className="text-sm font-bold">{action.label}</span>
                </button>
              ))}
            </div>
          )}
          
          <div className="p-4 pt-2 border-t border-white/5">
            {mobileAction === 'person' && (
              <form onSubmit={handleAddPerson} className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
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
                <button className="w-full py-2 bg-rose-500 hover:bg-rose-400 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-rose-500/20 uppercase">
                  Create Member
                </button>
              </form>
            )}

            {mobileAction === 'skill' && (
              <form onSubmit={handleAddSkill} className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
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

            {mobileAction === 'connection' && (
              <form onSubmit={handleAddConnection} className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
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
      </div>

      {/* Desktop Version (hidden on mobile) */}
      <div className="hidden lg:block space-y-4">
        {/* Add Person */}
        <div className={`${isDarkMode ? 'bg-[#121422] border-white/5' : 'bg-slate-50 border-slate-200 shadow-sm'} border rounded-2xl overflow-hidden shadow-2xl transition-colors`}>
          <button 
            onClick={() => toggleSection('person')}
            className={`w-full flex items-center justify-between p-4 ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-100'} transition-colors`}
          >
            <div className="flex items-center gap-3">
              <UserPlus size={18} className="text-indigo-400" />
              <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Add Team Member</span>
            </div>
            {openSection === 'person' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {openSection === 'person' && (
            <form onSubmit={handleAddPerson} className="p-4 pt-0 space-y-4 animate-in slide-in-from-top duration-300">
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Name</label>
                <input 
                  type="text" 
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  placeholder="e.g. Satoshi Nakamoto"
                  className={`w-full ${isDarkMode ? 'bg-[#1e2238] border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900'} border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                />
              </div>
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Role</label>
                <input 
                  type="text" 
                  value={personRole}
                  onChange={(e) => setPersonRole(e.target.value)}
                  placeholder="e.g. Lead Developer"
                  className={`w-full ${isDarkMode ? 'bg-[#1e2238] border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900'} border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                />
              </div>
              <button className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 uppercase">
                Create Member
              </button>
            </form>
          )}
        </div>

        {/* Add Skill */}
        <div className={`${isDarkMode ? 'bg-[#121422] border-white/5' : 'bg-slate-50 border-slate-200 shadow-sm'} border rounded-2xl overflow-hidden shadow-2xl transition-colors`}>
          <button 
            onClick={() => toggleSection('skill')}
            className={`w-full flex items-center justify-between p-4 ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-100'} transition-colors`}
          >
            <div className="flex items-center gap-3">
              <Zap size={18} className="text-purple-400" />
              <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Add New Skill</span>
            </div>
            {openSection === 'skill' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {openSection === 'skill' && (
            <form onSubmit={handleAddSkill} className="p-4 pt-0 space-y-4 animate-in slide-in-from-top duration-300">
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Skill Name</label>
                <input 
                  type="text" 
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g. Rust / Web3"
                  className={`w-full ${isDarkMode ? 'bg-[#1e2238] border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900'} border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500`}
                />
              </div>
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Category</label>
                <select 
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value)}
                  className={`w-full ${isDarkMode ? 'bg-[#1e2238] border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900'} border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500`}
                >
                  {CATEGORIES.map(c => <option key={c} value={c} className={isDarkMode ? 'bg-[#121422]' : 'bg-white'}>{c}</option>)}
                </select>
              </div>
              <button className="w-full py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-purple-500/20">
                Register Skill
              </button>
            </form>
          )}
        </div>

        {/* Add Connection */}
        <div className={`${isDarkMode ? 'bg-[#121422] border-white/5' : 'bg-slate-50 border-slate-200 shadow-sm'} border rounded-2xl overflow-hidden shadow-2xl transition-colors`}>
          <button 
            onClick={() => toggleSection('connection')}
            className={`w-full flex items-center justify-between p-4 ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-100'} transition-colors`}
          >
            <div className="flex items-center gap-3">
              <Link size={18} className="text-slate-400" />
              <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Update Matrix</span>
            </div>
            {openSection === 'connection' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {openSection === 'connection' && (
            <form onSubmit={handleAddConnection} className="p-4 pt-0 space-y-4 animate-in slide-in-from-top duration-300">
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Select Person</label>
                <select 
                  value={connPersonId}
                  onChange={(e) => setConnPersonId(e.target.value)}
                  className={`w-full ${isDarkMode ? 'bg-[#1e2238] border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900'} border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500`}
                >
                  <option value="">- Select -</option>
                  {data.people.map(p => <option key={p.id} value={p.id} className={isDarkMode ? 'bg-[#121422]' : 'bg-white'}>{p.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Select Skill</label>
                <select 
                  value={connSkillId}
                  onChange={(e) => setConnSkillId(e.target.value)}
                  className={`w-full ${isDarkMode ? 'bg-[#1e2238] border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900'} border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500`}
                >
                  <option value="">- Select -</option>
                  {data.skills.map(s => <option key={s.id} value={s.id} className={isDarkMode ? 'bg-[#121422]' : 'bg-white'}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Proficiency</label>
                <div className={`flex justify-between items-center ${isDarkMode ? 'bg-[#1e2238] border-white/5' : 'bg-slate-100 border-slate-200'} p-1 rounded-lg border`}>
                  {(['learning', 'familiar', 'expert'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setConnProficiency(p)}
                      className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded transition-all ${connProficiency === p ? (isDarkMode ? 'bg-slate-700 text-white' : 'bg-white shadow-sm text-indigo-600') : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-slate-900/20">
                Apply Connection
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
