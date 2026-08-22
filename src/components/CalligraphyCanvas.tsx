import React, { useRef, useState, useEffect } from 'react';
import { ChineseWord, WritingFeedback } from '../types';
import { AlertCircle, Brush, CheckCircle, Eraser, Info, Loader2, Sparkles } from 'lucide-react';

interface CalligraphyCanvasProps {
  words: ChineseWord[];
  onAddLog: (action: string, details: string) => void;
  initialCharacter?: string;
  onClearInitialCharacter?: () => void;
}

export default function CalligraphyCanvas({
  words,
  onAddLog,
  initialCharacter,
  onClearInitialCharacter,
}: CalligraphyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#1e293b'); // slate-800
  const [brushWidth, setBrushWidth] = useState(8);
  const [selectedChar, setSelectedChar] = useState('');
  const [customChar, setCustomChar] = useState('');
  const [showTrace, setShowTrace] = useState(true);
  const [traceOpacity, setTraceOpacity] = useState(0.12);

  // AI Verification State
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Set default character on load or words update or when initialCharacter changes
  useEffect(() => {
    if (initialCharacter) {
      const existsInWords = words.some(w => w.character === initialCharacter);
      if (existsInWords) {
        setSelectedChar(initialCharacter);
        setCustomChar('');
      } else {
        setSelectedChar('');
        setCustomChar(initialCharacter);
      }
      setFeedback(null);
      setErrorMsg(null);
      clearCanvas();
      if (onClearInitialCharacter) {
        onClearInitialCharacter();
      }
    } else if (words.length > 0) {
      const currentExists = words.some(w => w.character === selectedChar);
      if (!selectedChar && !customChar) {
        setSelectedChar(words[0].character);
        setFeedback(null);
        setErrorMsg(null);
        clearCanvas();
      } else if (selectedChar && !currentExists) {
        // Fallback if level changes and current selection is invalid
        setSelectedChar(words[0].character);
        setCustomChar('');
        setFeedback(null);
        setErrorMsg(null);
        clearCanvas();
      }
    }
  }, [words, initialCharacter]);

  // Handle Canvas Drawing Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Standard high-DPI scaling
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const context = canvas.getContext('2d');
    if (!context) return;
    context.scale(2, 2);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = brushColor;
    context.lineWidth = brushWidth;
    contextRef.current = context;

    clearCanvas();
  }, [brushColor, brushWidth]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing || !contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;
    const context = contextRef.current;
    
    // Clear everything
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Convert canvas to base64, then submit to the Gemini review backend
  const checkHandwritingWithAI = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if user has drawn something (we can check bounding box or just verify canvas is painted)
    // To be simple and robust, let's export the image
    setIsChecking(true);
    setErrorMsg(null);
    setFeedback(null);

    try {
      const activeChar = customChar.trim() ? customChar.trim().substring(0, 1) : selectedChar;
      const targetWord = words.find((w) => w.character === activeChar);
      const activePinyin = targetWord ? targetWord.pinyin : '';

      // Export the canvas as a base64 PNG
      const dataUrl = canvas.toDataURL('image/png');

      const res = await fetch('/api/verify-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expectedCharacter: activeChar,
          expectedPinyin: activePinyin,
          image: dataUrl,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'การส่งตรวจสอบพู่กันของตัวอักษรล้มเหลว');
      }

      setFeedback(data.feedback);
      onAddLog('ตรวจสอบอักษรเขียนมือ', `ส่งผลงานเขียนตัวอักษร "${activeChar}" ให้ Gemini ตรวจสอบ และได้รับคะแนน ${data.feedback.score}/100`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'ไม่สามารถเชื่อมต่อกับบริการ AI Handwriting Reviewer ในขณะนี้');
    } finally {
      setIsChecking(false);
    }
  };

  const currentDisplayChar = customChar.trim() ? customChar.trim().substring(0, 1) : selectedChar;

  const getAccuracyColor = (acc: string) => {
    switch (acc) {
      case 'excellent': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'fair': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  const getAccuracyLabelTh = (acc: string) => {
    switch (acc) {
      case 'excellent': return 'ยอดเยี่ยม (Excellent)';
      case 'good': return 'ดี (Good)';
      case 'fair': return 'พอใช้ (Fair)';
      default: return 'ควรปรับปรุง (Poor)';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="calligraphy-practice-section">
      
      {/* Left panel: Controls and Canvas */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-slate-950 text-base">ฝึกเขียนพู่กันและตัวอักษรจีน</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                เขียนอักษรจีนลงบนตารางไกด์ คัดลายมือ และส่งให้ AI ให้คะแนนพร้อมคำแนะนำแบบละเอียด
              </p>
            </div>

            {/* Target Selectors */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-wider">เลือกตัวอักษร</span>
                <select
                  id="hsk-character-selector"
                  value={selectedChar}
                  onChange={(e) => {
                    setSelectedChar(e.target.value);
                    setCustomChar('');
                    setFeedback(null);
                    setErrorMsg(null);
                    clearCanvas();
                  }}
                  className="py-1.5 px-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 focus:outline-none cursor-pointer"
                >
                  {words.length === 0 ? (
                    <option value="">ไม่มีตัวอักษร</option>
                  ) : (
                    words.map((w, idx) => (
                      <option key={idx} value={w.character}>
                        {w.character} ({w.pinyin})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-wider">หรือฝึกเอง</span>
                <input
                  id="custom-character-input"
                  type="text"
                  maxLength={1}
                  placeholder="เช่น 你, 我"
                  value={customChar}
                  onChange={(e) => {
                    setCustomChar(e.target.value);
                    setFeedback(null);
                    setErrorMsg(null);
                    clearCanvas();
                  }}
                  className="py-1.5 px-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 focus:outline-none w-24 text-center"
                />
              </div>
            </div>
          </div>

          {/* Calligraphy Board Wrapper */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
            
            {/* The calligraphic "Mi Zi Ge" Grid container */}
            <div className="relative w-80 h-80 border-4 border-[#C41E3A] bg-[#FAF9F6] rounded-lg shadow-sm overflow-hidden select-none" id="mizige-grid-wrapper">
              
              {/* Dotted lines background for "Mi Zi Ge" (米字格) using SVG overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {/* Horizontal dotted line */}
                <line x1="0" y1="160" x2="320" y2="160" stroke="#fca5a5" strokeWidth="1.5" strokeDasharray="6,4" />
                {/* Vertical dotted line */}
                <line x1="160" y1="0" x2="160" y2="320" stroke="#fca5a5" strokeWidth="1.5" strokeDasharray="6,4" />
                {/* Diagonal line 1 (top-left to bottom-right) */}
                <line x1="0" y1="0" x2="320" y2="320" stroke="#fca5a5" strokeWidth="1" strokeDasharray="4,4" />
                {/* Diagonal line 2 (bottom-left to top-right) */}
                <line x1="0" y1="320" x2="320" y2="0" stroke="#fca5a5" strokeWidth="1" strokeDasharray="4,4" />
              </svg>

              {/* Background Tracing overlay (faint expected character) */}
              {showTrace && currentDisplayChar && (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none font-serif text-[180px] leading-none select-none transition-all duration-300"
                  style={{ color: '#C41E3A', opacity: traceOpacity }}
                >
                  {currentDisplayChar}
                </div>
              )}

              {/* Painting Canvas */}
              <canvas
                id="handwriting-canvas"
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none"
              />
            </div>

            {/* Brush Controls Panel */}
            <div className="flex sm:flex-col items-center sm:items-start justify-center gap-4 bg-slate-50 p-4 border border-slate-200 rounded-2xl w-full sm:w-auto" id="brush-controls">
              
              {/* Colors */}
              <div className="space-y-1.5 flex-1 sm:flex-initial">
                <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">สีพู่กัน</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setBrushColor('#1e293b')}
                    className={`w-6 h-6 rounded-full bg-slate-800 border-2 cursor-pointer ${
                      brushColor === '#1e293b' ? 'border-[#C41E3A] ring-2 ring-red-100' : 'border-transparent'
                    }`}
                    title="หมึกถ่านศิลา"
                  />
                  <button
                    onClick={() => setBrushColor('#475569')}
                    className={`w-6 h-6 rounded-full bg-slate-500 border-2 cursor-pointer ${
                      brushColor === '#475569' ? 'border-[#C41E3A] ring-2 ring-red-100' : 'border-transparent'
                    }`}
                    title="หมึกถ่านเทา"
                  />
                  <button
                    onClick={() => setBrushColor('#C41E3A')}
                    className={`w-6 h-6 rounded-full bg-[#C41E3A] border-2 cursor-pointer ${
                      brushColor === '#C41E3A' ? 'border-[#C41E3A] ring-2 ring-red-100' : 'border-transparent'
                    }`}
                    title="สีแดงชาดพู่กัน"
                  />
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-1.5 flex-1 sm:flex-initial">
                <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">ขนาดพู่กัน</span>
                <div className="flex space-x-1.5 bg-white border border-slate-200 p-0.5 rounded-lg">
                  <button
                    onClick={() => setBrushWidth(4)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      brushWidth === 4 ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    เล็ก
                  </button>
                  <button
                    onClick={() => setBrushWidth(8)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      brushWidth === 8 ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    กลาง
                  </button>
                  <button
                    onClick={() => setBrushWidth(12)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      brushWidth === 12 ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    ใหญ่
                  </button>
                </div>
              </div>

              {/* Trace Opacity Toggle */}
              <div className="space-y-1.5 flex-1 sm:flex-initial hidden sm:block">
                <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">ความจางตัวนำ</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="toggle-trace"
                    checked={showTrace}
                    onChange={(e) => setShowTrace(e.target.checked)}
                    className="rounded border-slate-300 text-[#C41E3A] focus:ring-[#C41E3A]"
                  />
                  <input
                    type="range"
                    min="0.05"
                    max="0.40"
                    step="0.05"
                    disabled={!showTrace}
                    value={traceOpacity}
                    onChange={(e) => setTraceOpacity(parseFloat(e.target.value))}
                    className="w-20 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#C41E3A] disabled:opacity-40"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons under canvas */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <button
              id="clear-canvas-btn"
              onClick={clearCanvas}
              className="flex items-center space-x-1.5 px-4 py-2 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-all border border-slate-200 shadow-xs cursor-pointer"
            >
              <Eraser className="w-4 h-4" />
              <span>ล้างหน้าจอ</span>
            </button>

            <button
              id="ai-handwriting-check-btn"
              onClick={checkHandwritingWithAI}
              disabled={isChecking || !currentDisplayChar}
              className="flex items-center space-x-2 px-5 py-2.5 bg-[#C41E3A] hover:bg-[#A3162D] disabled:bg-slate-400 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังตรวจผลงาน...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>ให้ AI ตรวจพู่กัน (Gemini)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right panel: AI Handwriting Assessment Feedback */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* If loading checker */}
        {isChecking && (
          <div className="bg-amber-50/20 border-2 border-dashed border-amber-200 rounded-3xl p-8 text-center space-y-6 h-full flex flex-col justify-center items-center shadow-sm min-h-[360px]" id="checking-loading-state">
            <Loader2 className="w-10 h-10 text-[#C41E3A] animate-spin" />
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800">ส่งผลงานให้คุณครู AI ประเมิน...</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Gemini กำลังวิเคราะห์โครงสร้าง น้ำหนักพู่กัน บาลานซ์สี่ด้าน และเส้นปัดพู่กันตามอัญพจนศิลป์จีนแบบคลาสสิก
              </p>
            </div>
            <div className="bg-white p-4 border border-slate-200 rounded-2xl max-w-xs text-[11px] text-slate-700 font-serif italic text-left shadow-2xs">
              "熟能生巧 (Shúnéngshēngqiǎo) - การฝึกฝนด้วยความตั้งใจ บ่อยครั้งจะทำให้เกิดความชำนาญและสมบูรณ์แบบได้เสมอ"
            </div>
          </div>
        )}

        {/* If Error */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 space-y-4" id="checking-error-state">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h4 className="font-bold text-sm">เกิดข้อผิดพลาดในการประเมิน</h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{errorMsg}</p>
            <button
              onClick={checkHandwritingWithAI}
              className="py-1.5 px-3 bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              พยายามอีกครั้ง
            </button>
          </div>
        )}

        {/* If Success Feedback is ready */}
        {feedback && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6" id="checking-feedback-state">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <CheckCircle className="w-5 h-5 text-emerald-600" /> ผลการประเมินจากพู่กัน AI
              </h4>
              <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border ${getAccuracyColor(feedback.accuracy)}`}>
                {getAccuracyLabelTh(feedback.accuracy)}
              </span>
            </div>

            {/* Score circle gauge */}
            <div className="flex flex-col items-center justify-center space-y-2 py-2">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Gray Circle */}
                  <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                  {/* Score Path Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={feedback.score >= 80 ? '#10b981' : feedback.score >= 60 ? '#3b82f6' : feedback.score >= 40 ? '#f59e0b' : '#C41E3A'}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - feedback.score / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-800 leading-none">{feedback.score}</span>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">เต็ม 100</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 font-bold">เกณฑ์คะแนนทัศนะศิลป์</p>
            </div>

            {/* Feedback items */}
            <div className="space-y-4">
              
              <div className="space-y-1.5">
                <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Brush className="w-3.5 h-3.5 text-slate-400" /> เส้นสายและน้ำหนักพู่กัน (Brush Strokes)
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {feedback.strokesFeedback}
                </p>
              </div>

              <div className="space-y-1.5">
                <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400" /> สัดส่วนและโครงสร้าง (Grid Balance)
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {feedback.proportionsFeedback}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h5 className="text-xs font-black text-[#C41E3A] uppercase tracking-wider">
                  คำแนะนำเพื่อการพัฒนาลายมือ
                </h5>
                <p className="text-xs text-slate-700 leading-relaxed font-bold">
                  {feedback.generalAdvice}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setFeedback(null);
                clearCanvas();
              }}
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              เขียนต่อ/ฝึกซ้ำอีกรอบ
            </button>
          </div>
        )}

        {/* Static Prompt overlay instructions when no feedback or checker has run yet */}
        {!isChecking && !feedback && !errorMsg && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-center items-center text-center space-y-4 min-h-[360px]" id="checking-empty-state">
            <div className="p-3 bg-[#C41E3A]/10 rounded-2xl text-[#C41E3A]">
              <Brush className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm">ยินดีต้อนรับสู่ห้องคัดลายมือ!</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                คัดเขียนตัวอักษรจีนเดี่ยวลงบนตารางสีแดงตามแบบตัวอย่างไกด์ คุณสามารถลบและเขียนใหม่ได้ไม่จำกัด เมื่อพร้อมแล้วคลิกปุ่ม "ให้ AI ตรวจพู่กัน" เพื่อรับผลงานวิเคราะห์จาก Gemini ทันที!
              </p>
            </div>
            <div className="text-[10px] text-slate-400 max-w-xs flex items-center justify-center gap-1.5 bg-slate-50 p-2.5 border border-slate-100 rounded-xl">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" /> รองรับทั้งปากกา สไตลัส เมาส์ และการวาดผ่านหน้าจอสัมผัส
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
