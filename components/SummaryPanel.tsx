'use client';

import React, { useState, useMemo } from 'react';
import { GraphData } from '@/lib/types';
import { BarChart3, ChevronUp, ChevronDown, AlertTriangle, Star, Trophy } from 'lucide-react';

interface SummaryPanelProps {
  data: GraphData;
}

export default function SummaryPanel({ data }: SummaryPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Memoized Statistics
  const stats = useMemo(() => {
    // 1. Most common skills
    const skillCounts: Record<string, number> = {};
    data.connections.forEach(c => {
      skillCounts[c.skillId] = (skillCounts[c.skillId] || 0) + 1;
    });

    const sortedSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([id, count]) => ({
        name: data.skills.find(s => s.id === id)?.name || 'Unknown',
        count
      }));

    // 2. Skill gaps (Only 1 person knows)
    const skillGaps = data.skills.filter(s => {
      const count = data.connections.filter(c => c.skillId === s.id).length;
      return count === 1;
    }).map(s => s.name);

    // 3. Broadest skill set (People with most connections)
    const personCounts: Record<string, number> = {};
    data.connections.forEach(c => {
      personCounts[c.personId] = (personCounts[c.personId] || 0) + 1;
    });

    const sortedPeople = Object.entries(personCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([id, count]) => ({
        name: data.people.find(p => p.id === id)?.name || 'Unknown',
        count
      }));

    return { sortedSkills, skillGaps, sortedPeople };
  }, [data]);

  return (
    <div 
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-[800px] max-w-[95vw] bg-slate-950/60 border-t border-x border-white/5 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-500 z-40 ${
        isOpen ? 'h-64 translate-y-0' : 'h-12 translate-y-0'
      }`}
    >
      {/* Toggle Bar */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <BarChart3 size={16} className="text-rose-400" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-slate-300">Network Analytics</span>
        {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>

      {/* Analytics Content */}
      <div className={`p-8 grid grid-cols-3 gap-8 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        {/* Most Common Skills */}
        <div className="space-y-4">
          <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <Trophy size={14} className="text-orange-400" />
            Top Capabilities
          </h4>
          <div className="space-y-2">
            {stats.sortedSkills.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-sm group">
                <span className="text-slate-200 font-medium truncate max-w-[120px] group-hover:text-rose-400 transition-colors">{s.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-bold text-slate-400 border border-white/5">{s.count} masters</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Gaps */}
        <div className="space-y-4 border-x border-white/5 px-8">
          <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <AlertTriangle size={14} className="text-rose-400" />
            Vulnerability Index
          </h4>
          <div className="flex flex-wrap gap-2">
            {stats.skillGaps.length > 0 ? (
              stats.skillGaps.slice(0, 6).map((s, i) => (
                <span key={i} className="px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-100 font-medium lowercase">
                  #{s.replace(/\s+/g, '-')}
                </span>
              ))
            ) : (
                <span className="text-xs text-slate-600 italic">No critical risks found</span>
            )}
            {stats.skillGaps.length > 6 && <span className="text-[10px] text-slate-500 pt-1">+{stats.skillGaps.length - 6} more</span>}
          </div>
        </div>

        {/* Broadest SkillSets */}
        <div className="space-y-4">
          <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <Star size={14} className="text-teal-400" />
            Polymaths
          </h4>
          <div className="space-y-2">
            {stats.sortedPeople.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-sm group">
                <span className="text-slate-200 font-serif font-bold truncate max-w-[120px] group-hover:text-teal-400 transition-colors">{p.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-mono font-bold text-slate-400 border border-white/5">{p.count} skills</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
