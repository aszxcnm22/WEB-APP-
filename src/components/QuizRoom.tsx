import React, { useState, useEffect, FC, ReactNode } from 'react';
import { ChineseWord, QuizQuestion, HSKSystem, UserStats } from '../types';
import { Award, Check, HelpCircle, AlertTriangle, RefreshCw, Volume2, ArrowRight, Loader2 } from 'lucide-react';

interface QuizRoomProps {
  system: HSKSystem;
  level: string;
  words: ChineseWord[];
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onAddLog: (action: string, details: string) => void;
}

export default function QuizRoom({
  system,
  level,
  words,
  stats,
  onUpdateStats,
  onAddLog,
}: QuizRoomProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  useEffect(() => {
    startNewQuiz();
  }, [words, system, level]);

  const startNewQuiz = () => {
    if (words.length < 3) {
      setQuestions([]);
      return;
    }

    // Generate questions from the word list
    const generatedQuestions: QuizQuestion[] = [];
    const questionTypes: Array<'char-to-meaning' | 'pinyin-to-char' | 'meaning-to-char'> = [
      'char-to-meaning',
      'pinyin-to-char',
      'meaning-to-char'
    ];

    words.forEach((word, index) => {
      // Pick a random question type
      const type = questionTypes[index % questionTypes.length];
      
      let questionText = '';
      let correctAnswer = '';
      
      if (type === 'char-to-meaning') {
        questionText = `คำศัพท์ "${word.character}" มีความหมายตรงกับข้อใด?`;
        correctAnswer = word.thaiMeaning;
      } else if (type === 'pinyin-to-char') {
        questionText = `คำอ่านออกเสียง "${word.pinyin}" เขียนเป็นตัวอักษรจีนแบบใด?`;
        correctAnswer = word.character;
      } else {
        questionText = `คำว่า "${word.thaiMeaning}" มีความสัมพันธ์กับคำอ่านพินอินตัวไหน?`;
        correctAnswer = `${word.character} (${word.pinyin})`;
      }

      // Generate options (correct + 3 random distractors)
      const optionsSet = new Set<string>();
      optionsSet.add(correctAnswer);

      // Get potential distractors
      const otherWords = words.filter((w) => w.character !== word.character);
      
      // Shuffle otherWords and grab up to 3 distractors
      const shuffledOthers = [...otherWords].sort(() => Math.random() - 0.5);
      
      for (const otherWord of shuffledOthers) {
        if (optionsSet.size >= 4) break;
        
        if (type === 'char-to-meaning') {
          optionsSet.add(otherWord.thaiMeaning);
        } else if (type === 'pinyin-to-char') {
          optionsSet.add(otherWord.character);
        } else {
          optionsSet.add(`${otherWord.character} (${otherWord.pinyin})`);
        }
      }

      // If we still don't have 4 options, pad them with standard backups
      const padOptions = ['เรียนรู้', 'ขอบคุณ', 'โทรศัพท์', 'คุณครู', 'แอปเปิ้ล', 'สวัสดี'];
      for (const pad of padOptions) {
        if (optionsSet.size >= 4) break;
        optionsSet.add(pad);
      }

      // Convert set to array and shuffle
      const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

      generatedQuestions.push({
        id: `quiz_${word.id}_${Date.now()}`,
        type,
        questionText,
        word,
        options,
        correctAnswer,
      });
    });

    // Shuffle final questions list
    const finalQuestions = generatedQuestions.sort(() => Math.random() - 0.5);

    setQuestions(finalQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const playPronunciation = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsPlayingSound(true);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      utterance.onend = () => setIsPlayingSound(false);
      utterance.onerror = () => setIsPlayingSound(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Play audio automatically on 'listening' context or when clicking play sound
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (currentQuestion) {
      // Play Chinese pronunciation for reinforcement
      playPronunciation(currentQuestion.word.character);
    }
  }, [currentIndex, questions]);

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleVerifyAnswer = () => {
    if (isAnswered || !selectedOption || !currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizFinished(true);
    
    // Calculate final score percentage
    const finalPercent = Math.round((score / questions.length) * 100);
    const levelKey = `${system}_${level}`;
    const currentHigh = stats.quizHighScores[levelKey] || 0;

    let updatedHighScores = { ...stats.quizHighScores };
    if (finalPercent > currentHigh) {
      updatedHighScores[levelKey] = finalPercent;
    }

    // Log the result and update stats
    onUpdateStats({
      ...stats,
      quizHighScores: updatedHighScores,
    });

    onAddLog(
      'ทำข้อสอบเสร็จสิ้น',
      `ทดสอบ HSK ระดับ ${level} ได้คะแนนสำเร็จ ${score}/${questions.length} (${finalPercent}%)`
    );
  };

  const getClassicalRank = (percent: number) => {
    if (percent >= 90) return { title: '狀元 (Zhuangyuan / จอหงวน)', desc: 'บรรลุความเชี่ยวชาญระดับไร้ผู้ต้าน! ท่องแท้แม่นยำดั่งผู้สอบได้อันดับหนึ่งของแผ่นดิน', color: 'text-red-700 bg-red-100' };
    if (percent >= 70) return { title: '探花 (Tanhua / นักวิชาการเอก)', desc: 'ทักษะเยี่ยมยอด เกือบไร้ที่ติ! ความรู้ลึกซึ้งและเฉียบคมมาก', color: 'text-amber-700 bg-amber-100' };
    if (percent >= 50) return { title: '秀才 (Xiucai / บัณฑิต)', desc: 'สอบผ่าน! มีความก้าวหน้าเด่นชัด หมั่นฝึกปรือพู่กันและคัดศัพท์เพิ่มอีกนิดนะ', color: 'text-blue-700 bg-blue-100' };
    return { title: '童生 (Tongsheng / ผู้ศึกษาใหม่)', desc: 'ยังไม่ผ่านเกณฑ์ ปูพื้นฐานและคัดศัพท์เพิ่มเติมในสำรับ Flashcards แล้วกลับมาท้าทายใหม่!', color: 'text-stone-700 bg-stone-100' };
  };

  if (words.length < 3) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto shadow-sm" id="quiz-not-enough-words">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h4 className="font-bold text-slate-900">คำศัพท์มีไม่เพียงพอต่อการจัดแบบฝึกหัด</h4>
        <p className="text-xs text-slate-500 leading-relaxed">
          ความต้องการขั้นต่ำ: ต้องมีคำศัพท์ในสำรับอย่างน้อย 3 คำเพื่อจัดแบบฝึกหัดคำถามตัวเลือกสี่ทางเลือก โปรดกลับไปที่ห้อง Flashcards และกดปุ่ม "สร้างคำศัพท์เพิ่มด้วย AI" เพื่อป้อนคำศัพท์ใหม่เพิ่มเข้ามา
        </p>
      </div>
    );
  }

  if (quizFinished && currentQuestion) {
    const finalPercent = Math.round((score / questions.length) * 100);
    const rank = getClassicalRank(finalPercent);

    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-xl mx-auto shadow-md text-center space-y-6" id="quiz-finish-panel">
        <div className="p-4 bg-slate-50 text-[#C41E3A] rounded-3xl inline-flex shadow-2xs border border-slate-150">
          <Award className="w-12 h-12" />
        </div>

        <div className="space-y-1">
          <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest">ยินดีด้วย! จบบททดสอบแล้ว</p>
          <h3 className="text-lg font-bold text-slate-900">ระดับที่ทดสอบ: {system === 'traditional' ? `Traditional HSK ${level}` : `New HSK ${level}`}</h3>
        </div>

        {/* Big Score Block */}
        <div className="py-4">
          <p className="text-5xl font-black text-slate-900 tracking-tight">
            {score} <span className="text-2xl font-bold text-slate-300">/ {questions.length}</span>
          </p>
          <p className="text-sm font-bold text-slate-500 mt-1">คิดเป็นอัตราความถูกต้อง {finalPercent}%</p>
        </div>

        {/* Rank Badge */}
        <div className={`p-5 rounded-3xl border border-slate-200 max-w-sm mx-auto space-y-2 ${rank.color}`} id="classical-rank-badge">
          <h4 className="font-bold text-base tracking-wide">{rank.title}</h4>
          <p className="text-xs leading-relaxed opacity-90">{rank.desc}</p>
        </div>

        {/* Navigation Action */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <button
            id="quiz-restart-btn"
            onClick={startNewQuiz}
            className="flex items-center justify-center space-x-2 py-2.5 px-6 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer bg-white"
          >
            <RefreshCw className="w-4 h-4" />
            <span>ทำแบบทดสอบอีกครั้ง</span>
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-12 flex justify-center items-center" id="quiz-loading-state">
        <Loader2 className="w-8 h-8 text-[#C41E3A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6" id="active-quiz-panel">
      {/* Quiz Progress header */}
      <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-wider">
        <span>ข้อที่ {currentIndex + 1} จาก {questions.length}</span>
        <span>คะแนนปัจจุบัน: {score}</span>
      </div>

      <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-[#C41E3A] h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-4">
          
          {/* Audio Pronunciation utility */}
          <div className="flex justify-center">
            <button
              id="quiz-sound-pronounce-btn"
              onClick={() => playPronunciation(currentQuestion.word.character)}
              disabled={isPlayingSound}
              className={`p-4 rounded-full border shadow-2xs transition-all cursor-pointer ${
                isPlayingSound
                  ? 'bg-red-50 border-[#C41E3A] text-[#C41E3A] animate-pulse'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>

          <h3 className="text-lg font-bold text-slate-900 leading-snug px-2">
            {currentQuestion.questionText}
          </h3>

          {/* Faint context clues to encourage reading standard character shapes */}
          {currentQuestion.type !== 'pinyin-to-char' && (
            <div className="inline-block py-1.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-bold font-mono text-sm shadow-2xs">
              {currentQuestion.word.character}
            </div>
          )}
        </div>

        {/* Four multiple choice options */}
        <div className="grid grid-cols-1 gap-3" id="quiz-options-list">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === currentQuestion.correctAnswer;
            
            // Set styles based on answering state
            let optionStyles = 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 text-slate-700';
            
            if (isAnswered) {
              if (isCorrect) {
                optionStyles = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold ring-2 ring-emerald-150';
              } else if (isSelected) {
                optionStyles = 'border-red-500 bg-red-50 text-red-800 font-bold ring-2 ring-red-150';
              } else {
                optionStyles = 'border-slate-100 bg-slate-100/30 text-slate-400 opacity-60';
              }
            } else if (isSelected) {
              optionStyles = 'border-[#C41E3A] bg-red-50/30 text-[#C41E3A] font-bold ring-2 ring-[#C41E3A]/25';
            }

            return (
              <button
                key={idx}
                id={`quiz-option-${idx}`}
                disabled={isAnswered}
                onClick={() => handleSelectOption(option)}
                className={`w-full p-4 text-left text-sm rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${optionStyles}`}
              >
                <span>{option}</span>
                {isAnswered && isCorrect && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          {!isAnswered ? (
            <button
              id="quiz-verify-btn"
              disabled={!selectedOption}
              onClick={handleVerifyAnswer}
              className="py-2.5 px-6 bg-slate-950 hover:bg-slate-900 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
            >
              ตรวจสอบคำตอบ
            </button>
          ) : (
            <button
              id="quiz-next-btn"
              onClick={handleNextQuestion}
              className="flex items-center space-x-1 py-2.5 px-6 bg-[#C41E3A] hover:bg-[#A3162D] text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer animate-fade-in"
            >
              <span>{currentIndex < questions.length - 1 ? 'ข้อต่อไป' : 'เสร็จสิ้นแบบฝึกหัด'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
