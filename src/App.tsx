import React, { useState, useEffect } from 'react';
import { HSKSystem, UserStats } from './types';
import { PREBUILT_VOCABULARY } from './data/hskData';
import StatsDashboard from './components/StatsDashboard';
import FlashcardsView from './components/FlashcardsView';
import CalligraphyCanvas from './components/CalligraphyCanvas';
import QuizRoom from './components/QuizRoom';
import { BookOpen, Award, PenTool, LayoutDashboard, Globe } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'flashcards' | 'calligraphy' | 'quiz'>('dashboard');

  // HSK Selection State
  const [system, setSystem] = useState<HSKSystem>('traditional');
  const [selectedLevel, setSelectedLevel] = useState<string>('1');

  // Character selected for quick calligraphy practice shortcut
  const [characterToPractice, setCharacterToPractice] = useState<string>('');

  // Stats State
  const [stats, setStats] = useState<UserStats>({
    masteredWordsCount: 0,
    quizHighScores: {},
    streak: 0,
    lastStudyDate: null,
    history: [],
  });

  // Load stats from localStorage on mount
  useEffect(() => {
    const savedStatsJson = localStorage.getItem('chinese_learning_stats');
    if (savedStatsJson) {
      try {
        const parsedStats: UserStats = JSON.parse(savedStatsJson);
        // Process streak logic
        const updatedStats = checkAndUpdateStreak(parsedStats);
        setStats(updatedStats);
        localStorage.setItem('chinese_learning_stats', JSON.stringify(updatedStats));
      } catch (err) {
        console.error('Failed to parse user stats:', err);
        initializeDefaultStats();
      }
    } else {
      initializeDefaultStats();
    }
  }, []);

  const initializeDefaultStats = () => {
    const freshStats: UserStats = {
      masteredWordsCount: 0,
      quizHighScores: {},
      streak: 1,
      lastStudyDate: new Date().toISOString().split('T')[0],
      history: [
        {
          date: new Date().toISOString(),
          action: 'เริ่มใช้งานระบบครั้งแรก',
          details: 'ยินดีต้อนรับสู่แอปพลิเคชันเรียนรู้คำศัพท์และฝึกเขียนอักษรจีน!',
        },
      ],
    };
    setStats(freshStats);
    localStorage.setItem('chinese_learning_stats', JSON.stringify(freshStats));
  };

  const checkAndUpdateStreak = (currentStats: UserStats): UserStats => {
    const todayStr = new Date().toISOString().split('T')[0];
    const lastDate = currentStats.lastStudyDate;

    if (!lastDate) {
      return {
        ...currentStats,
        streak: 1,
        lastStudyDate: todayStr,
      };
    }

    if (lastDate === todayStr) {
      // Studied today already, keep streak
      return currentStats;
    }

    // Calculate difference in days
    const lastTime = new Date(lastDate).getTime();
    const todayTime = new Date(todayStr).getTime();
    const diffDays = Math.round((todayTime - lastTime) / (1000 * 60 * 60 * 24));

    let newStreak = currentStats.streak;
    if (diffDays === 1) {
      // Studied yesterday, increment streak!
      newStreak += 1;
    } else if (diffDays > 1) {
      // Missed a day or more, reset streak
      newStreak = 1;
    }

    return {
      ...currentStats,
      streak: newStreak,
      lastStudyDate: todayStr,
    };
  };

  const handleUpdateStats = (newStats: UserStats) => {
    setStats(newStats);
    localStorage.setItem('chinese_learning_stats', JSON.stringify(newStats));
  };

  // Add an entry to the user activity history logs
  const handleAddLog = (action: string, details: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Check and update streak as part of performing any positive learning action
    const currentWithStreak = checkAndUpdateStreak(stats);

    const updatedStats: UserStats = {
      ...currentWithStreak,
      lastStudyDate: todayStr,
      history: [
        {
          date: new Date().toISOString(),
          action,
          details,
        },
        ...currentWithStreak.history,
      ],
    };

    setStats(updatedStats);
    localStorage.setItem('chinese_learning_stats', JSON.stringify(updatedStats));
  };

  const handleResetStats = () => {
    localStorage.removeItem('chinese_learning_stats');
    localStorage.removeItem('mastered_word_ids');
    // Clear dynamic AI generated vocabulary levels as well
    const systems: HSKSystem[] = ['traditional', 'new'];
    systems.forEach((sys) => {
      const lvls = sys === 'traditional' ? 6 : 9;
      for (let i = 1; i <= lvls; i++) {
        localStorage.removeItem(`ai_vocab_${sys}_${i}`);
      }
    });

    initializeDefaultStats();
  };

  // Load words of current selected level/system (merging static and dynamic storage ones)
  const [currentLevelWords, setCurrentLevelWords] = useState<any[]>([]);

  useEffect(() => {
    const prebuilt = PREBUILT_VOCABULARY[system][selectedLevel] || [];
    const savedAIJson = localStorage.getItem(`ai_vocab_${system}_${selectedLevel}`);
    const aiWords = savedAIJson ? JSON.parse(savedAIJson) : [];
    setCurrentLevelWords([...prebuilt, ...aiWords]);
  }, [system, selectedLevel, stats.history]);

  return (
    <div className="h-screen w-full flex flex-col bg-[#FAF9F6] text-slate-800 font-sans overflow-hidden" id="app-container">
      {/* Header banner */}
      <header className="h-16 flex items-center justify-between px-6 sm:px-8 bg-white border-b border-slate-200 shadow-xs z-20 shrink-0" id="app-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#C41E3A] rounded-lg flex items-center justify-center text-white font-bold text-xl select-none" id="brand-logo">漢</div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight leading-none text-slate-900">Hànzì Master <span className="text-slate-400 font-normal">| 汉字大师</span></h1>
            <p className="text-[10px] font-bold text-[#C41E3A] uppercase tracking-widest mt-1">HSK Study & Calligraphy</p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Daily Goal Progress Bar */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Daily Streak Goal</span>
            <div className="w-32 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden border border-slate-200/50">
              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${Math.min(stats.streak * 20, 100)}%` }}></div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
              {stats.streak}🔥
            </div>
          </div>
        </div>
      </header>

      {/* Content Area with responsive Sidebar + Main Panel */}
      <div className="flex-grow flex flex-col md:flex-row min-h-0 overflow-hidden" id="app-body-container">
        {/* Sidebar Left Navigation */}
        <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col p-6 shrink-0 justify-between" id="app-sidebar">
          <div className="space-y-6">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400">Main Menu</div>
            <nav className="space-y-1" id="sidebar-nav">
              <button
                id="nav-dashboard"
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[#C41E3A]/10 text-[#C41E3A]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>หน้าหลัก</span>
              </button>

              <button
                id="nav-flashcards"
                onClick={() => setActiveTab('flashcards')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  activeTab === 'flashcards'
                    ? 'bg-[#C41E3A]/10 text-[#C41E3A]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Flashcards</span>
              </button>

              <button
                id="nav-calligraphy"
                onClick={() => setActiveTab('calligraphy')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  activeTab === 'calligraphy'
                    ? 'bg-[#C41E3A]/10 text-[#C41E3A]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <PenTool className="w-4 h-4 shrink-0" />
                <span>ฝึกเขียนพู่กัน</span>
              </button>

              <button
                id="nav-quiz"
                onClick={() => setActiveTab('quiz')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  activeTab === 'quiz'
                    ? 'bg-[#C41E3A]/10 text-[#C41E3A]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Award className="w-4 h-4 shrink-0" />
                <span>ทำข้อสอบ (Quiz)</span>
              </button>
            </nav>
          </div>

          {/* Sidebar Active Path Widget */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
            <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase">Active Path</h3>
            <div className="flex items-center justify-between">
              <span className="text-[10px] px-2 py-1 bg-amber-100 text-amber-800 rounded font-bold">
                HSK {selectedLevel} {system === 'traditional' ? 'Classic' : 'New'}
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-bold">
                {currentLevelWords.length} คำ
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#C41E3A] h-full" style={{ width: system === 'traditional' ? `${(parseInt(selectedLevel) / 6) * 100}%` : `${(parseInt(selectedLevel) / 9) * 100}%` }}></div>
            </div>
          </div>
        </aside>

        {/* Mobile navigation bar */}
        <nav className="md:hidden flex justify-around bg-white border-b border-slate-200 px-2 py-2 shrink-0 z-10" id="mobile-nav-bar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${
              activeTab === 'dashboard' ? 'text-[#C41E3A]' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[9px] font-bold mt-1">หน้าหลัก</span>
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${
              activeTab === 'flashcards' ? 'text-[#C41E3A]' : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[9px] font-bold mt-1">Flashcards</span>
          </button>
          <button
            onClick={() => setActiveTab('calligraphy')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${
              activeTab === 'calligraphy' ? 'text-[#C41E3A]' : 'text-slate-500'
            }`}
          >
            <PenTool className="w-5 h-5" />
            <span className="text-[9px] font-bold mt-1">ฝึกเขียน</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${
              activeTab === 'quiz' ? 'text-[#C41E3A]' : 'text-slate-500'
            }`}
          >
            <Award className="w-5 h-5" />
            <span className="text-[9px] font-bold mt-1">ทำข้อสอบ</span>
          </button>
        </nav>

        {/* Main workspace section with viewport scrolling */}
        <section className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#FAF9F6] flex flex-col gap-6" id="workspace-section">
          {activeTab === 'dashboard' && (
            <StatsDashboard
              system={system}
              setSystem={setSystem}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
              stats={stats}
              onResetStats={handleResetStats}
            />
          )}

          {activeTab === 'flashcards' && (
            <FlashcardsView
              system={system}
              level={selectedLevel}
              stats={stats}
              onUpdateStats={handleUpdateStats}
              onAddLog={handleAddLog}
              onPracticeCharacter={(char) => {
                setCharacterToPractice(char);
                setActiveTab('calligraphy');
              }}
            />
          )}

          {activeTab === 'calligraphy' && (
            <CalligraphyCanvas
              words={currentLevelWords}
              onAddLog={handleAddLog}
              initialCharacter={characterToPractice}
              onClearInitialCharacter={() => setCharacterToPractice('')}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizRoom
              system={system}
              level={selectedLevel}
              words={currentLevelWords}
              stats={stats}
              onUpdateStats={handleUpdateStats}
              onAddLog={handleAddLog}
            />
          )}
        </section>
      </div>
    </div>
  );
}
