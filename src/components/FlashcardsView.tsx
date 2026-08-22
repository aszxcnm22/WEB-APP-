import React, { useState, useEffect } from 'react';
import { ChineseWord, HSKSystem, UserStats } from '../types';
import { PREBUILT_VOCABULARY } from '../data/hskData';
import { ChevronLeft, ChevronRight, HelpCircle, Loader2, Play, Sparkles, CheckCircle, RotateCw, PenTool } from 'lucide-react';

interface FlashcardsViewProps {
  system: HSKSystem;
  level: string;
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onAddLog: (action: string, details: string) => void;
  onPracticeCharacter?: (character: string) => void;
}

export default function FlashcardsView({
  system,
  level,
  stats,
  onUpdateStats,
  onAddLog,
  onPracticeCharacter,
}: FlashcardsViewProps) {
  const [words, setWords] = useState<ChineseWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  // Load words when system or level changes
  useEffect(() => {
    // 1. Get prebuilt words
    const prebuilt = PREBUILT_VOCABULARY[system][level] || [];

    // 2. Load custom AI generated words for this level from localStorage
    const savedAIWordsJson = localStorage.getItem(`ai_vocab_${system}_${level}`);
    const aiWords: ChineseWord[] = savedAIWordsJson ? JSON.parse(savedAIWordsJson) : [];

    // Combine
    const allWords = [...prebuilt, ...aiWords];
    setWords(allWords);
    setCurrentIndex(0);
    setIsFlipped(false);
    setErrorMsg(null);

    // 3. Load mastered word IDs
    const savedMastered = localStorage.getItem('mastered_word_ids');
    if (savedMastered) {
      setMasteredIds(JSON.parse(savedMastered));
    }
  }, [system, level]);

  const currentWord: ChineseWord | undefined = words[currentIndex];

  // Browser TTS pronunciation
  const playPronunciation = (e: React.MouseEvent, text: string) => {
    e.stopPropagation(); // Prevent flipping the card on play click
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8; // Friendly pace for learners
      window.speechSynthesis.speak(utterance);
    } else {
      alert('เบราว์เซอร์ของคุณไม่รองรับการออกเสียงแบบสังเคราะห์เสียง (TTS)');
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleToggleMastered = (e: React.MouseEvent, wordId: string) => {
    e.stopPropagation();
    let newMastered = [...masteredIds];
    const isNowMastered = !masteredIds.includes(wordId);

    if (isNowMastered) {
      newMastered.push(wordId);
      // Increment stats and log
      onUpdateStats({
        ...stats,
        masteredWordsCount: stats.masteredWordsCount + 1,
      });
      onAddLog('บันทึกคำศัพท์จำได้', `จำคำศัพท์ "${currentWord?.character}" (${currentWord?.pinyin}) ได้สำเร็จ`);
    } else {
      newMastered = newMastered.filter((id) => id !== wordId);
      onUpdateStats({
        ...stats,
        masteredWordsCount: Math.max(0, stats.masteredWordsCount - 1),
      });
    }

    setMasteredIds(newMastered);
    localStorage.setItem('mastered_word_ids', JSON.stringify(newMastered));
  };

  // Trigger server-side dynamic vocab generation
  const handleGenerateCustomVocab = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const existingCharacters = words.map((w) => w.character);
      const res = await fetch('/api/generate-vocab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system,
          level,
          existingWords: existingCharacters,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate vocabulary.');
      }

      const generatedWords: ChineseWord[] = data.words;

      // Update local storage for AI generated words of this level
      const savedAIWordsJson = localStorage.getItem(`ai_vocab_${system}_${level}`);
      const currentAIWords: ChineseWord[] = savedAIWordsJson ? JSON.parse(savedAIWordsJson) : [];
      const updatedAIWords = [...currentAIWords, ...generatedWords];
      localStorage.setItem(`ai_vocab_${system}_${level}`, JSON.stringify(updatedAIWords));

      // Update state
      const updatedAllWords = [...words, ...generatedWords];
      setWords(updatedAllWords);
      setCurrentIndex(words.length); // Jump to the first newly generated word
      setIsFlipped(false);

      onAddLog('AI สร้างคำศัพท์ใหม่', `ขอให้ AI สร้างคำศัพท์ HSK ${level} เพิ่มอีก 5 คำในสำรับ`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'ไม่สามารถติดต่อ AI เพื่อสร้างคำศัพท์ใหม่ในขณะนี้');
    } finally {
      setIsGenerating(false);
    }
  };

  const totalWords = words.length;
  const currentIsMastered = currentWord ? masteredIds.includes(currentWord.id) : false;
  const masteredInCurrentDeck = words.filter((w) => masteredIds.includes(w.id)).length;
  const progressPercent = totalWords > 0 ? Math.round((masteredInCurrentDeck / totalWords) * 100) : 0;

  return (
    <div className="space-y-6" id="flashcards-section">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-slate-200 rounded-3xl p-6 shadow-sm gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">สำรับคำศัพท์ Flashcards (ระดับ {level})</h3>
          <p className="text-xs text-slate-500 mt-1">
            จำได้แล้ว {masteredInCurrentDeck} จากทั้งหมด {totalWords} คำ ในสำรับนี้ ({progressPercent}%)
          </p>
        </div>

        <button
          id="ai-generate-vocab-btn"
          onClick={handleGenerateCustomVocab}
          disabled={isGenerating}
          className="flex items-center space-x-2 py-2.5 px-4 bg-[#C41E3A] hover:bg-[#A3162D] disabled:bg-red-300 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>AI กำลังจัดทําคำศัพท์...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>สร้างคำศัพท์เพิ่มด้วย Gemini AI</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
        <div
          className="bg-[#C41E3A] h-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium" id="error-alert">
          {errorMsg}
        </div>
      )}

      {/* Card area */}
      {currentWord ? (
        <div className="flex flex-col items-center max-w-xl mx-auto space-y-6">
          {/* Card container with flip effects */}
          <div
            id="interactive-flashcard"
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-96 cursor-pointer select-none relative [perspective:1000px]"
          >
            <div
              className={`w-full h-full rounded-3xl border-2 border-slate-200 shadow-md transition-all duration-500 [transform-style:preserve-3d] ${
                isFlipped ? '[transform:rotateY(180deg)]' : ''
              }`}
            >
              {/* CARD FRONT */}
              <div className="absolute inset-0 w-full h-full bg-[#FDFCFB] rounded-3xl p-8 flex flex-col justify-between [backface-visibility:hidden]">
                {/* Header info */}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                    {currentWord.pos}
                  </span>
                  <button
                    id="pronounce-word-btn"
                    onClick={(e) => playPronunciation(e, currentWord.character)}
                    className="p-3 bg-[#C41E3A]/10 text-[#C41E3A] hover:bg-[#C41E3A]/20 active:scale-95 rounded-full transition-all cursor-pointer"
                    title="ฟังเสียงพากย์"
                  >
                    <Play className="w-5 h-5 fill-[#C41E3A] text-[#C41E3A]" />
                  </button>
                </div>

                {/* Main Chinese Character */}
                <div className="text-center py-4">
                  <h1 className="text-7xl font-bold text-slate-800 tracking-normal filter drop-shadow-xs font-serif leading-none">
                    {currentWord.character}
                  </h1>
                </div>

                {/* Card footer advice */}
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" /> คลิกเพื่อดูความหมายพินอิน
                  </span>
                  <button
                    id="master-vocab-badge"
                    onClick={(e) => handleToggleMastered(e, currentWord.id)}
                    className={`flex items-center space-x-1.5 py-1.5 px-3.5 text-[10px] font-extrabold rounded-full transition-all uppercase tracking-wider cursor-pointer ${
                      currentIsMastered
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle className={`w-3.5 h-3.5 ${currentIsMastered ? 'fill-emerald-600 text-white' : ''}`} />
                    <span>{currentIsMastered ? 'จำได้แล้ว' : 'ยังจำไม่ได้'}</span>
                  </button>
                </div>
              </div>

              {/* CARD BACK */}
              <div className="absolute inset-0 w-full h-full bg-white rounded-3xl p-8 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] border-t-4 border-t-[#C41E3A]">
                {/* Header Back */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-slate-400 font-bold">พินอิน & คำอ่าน</span>
                    <p className="text-xl font-bold text-[#C41E3A] font-mono tracking-wide">{currentWord.pinyin}</p>
                  </div>
                  <button
                    id="pronounce-pinyin-btn"
                    onClick={(e) => playPronunciation(e, currentWord.character)}
                    className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full transition-all cursor-pointer"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Meanings */}
                <div className="space-y-4 py-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ความหมายภาษาไทย</span>
                    <p className="text-lg font-bold text-slate-800">{currentWord.thaiMeaning}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">English Definition</span>
                    <p className="text-sm font-semibold text-slate-600">{currentWord.englishMeaning}</p>
                  </div>
                </div>

                {/* Example sentence */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">ตัวอย่างการใช้งาน</span>
                  <p className="text-sm font-bold text-slate-800 flex items-center justify-between gap-2">
                    <span>{currentWord.exampleSentence}</span>
                    <button
                      id="pronounce-example-btn"
                      onClick={(e) => playPronunciation(e, currentWord.exampleSentence)}
                      className="p-1 hover:bg-slate-200 rounded-md transition-all shrink-0 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-slate-600 text-slate-600" />
                    </button>
                  </p>
                  <p className="text-xs font-semibold text-slate-500 font-mono italic leading-tight">{currentWord.examplePinyin}</p>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">TH: {currentWord.exampleThai}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Practice Writing Button */}
          <button
            id="quick-practice-writing-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (onPracticeCharacter) {
                onPracticeCharacter(currentWord.character);
              }
            }}
            className="w-full py-3.5 px-5 bg-white hover:bg-red-50/20 text-[#C41E3A] font-extrabold text-xs sm:text-sm rounded-2xl border border-[#C41E3A]/30 hover:border-[#C41E3A] transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs group"
          >
            <PenTool className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
            <span>เข้าเมนูฝึกเขียนพู่กันตัว "{currentWord.character}" ทันที</span>
          </button>

          {/* Controls row */}
          <div className="flex items-center justify-between w-full px-2" id="flashcards-controls">
            <button
              id="flashcards-prev-btn"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-3 bg-white hover:bg-slate-50 border border-slate-200 disabled:opacity-40 text-slate-700 rounded-full transition-all shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <span className="text-sm font-bold text-slate-600">
              {currentIndex + 1} / {totalWords}
            </span>

            <button
              id="flashcards-next-btn"
              onClick={handleNext}
              disabled={currentIndex === totalWords - 1}
              className="p-3 bg-white hover:bg-slate-50 border border-slate-200 disabled:opacity-40 text-slate-700 rounded-full transition-all shadow-xs cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm" id="empty-deck-alert">
          <p className="text-slate-500 font-medium">ไม่มีคำศัพท์ในสำรับสำหรับระดับนี้</p>
          <button
            onClick={handleGenerateCustomVocab}
            disabled={isGenerating}
            className="mt-4 inline-flex items-center space-x-2 py-2.5 px-5 bg-[#C41E3A] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#A3162D] transition-all cursor-pointer"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>ขอความช่วยเหลือจาก AI ในการสร้างคำศัพท์</span>
          </button>
        </div>
      )}
    </div>
  );
}
