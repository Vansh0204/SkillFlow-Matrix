'use client';

import React, { useMemo } from 'react';
import { GraphData } from '@/lib/types';
import { BarChart3, Users, Zap, Link, Trophy, Medal, AlertTriangle } from 'lucide-react';

interface SummaryPanelProps {
  data: GraphData;
  isDarkMode?: boolean;
}

export default function SummaryPanel({ data, isDarkMode = true }: SummaryPanelProps) {
  // Memoized Statistics
  const stats = useMemo(() => {
    // 1. Most common skills
    const skillCounts: Record<string, number> = {};
    data.connections.forEach(c => {
      skillCounts[c.skillId] = (skillCounts[c.skillId] || 0) + 1;
    });

    const mostCommonSkill = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 1)
      .map(([id, count]) => ({
        name: data.skills.find(s => s.id === id)?.name || 'Unknown',
        count
      }))[0];

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

    const mostSkilled = Object.entries(personCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 1)
      .map(([id, count]) => ({
        name: data.people.find(p => p.id === id)?.name || 'Unknown',
        count
      }))[0];

    return { mostCommonSkill, skillGaps, mostSkilled };
  }, [data]);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 space-y-8">
      {/* Header */}
      <div className={`flex items-center gap-3 border-b ${isDarkMode ? 'border-white/10' : 'border-slate-200'} pb-4`}>
        <BarChart3 size={20} className={isDarkMode ? 'text-slate-300' : 'text-slate-500'} />
        <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Team Summary</h2>
      </div>

      {/* Metrics Boxes */}
      <div className="space-y-3">
        <div className={`flex justify-between items-center ${isDarkMode ? 'bg-[#121422] border-white/5' : 'bg-slate-50 border-slate-200 shadow-sm'} p-4 rounded-xl border`}>
          <div className="flex items-center gap-2 text-slate-300">
            <Users size={16} className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} />
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Team size</span>
          </div>
          <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{data.people.length}</span>
        </div>
        
        <div className={`flex justify-between items-center ${isDarkMode ? 'bg-[#121422] border-white/5' : 'bg-slate-50 border-slate-200 shadow-sm'} p-4 rounded-xl border`}>
          <div className="flex items-center gap-2 text-slate-300">
            <Zap size={16} className="text-orange-400" />
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Skills tracked</span>
          </div>
          <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{data.skills.length}</span>
        </div>

        <div className={`flex justify-between items-center ${isDarkMode ? 'bg-[#121422] border-white/5' : 'bg-slate-50 border-slate-200 shadow-sm'} p-4 rounded-xl border`}>
          <div className="flex items-center gap-2 text-slate-300">
            <Link size={16} className="text-slate-400" />
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Connections</span>
          </div>
          <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{data.connections.length}</span>
        </div>
      </div>

      {/* Highlights */}
      <div className="space-y-6 pt-4">
        {/* Most Common Skill */}
        {stats.mostCommonSkill && (
          <div className="space-y-2">
            <h4 className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <Trophy size={14} className="text-orange-400" />
              Most Common Skill
            </h4>
            <div className={`flex justify-between items-center ${isDarkMode ? 'bg-[#121422] border-white/5' : 'bg-slate-50 border-slate-200 shadow-sm'} p-4 rounded-xl border`}>
              <span className={isDarkMode ? 'text-white font-bold' : 'text-slate-900 font-bold'}>{stats.mostCommonSkill.name}</span>
              <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{stats.mostCommonSkill.count} people</span>
            </div>
          </div>
        )}

        {/* Most Skilled */}
        {stats.mostSkilled && (
          <div className="space-y-2">
            <h4 className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <Medal size={14} className="text-pink-400" />
              Most Skilled
            </h4>
            <div className={`flex justify-between items-center ${isDarkMode ? 'bg-[#121422] border-white/5' : 'bg-slate-50 border-slate-200 shadow-sm'} p-4 rounded-xl border`}>
              <span className={isDarkMode ? 'text-white font-bold' : 'text-slate-900 font-bold'}>{stats.mostSkilled.name}</span>
              <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{stats.mostSkilled.count} skills</span>
            </div>
          </div>
        )}

        {/* Skill Gaps */}
        {stats.skillGaps.length > 0 && (
          <div className="space-y-2">
            <h4 className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <AlertTriangle size={14} className="text-orange-400" />
              Skill Gaps ({stats.skillGaps.length} Person)
            </h4>
            <div className="flex flex-wrap gap-2">
              {stats.skillGaps.map((s, i) => (
                <span key={i} className={`px-3 py-1.5 rounded-md ${isDarkMode ? 'bg-yellow-400/20 text-yellow-200' : 'bg-yellow-100 text-yellow-800'} text-xs font-semibold`}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
