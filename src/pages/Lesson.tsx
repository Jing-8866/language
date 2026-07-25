import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  Volume2,
  Mic,
  Eye,
  EyeOff,
  Lightbulb,
  Trophy,
  Clock,
  Star,
  ArrowRight,
  BookOpen,
  MessageCircle,
  Ear,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LESSONS, LANGUAGE_INFO, LEVEL_INFO } from '../data/mockData';
import type { Question, ModuleType } from '../types';

function Flashcard({ word, onNext }: { word: { word: string; translation: string; pronunciation: string; example: string; exampleTranslation: string }; onNext: () => void }) {
  const [flipped, setFlipped] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.volume = 1;
      // 预加载语音，避免首次调用无声
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const match = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
        if (match) utterance.voice = match;
      }
      utteranceRef.current = utterance; // 保持引用，防止 GC
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div
        onClick={() => setFlipped(!flipped)}
        className="relative h-80 cursor-pointer perspective-1000"
        style={{ perspective: '1000px' }}
      >
        <div
          className="relative w-full h-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary-500 via-accent-500 to-primary-600 rounded-3xl p-8 flex flex-col items-center justify-center text-white shadow-2xl"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="absolute top-4 right-4 text-white/50 text-sm">点击翻面</div>
            <button
              onClick={(e) => { e.stopPropagation(); speak(word.word, 'en-US'); }}
              className="mb-6 p-3 bg-white/20 backdrop-blur rounded-full hover:bg-white/30 transition-all"
            >
              <Volume2 className="w-7 h-7" />
            </button>
            <div className="text-5xl font-bold mb-4 text-center">{word.word}</div>
            <div className="text-xl text-white/80 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur">
              {word.pronunciation}
            </div>
          </div>
          <div
            className="absolute inset-0 bg-white rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl border-4 border-primary-100"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="text-4xl font-bold text-gray-800 mb-2 text-center">{word.translation}</div>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full my-4" />
            {!showExample ? (
              <button
                onClick={(e) => { e.stopPropagation(); setShowExample(true); }}
                className="text-primary-600 font-medium inline-flex items-center gap-1 hover:text-primary-700"
              >
                <Lightbulb className="w-4 h-4" />
                查看例句
              </button>
            ) : (
              <div className="text-center w-full">
                <div className="flex items-start gap-2 mb-3 p-4 bg-gray-50 rounded-2xl">
                  <button
                    onClick={(e) => { e.stopPropagation(); speak(word.example, 'en-US'); }}
                    className="p-2 bg-primary-100 rounded-xl text-primary-600 hover:bg-primary-200 transition-colors flex-shrink-0"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <p className="text-lg text-gray-800 font-medium text-left">{word.example}</p>
                </div>
                <p className="text-gray-600 italic">{word.exampleTranslation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => { setFlipped(false); setShowExample(false); }}
          className="btn-secondary inline-flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          再来一次
        </button>
        <button onClick={onNext} className="btn-accent inline-flex items-center gap-2">
          下一个 <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function GrammarCard({ point }: { point: { title: string; structure: string; explanation: string; examples: { sentence: string; translation: string }[] } }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-xl text-gray-900">{point.title}</h3>
          <div className="text-sm font-mono text-primary-600 bg-primary-50 inline-block px-3 py-1 rounded-lg mt-1">
            {point.structure}
          </div>
        </div>
      </div>
      <p className="text-gray-700 text-lg leading-relaxed mb-6 p-5 bg-blue-50/50 rounded-2xl border-l-4 border-primary-500">
        💡 {point.explanation}
      </p>
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-800 mb-3">📝 例句</h4>
        {point.examples.map((ex, i) => (
          <div
            key={i}
            onClick={() => setExpanded(expanded === i ? null : i)}
            className="p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all border border-gray-100"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-gray-900 font-medium">{ex.sentence}</p>
              {expanded === i ? <Eye className="w-5 h-5 text-primary-600 flex-shrink-0" /> : <EyeOff className="w-5 h-5 text-gray-400 flex-shrink-0" />}
            </div>
            {expanded === i && (
              <p className="mt-3 text-primary-700 pt-3 border-t border-gray-200 animate-fade-in">
                📖 {ex.translation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  index,
  total,
  onAnswer,
  moduleType,
  alreadyAnswered,
}: {
  question: Question;
  index: number;
  total: number;
  onAnswer: (correct: boolean) => void;
  moduleType: ModuleType;
  alreadyAnswered: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [fillAnswer, setFillAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [recording, setRecording] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = (text: string, lang: string = 'en-US') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.85;
      utterance.volume = 1;
      // 预加载语音，避免首次调用无声
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const match = voices.find(v => v.lang.startsWith('en'));
        if (match) utterance.voice = match;
      }
      utteranceRef.current = utterance; // 保持引用，防止 GC
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('您的浏览器不支持语音识别，请使用Chrome浏览器或手动输入答案');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setSpokenText(transcript);
      setFillAnswer(transcript);
      setRecording(false);
    };
    recognitionRef.current.onerror = () => setRecording(false);
    recognitionRef.current.onend = () => setRecording(false);
    try {
      recognitionRef.current.start();
      setRecording(true);
    } catch (e) {
      console.error(e);
    }
  };

  const checkAnswer = () => {
    if (alreadyAnswered) return;
    let correct = false;
    if (question.type === 'multiple-choice') {
      correct = selected === question.answer;
    } else if (question.type === 'fill-blank' || question.type === 'speaking') {
      correct = fillAnswer.trim().toLowerCase() === String(question.answer).toLowerCase();
    }
    setIsCorrect(correct);
    setSubmitted(true);
    onAnswer(correct);
  };

  const progressPct = ((index) / total) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-gray-700">第 {index + 1} / {total} 题</span>
            <span className="text-gray-500">
              {moduleType === 'vocabulary' && '📚 单词测试'}
              {moduleType === 'grammar' && '📖 语法练习'}
              {moduleType === 'speaking' && '🎤 口语练习'}
              {moduleType === 'listening' && '🎧 听力训练'}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="card">
        {moduleType === 'listening' && (
          <div className="mb-6 p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl text-center border border-orange-100">
            <button
              onClick={() => speak(question.audioText || question.content)}
              className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto shadow-lg hover:scale-105 transition-transform active:scale-95"
            >
              <Ear className="w-10 h-10 text-white" />
            </button>
            <p className="mt-4 text-gray-700 font-medium">点击播放音频</p>
            <button
              onClick={() => speak(question.audioText || question.content)}
              className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl shadow-md text-primary-600 font-medium hover:shadow-lg hover:bg-orange-50 transition-all border border-orange-200"
            >
              <Volume2 className="w-5 h-5" />
              重听音频
            </button>
          </div>
        )}

        {question.type === 'speaking' && (
          <div className="mb-6 p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl text-center border border-pink-100">
            <button
              onClick={() => speak(question.content.replace('请跟读：', ''))}
              className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md text-primary-600 font-medium hover:shadow-lg transition-all"
            >
              <Volume2 className="w-5 h-5" />
              听示范发音
            </button>
            <p className="text-2xl font-bold text-gray-800">{question.content.replace('请跟读：', '')}</p>
          </div>
        )}

        {question.type !== 'speaking' && question.type !== 'listening' && (
          <div className="mb-6 flex items-start gap-3 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              {moduleType === 'vocabulary' ? <MessageCircle className="w-5 h-5 text-white" /> : <BookOpen className="w-5 h-5 text-white" />}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">{question.content}</h3>
          </div>
        )}

        {question.type === 'multiple-choice' && (
          <div className="space-y-3">
            {question.options?.map((opt, i) => {
              const isSelected = selected === opt;
              const showCorrect = (submitted || alreadyAnswered) && opt === question.answer;
              const showWrong = (submitted || alreadyAnswered) && isSelected && opt !== question.answer;
              const isDisabled = submitted || alreadyAnswered;
              return (
                <button
                  key={i}
                  onClick={() => !isDisabled && setSelected(opt)}
                  disabled={isDisabled}
                  className={`w-full p-5 rounded-2xl text-left transition-all font-medium flex items-center gap-4 ${
                    showCorrect
                      ? 'bg-green-100 border-2 border-green-500 text-green-800'
                      : showWrong
                      ? 'bg-red-100 border-2 border-red-500 text-red-800'
                      : isSelected
                      ? 'bg-primary-100 border-2 border-primary-500 text-primary-800 shadow-md'
                      : 'bg-gray-50 border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 text-gray-800'
                  }`}
                >
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${
                    showCorrect ? 'bg-green-500 text-white' :
                    showWrong ? 'bg-red-500 text-white' :
                    isSelected ? 'bg-primary-500 text-white' : 'bg-white shadow text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-base flex-1">{opt}</span>
                  {showCorrect && <CheckCircle2 className="w-6 h-6 text-green-600" />}
                  {showWrong && <XCircle className="w-6 h-6 text-red-600" />}
                </button>
              );
            })}
          </div>
        )}

        {(question.type === 'fill-blank' || question.type === 'speaking') && (
          <div>
            {question.type === 'speaking' && (
              <div className="flex gap-3 mb-4">
                <button
                  onClick={startRecording}
                  disabled={recording}
                  className={`flex-1 p-4 rounded-2xl font-semibold inline-flex items-center justify-center gap-2 transition-all ${
                    recording
                      ? 'bg-red-500 text-white animate-pulse shadow-lg'
                      : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg'
                  }`}
                >
                  <Mic className="w-6 h-6" />
                  {recording ? '正在录音...请说话' : '🎤 点击开始跟读'}
                </button>
              </div>
            )}
            <div className="relative">
              <input
                type="text"
                value={fillAnswer}
                onChange={(e) => setFillAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !submitted && !alreadyAnswered && fillAnswer && checkAnswer()}
                disabled={submitted || alreadyAnswered}
                placeholder={question.type === 'speaking' ? '或手动输入答案...' : '请输入你的答案...'}
                className={`input-field text-lg py-4 ${
                  submitted || alreadyAnswered
                    ? alreadyAnswered
                      ? 'border-green-500 bg-green-50'
                      : isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : ''
                }`}
              />
            </div>
            {spokenText && (
              <p className="mt-2 text-sm text-gray-500">识别结果：{spokenText}</p>
            )}
          </div>
        )}

        {(submitted || alreadyAnswered) && (
          <div className={`mt-6 p-5 rounded-2xl ${alreadyAnswered ? 'bg-green-50 border border-green-200' : isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-start gap-4">
              {alreadyAnswered ? (
                <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
              ) : isCorrect ? (
                <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h4 className={`font-bold text-lg ${alreadyAnswered ? 'text-green-800' : isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {alreadyAnswered ? '✅ 已答过此题' : isCorrect ? '🎉 回答正确！' : '💪 再接再厉！'}
                </h4>
                {(!isCorrect || alreadyAnswered) && (
                  <p className="mt-2 text-gray-700">
                    <span className="font-semibold">正确答案：</span>
                    <span className="text-primary-700 font-bold ml-1">{question.answer}</span>
                  </p>
                )}
                {question.explanation && (
                  <p className="mt-3 text-gray-600 text-sm bg-white p-3 rounded-xl border border-gray-100">
                    💡 {question.explanation}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {!submitted && !alreadyAnswered && (
          <button
            onClick={checkAnswer}
            disabled={(question.type === 'multiple-choice' && !selected) || ((question.type === 'fill-blank' || question.type === 'speaking') && !fillAnswer)}
            className="btn-accent w-full py-4 mt-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center justify-center gap-2"
          >
            确认答案 <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

export function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<'intro' | 'words' | 'grammar' | 'questions' | 'result'>('intro');
  const [wordIndex, setWordIndex] = useState(0);
  const [grammarIndex, setGrammarIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionResults, setQuestionResults] = useState<Map<number, boolean>>(new Map());

  useEffect(() => {
    if (state.currentUser && lesson) {
      dispatch({ type: 'ADD_STUDY_TIME', payload: lesson.estimatedMinutes });
      if (!state.currentUser.languages.includes(lesson.language)) {
        dispatch({
          type: 'UPDATE_USER',
          payload: { languages: [...state.currentUser.languages, lesson.language] },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!state.currentUser || !state.userProgress) {
    return null;
  }

  const lesson = LESSONS.find(l => l.id === id);

  if (!lesson) {
    return (
      <div className="card text-center py-16">
        <h3 className="text-xl font-bold text-gray-700 mb-2">课程不存在</h3>
        <Link to="/courses" className="btn-primary mt-4 inline-flex items-center gap-2">
          返回课程列表
        </Link>
      </div>
    );
  }

  const handleAnswer = (correct: boolean) => {
    const newResults = new Map(questionResults);
    if (!newResults.has(questionIndex)) {
      dispatch({ type: 'UPDATE_MODULE_STATS', payload: { module: lesson.moduleType, correct } });
      setCorrectCount(c => c + (correct ? 1 : 0));
      setTotalQuestions(t => t + 1);
    }
    newResults.set(questionIndex, correct);
    setQuestionResults(newResults);
  };

  const progressData = () => {
    let total = 0, current = 0;
    if (lesson.words) total += lesson.words.length;
    if (lesson.grammarPoints) total += lesson.grammarPoints.length;
    total += lesson.questions.length;

    if (phase === 'intro') current = 0;
    if (phase === 'words') current = wordIndex;
    if (phase === 'grammar') current = (lesson.words?.length || 0) + grammarIndex;
    if (phase === 'questions') current = (lesson.words?.length || 0) + (lesson.grammarPoints?.length || 0) + questionIndex;
    if (phase === 'result') current = total;

    return { total, current, pct: total > 0 ? Math.round((current / total) * 100) : 0 };
  };

  const { pct } = progressData();
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const moduleColors: Record<ModuleType, string> = {
    vocabulary: 'from-green-500 to-emerald-600',
    grammar: 'from-blue-500 to-indigo-600',
    speaking: 'from-pink-500 to-rose-600',
    listening: 'from-orange-500 to-amber-600',
  };

  const moduleNames: Record<ModuleType, string> = {
    vocabulary: '单词记忆',
    grammar: '语法练习',
    speaking: '口语跟读',
    listening: '听力训练',
  };

  const moduleEmoji: Record<ModuleType, string> = {
    vocabulary: '📚',
    grammar: '📖',
    speaking: '🎤',
    listening: '🎧',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          退出学习
        </button>
        <div className="flex items-center gap-4">
          {phase !== 'intro' && phase !== 'result' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{pct}% 完成</span>
            </div>
          )}
          <div className={`badge bg-gradient-to-r ${moduleColors[lesson.moduleType]} text-white`}>
            {moduleEmoji[lesson.moduleType]} {moduleNames[lesson.moduleType]}
          </div>
        </div>
      </div>

      {phase !== 'intro' && phase !== 'result' && (
        <div className="h-2 bg-white/50 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${moduleColors[lesson.moduleType]} rounded-full transition-all duration-500`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {phase === 'intro' && (
        <div className="max-w-2xl mx-auto">
          <div className={`card p-0 overflow-hidden`}>
            <div className={`h-48 bg-gradient-to-br ${moduleColors[lesson.moduleType]} flex items-center justify-center relative`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_60%,rgba(255,255,255,0.2),transparent_50%)]" />
              <div className="relative text-center text-white">
                <div className="text-6xl mb-3 animate-float">{moduleEmoji[lesson.moduleType]}</div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
                    {LANGUAGE_INFO[lesson.language].flag} {LANGUAGE_INFO[lesson.language].name}
                  </span>
                  <span className={`badge ${LEVEL_INFO[lesson.level].color}`}>
                    {LEVEL_INFO[lesson.level].name}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
              <p className="text-gray-600 text-lg mb-6">{lesson.description}</p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-700">{lesson.words?.length || lesson.grammarPoints?.length || lesson.questions.length}</div>
                  <div className="text-sm text-blue-600 mt-1">学习内容</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-2xl">
                  <div className="text-3xl font-bold text-yellow-700">{lesson.questions.length}</div>
                  <div className="text-sm text-yellow-600 mt-1">练习题数</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-2xl">
                  <div className="flex items-center justify-center gap-1 text-3xl font-bold text-green-700">
                    <Star className="w-7 h-7" />
                    {lesson.xpReward}
                  </div>
                  <div className="text-sm text-green-600 mt-1">奖励 XP</div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (lesson.words && lesson.words.length > 0) setPhase('words');
                  else if (lesson.grammarPoints && lesson.grammarPoints.length > 0) setPhase('grammar');
                  else setPhase('questions');
                }}
                className={`w-full py-4 text-lg font-bold text-white rounded-2xl bg-gradient-to-r ${moduleColors[lesson.moduleType]} hover:shadow-2xl transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2`}
              >
                <Sparkles className="w-6 h-6" />
                开始学习
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === 'words' && lesson.words && (
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              学习单词 <span className="text-primary-600">{wordIndex + 1}</span> / {lesson.words.length}
            </h2>
            <p className="text-gray-500">点击卡片翻面查看释义</p>
          </div>
          <Flashcard
            word={lesson.words[wordIndex]}
            onNext={() => {
              dispatch({ type: 'ADD_WORD_MASTERY', payload: { wordId: lesson.words![wordIndex].id, level: 2 } });
              const next = wordIndex + 1;
              if (next < lesson.words!.length) {
                setWordIndex(next);
              } else if (lesson.grammarPoints && lesson.grammarPoints.length > 0) {
                setPhase('grammar');
              } else {
                setPhase('questions');
              }
            }}
          />
        </div>
      )}

      {phase === 'grammar' && lesson.grammarPoints && (
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              语法要点 <span className="text-primary-600">{grammarIndex + 1}</span> / {lesson.grammarPoints.length}
            </h2>
            <p className="text-gray-500">认真阅读语法讲解和例句</p>
          </div>
          <GrammarCard point={lesson.grammarPoints[grammarIndex]} />
          <div className="mt-8 flex justify-center gap-4">
            {grammarIndex > 0 && (
              <button
                onClick={() => setGrammarIndex(g => g - 1)}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                上一个
              </button>
            )}
            <button
              onClick={() => {
                const next = grammarIndex + 1;
                if (next < lesson.grammarPoints!.length) setGrammarIndex(next);
                else setPhase('questions');
              }}
              className={`py-3 px-8 text-white font-bold rounded-2xl bg-gradient-to-r ${moduleColors[lesson.moduleType]} hover:shadow-xl transition-all inline-flex items-center gap-2`}
            >
              {grammarIndex + 1 < (lesson.grammarPoints?.length || 0) ? '下一个要点' : '开始练习'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {phase === 'questions' && (
        <div>
          <QuestionCard
            key={questionIndex}
            question={lesson.questions[questionIndex]}
            index={questionIndex}
            total={lesson.questions.length}
            onAnswer={handleAnswer}
            moduleType={lesson.moduleType}
            alreadyAnswered={questionResults.has(questionIndex)}
          />
          <div className="mt-6 flex justify-between items-center max-w-2xl mx-auto">
            <button
              onClick={() => setQuestionIndex(i => Math.max(0, i - 1))}
              disabled={questionIndex === 0}
              className="btn-secondary inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              上一题
            </button>
            <span className="text-sm text-gray-500 font-medium">
              {questionResults.size} / {lesson.questions.length} 已答
            </span>
            {questionIndex < lesson.questions.length - 1 ? (
              <button
                onClick={() => setQuestionIndex(i => i + 1)}
                className="btn-primary inline-flex items-center gap-2"
              >
                下一题 <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  const allCorrect = correctCount === lesson.questions.length && totalQuestions === lesson.questions.length;
                  dispatch({ type: 'COMPLETE_LESSON', payload: { lessonId: lesson.id, xp: lesson.xpReward } });
                  if (allCorrect) {
                    dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'ach7' });
                  }
                  dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'ach1' });
                  setPhase('result');
                }}
                className="btn-accent inline-flex items-center gap-2"
              >
                <Trophy className="w-5 h-5" />
                完成学习
              </button>
            )}
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div className="max-w-2xl mx-auto">
          <div className="card text-center p-8 md:p-12">
            <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 flex items-center justify-center shadow-2xl animate-bounce-slow">
              <Trophy className="w-14 h-14 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">太棒了！🎉</h2>
            <p className="text-gray-600 text-lg mb-8">你完成了《{lesson.title}》的学习！</p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                <div className="text-4xl font-bold text-green-700">{accuracy}%</div>
                <div className="text-sm text-green-600 mt-1">正确率</div>
              </div>
              <div className="p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl">
                <div className="flex items-center justify-center gap-1 text-4xl font-bold text-yellow-700">
                  <Sparkles className="w-8 h-8" />
                  +{lesson.xpReward}
                </div>
                <div className="text-sm text-yellow-600 mt-1">获得 XP</div>
              </div>
              <div className="p-5 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl">
                <div className="text-4xl font-bold text-primary-700">
                  {correctCount}/{totalQuestions}
                </div>
                <div className="text-sm text-primary-600 mt-1">答对题数</div>
              </div>
            </div>
            {accuracy === 100 && (
              <div className="mb-8 p-5 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-300 inline-block">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">🏆</div>
                  <div className="text-left">
                    <div className="font-bold text-lg text-orange-800">完美通关成就解锁！</div>
                    <div className="text-sm text-orange-600">全部题目回答正确</div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/courses')} className="btn-secondary py-3 px-8">
                浏览其他课程
              </button>
              <button onClick={() => navigate('/dashboard')} className="btn-accent py-3 px-8 inline-flex items-center justify-center gap-2">
                返回学习中心 <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
