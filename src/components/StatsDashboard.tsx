import React from 'react';
import { HSKSystem, UserStats } from '../types';
import { LEVEL_DESCRIPTIONS } from '../data/hskData';
import { Award, BookOpen, Flame, History, Layers } from 'lucide-react';

interface StatsDashboardProps {
  system: HSKSystem;
  setSystem: (system: HSKSystem) => void;
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  stats: UserStats;
  onResetStats: () => void;
}

export default function StatsDashboard({
  system,
  setSystem,
  selectedLevel,
  setSelectedLevel,
  stats,
  onResetStats,
}: StatsDashboardProps) {
  const levels = system === 'traditional' ? ['1', '2', '3', '4', '5', '6'] : ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  const getSystemLabel = (sys: HSKSystem) => {
    return sys === 'traditional' ? 'ระบบเดิม (6 ระดับ)' : 'ระบบใหม่ (9 ระดับ)';
  };

  return (
    <div className="space-y-6" id="stats-dashboard">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center space-x-4 shadow-xs" id="stat-streak">
          <div className="p-3 bg-[#C41E3A]/10 rounded-xl text-[#C41E3A]">
            <Flame className="w-6 h-6 fill-[#C41E3A]" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">วันเรียนต่อเนื่อง (Streak)</p>
            <p className="text-3xl font-bold text-slate-800">{stats.streak} วัน</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center space-x-4 shadow-xs" id="stat-mastered">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">คำศัพท์ที่จำได้แล้ว (Mastered)</p>
            <p className="text-3xl font-bold text-slate-800">{stats.masteredWordsCount} คำ</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center space-x-4 shadow-xs" id="stat-quizzes">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">คะแนนสูงสุด Quiz ล่าสุด</p>
            <p className="text-3xl font-bold text-slate-800">
              {Object.keys(stats.quizHighScores).length > 0 
                ? `${Math.max(...Object.values(stats.quizHighScores))}%`
                : 'ยังไม่มีคะแนน'}
            </p>
          </div>
        </div>
      </div>

      {/* System Selection & Info */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6" id="system-selector">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-[#C41E3A] rounded-full inline-block"></span> เลือกระบบการเรียนภาษาจีน
            </h2>
            <p className="text-xs text-slate-500">เลือกดูระดับตาม HSK แบบดั้งเดิม (6 ระดับ) หรือระบบใหม่ 9 ระดับ</p>
          </div>
          <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              id="system-trad-btn"
              onClick={() => {
                setSystem('traditional');
                setSelectedLevel('1');
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                system === 'traditional'
                  ? 'bg-white text-slate-800 shadow-xs border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ระบบเดิม (6 ระดับ)
            </button>
            <button
              id="system-new-btn"
              onClick={() => {
                setSystem('new');
                setSelectedLevel('1');
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                system === 'new'
                  ? 'bg-white text-slate-800 shadow-xs border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ระบบใหม่ (9 ระดับ)
            </button>
          </div>
        </div>

        {/* Level List Slider / Grid */}
        <div className="space-y-4">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">ระดับความยาก ({getSystemLabel(system)})</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" id="level-selection-grid">
            {levels.map((lvl) => {
              const info = LEVEL_DESCRIPTIONS[system][lvl];
              const isSelected = selectedLevel === lvl;
              const hasScore = stats.quizHighScores[`${system}_${lvl}`] !== undefined;
              const score = stats.quizHighScores[`${system}_${lvl}`];

              return (
                <button
                  key={lvl}
                  id={`level-card-${lvl}`}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`relative p-4 rounded-xl border text-left transition-all overflow-hidden cursor-pointer ${
                    isSelected
                      ? 'bg-[#C41E3A] border-[#C41E3A] text-white ring-2 ring-offset-2 ring-[#C41E3A]/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-2xl font-black ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      LV {lvl}
                    </span>
                    {hasScore && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        Score: {score}%
                      </span>
                    )}
                  </div>
                  <p className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-800'}`}>{info?.title || `ระดับ ${lvl}`}</p>
                  <p className={`text-[10px] mt-1 line-clamp-2 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>{info?.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Selected Level Detail Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="level-detail-card">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="px-2.5 py-0.5 text-[10px] font-black bg-[#C41E3A]/10 text-[#C41E3A] rounded-full uppercase tracking-wider">
                ระดับที่เลือก: {system === 'traditional' ? `Traditional HSK ${selectedLevel}` : `New HSK ${selectedLevel}`}
              </span>
              <span className="text-xs text-slate-500 font-bold font-mono">
                ({LEVEL_DESCRIPTIONS[system][selectedLevel]?.countDesc})
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {LEVEL_DESCRIPTIONS[system][selectedLevel]?.title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              {LEVEL_DESCRIPTIONS[system][selectedLevel]?.desc}
            </p>
          </div>
          <div className="shrink-0 flex items-center space-x-2">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-wider">เลือกหัวข้อด้านบนเพื่อเริ่มต้น</p>
              <p className="text-xs text-slate-500 font-bold mt-1">Flashcards | เขียนอักษร | ทำข้อสอบ</p>
            </div>
          </div>
        </div>
      </div>

      {/* History Log & Reset option */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm md:col-span-2 space-y-4" id="recent-activity">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-slate-500" /> บันทึกกิจกรรมการเรียนล่าสุด
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {stats.history.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">ยังไม่มีประวัติการทำกิจกรรม เริ่มต้นศึกษาโดยใช้ Flashcards หรือแบบฝึกหัดด้านล่าง!</p>
            ) : (
              stats.history.slice(0, 5).map((log, index) => (
                <div key={index} className="flex items-start space-x-3 text-xs pb-3 border-b border-slate-100 last:border-b-0">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-[#C41E3A]" />
                  <div className="flex-1 space-y-0.5">
                    <p className="font-semibold text-slate-700">{log.action}</p>
                    <p className="text-slate-500">{log.details}</p>
                  </div>
                  <span className="text-slate-400 font-mono text-[10px] whitespace-nowrap">
                    {new Date(log.date).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4" id="stats-control">
          <div>
            <h4 className="text-sm font-bold text-slate-800">จัดการข้อมูลผู้ใช้</h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">ข้อมูลวันต่อเนื่อง คำศัพท์ที่บันทึก และคะแนนสะสมแบบฝึกหัดจัดเก็บอยู่ในเบราว์เซอร์ของคุณอย่างปลอดภัย</p>
          </div>
          <button
            id="reset-stats-btn"
            onClick={() => {
              if (window.confirm('คุณต้องการรีเซ็ตข้อมูลความคืบหน้าทั้งหมดใช่หรือไม่? ข้อมูลคะแนนและประวัติการเรียนจะหายไปทั้งหมด.')) {
                onResetStats();
              }
            }}
            className="w-full py-2.5 px-4 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-600 hover:text-red-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            รีเซ็ตความก้าวหน้าทั้งหมด
          </button>
        </div>
      </div>
    </div>
  );
}
