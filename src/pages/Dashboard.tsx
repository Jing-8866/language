import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Play,
  BookOpen,
  MessageCircle,
  Ear,
  Mic,
  Target,
  Flame,
  Trophy,
  Clock,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Star,
  Award,
  GraduationCap,
} from 'lucide-react';
import { COURSES, LESSONS, LANGUAGE_INFO, LEVEL_INFO, ACHIEVEMENTS_DATA } from '../data/mockData';
import type { ModuleType, StudyRecommendation } from '../types';
import { useEffect, useMemo } from 'react';

export function DashboardPage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.currentUser && state.userProgress) {
      ACHIEVEMENTS_DATA.forEach(ach => {
        const { requirement } = ach;
        let unlocked = false;
        switch (requirement) {
          case 'complete-first-lesson':
            unlocked = state.userProgress!.completedLessons.length >= 1;
            break;
          case 'streak-7':
            unlocked = state.currentUser!.streak >= 7;
            break;
          case 'study-100min':
            unlocked = state.userProgress!.totalStudyMinutes >= 100;
            break;
          case 'words-50':
            unlocked = state.userProgress!.masteredWords.length >= 50;
            break;
          case 'multilingual':
            unlocked = state.currentUser!.languages.length >= 2;
            break;
          case 'complete-course':
            unlocked = state.userProgress!.completedCourses.length >= 1;
            break;
        }
        if (unlocked && !state.currentUser!.achievements.includes(ach.id)) {
          dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: ach.id });
        }
      });
    }
  }, [state.currentUser, state.userProgress, dispatch]);

  if (!state.currentUser || !state.userProgress) {
    return null;
  }

  const { currentUser, userProgress } = state;

  const currentLangCourses = COURSES.filter(c => c.language === currentUser.currentLanguage);
  const completedLessons = userProgress.completedLessons;

  const recommendations = useMemo<StudyRecommendation[]>(() => {
    const recs: StudyRecommendation[] = [];
    const lang = currentUser.currentLanguage;

    for (const course of currentLangCourses) {
      const totalLessons = course.lessons.length;
      if (totalLessons === 0) continue;

      for (const lessonId of course.lessons) {
        if (!completedLessons.includes(lessonId)) {
          const lesson = LESSONS.find(l => l.id === lessonId);
          if (lesson) {
            const moduleNames: Record<ModuleType, string> = {
              vocabulary: '单词记忆',
              grammar: '语法练习',
              speaking: '口语跟读',
              listening: '听力训练',
            };
            recs.push({
              type: 'lesson',
              title: lesson.title,
              description: `${moduleNames[lesson.moduleType]} · ${LEVEL_INFO[lesson.level].name} · 约${lesson.estimatedMinutes}分钟`,
              targetId: lesson.id,
              language: lang,
              priority: 100 - course.lessons.indexOf(lessonId) * 10,
              reason: `继续《${course.title}》的学习进度`,
            });
          }
          break;
        }
      }
    }

    if (userProgress.masteredWords.length > 0) {
      const weakWords = userProgress.masteredWords.filter(w => w.masteryLevel < 3);
      if (weakWords.length >= 3) {
        recs.push({
          type: 'review',
          title: '单词复习',
          description: `有 ${weakWords.length} 个单词需要加强记忆`,
          targetId: 'review-words',
          language: lang,
          priority: 85,
          reason: '间隔复习，强化长期记忆',
        });
      }
    }

    const stats = userProgress.moduleStats;
    const modules: ModuleType[] = ['vocabulary', 'grammar', 'speaking', 'listening'];
    for (const mod of modules) {
      if (stats[mod].total >= 5) {
        const acc = stats[mod].correct / stats[mod].total;
        if (acc < 0.6) {
          const modNames: Record<ModuleType, string> = { vocabulary: '单词', grammar: '语法', speaking: '口语', listening: '听力' };
          recs.push({
            type: 'module',
            title: `${modNames[mod]}专项训练`,
            description: `当前正确率 ${(acc * 100).toFixed(0)}%，建议加强练习`,
            targetId: `module-${mod}`,
            language: lang,
            priority: 80,
            reason: '补足短板，均衡提升',
          });
        }
      }
    }

    return recs.sort((a, b) => b.priority - a.priority).slice(0, 4);
  }, [currentUser.currentLanguage, currentLangCourses, completedLessons, userProgress]);

  const moduleAccuracy = (mod: ModuleType) => {
    const s = userProgress.moduleStats[mod];
    if (s.total === 0) return null;
    return Math.round((s.correct / s.total) * 100);
  };

  const today = new Date().toDateString();
  const studiedToday = userProgress.dailyStreak.includes(today);
  const expProgress = (currentUser.exp / 500) * 100;

  const startLesson = (lessonId: string) => {
    navigate(`/lesson/${lessonId}`);
  };

  const moduleIcons: Record<ModuleType, typeof BookOpen> = {
    vocabulary: MessageCircle,
    grammar: BookOpen,
    speaking: Mic,
    listening: Ear,
  };

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

  return (
    <div className="space-y-8">
      <div className="card overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-200/50 to-accent-200/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">你好, {currentUser.username}！ 👋</h1>
                {!studiedToday && (
                  <span className="badge bg-orange-100 text-orange-700 animate-pulse">今日待学习</span>
                )}
                {studiedToday && (
                  <span className="badge bg-green-100 text-green-700">今日已打卡 ✓</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Lv.{currentUser.level}
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  {currentUser.exp} / 500 XP
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  {currentUser.streak}天连续
                </span>
              </div>
              <div className="mt-3 w-full max-w-sm">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${expProgress}%` }} />
                </div>
                <div className="text-xs text-gray-500 mt-1">距离 Lv.{currentUser.level + 1} 还需 {500 - currentUser.exp} XP</div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 min-w-[120px]">
              <div className="flex items-center gap-2 text-orange-600 mb-1">
                <Flame className="w-5 h-5" />
                <span className="text-sm font-medium">连续学习</span>
              </div>
              <div className="text-3xl font-bold text-orange-700">{currentUser.streak}<span className="text-lg ml-1">天</span></div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 min-w-[120px]">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">累计时长</span>
              </div>
              <div className="text-3xl font-bold text-blue-700">{userProgress.totalStudyMinutes}<span className="text-lg ml-1">分</span></div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 min-w-[120px]">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <Trophy className="w-5 h-5" />
                <span className="text-sm font-medium">完成课程</span>
              </div>
              <div className="text-3xl font-bold text-green-700">{completedLessons.length}<span className="text-lg ml-1">节</span></div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Target className="w-6 h-6 text-accent-500" />
              个性化推荐
            </h2>
            <p className="text-sm text-gray-500 mt-1">根据你的学习进度和表现，为你量身定制</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {recommendations.map((rec, i) => (
            <div
              key={i}
              onClick={() => {
                if (rec.type === 'lesson') startLesson(rec.targetId);
              }}
              className={`card-hover group ${rec.type !== 'lesson' ? 'opacity-90 cursor-default' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${i % 2 === 0 ? 'from-primary-500 to-accent-500' : 'from-accent-500 to-primary-500'} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform flex-shrink-0`}>
                  {rec.type === 'lesson' ? <Play className="w-7 h-7 text-white" /> :
                   rec.type === 'review' ? <Star className="w-7 h-7 text-white" /> :
                   <TrendingUp className="w-7 h-7 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition-colors">{rec.title}</h3>
                    <span className="badge bg-primary-100 text-primary-700 flex-shrink-0">
                      {LANGUAGE_INFO[rec.language].flag} {LANGUAGE_INFO[rec.language].name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-accent-600 bg-accent-50 px-3 py-1 rounded-full">
                      💡 {rec.reason}
                    </span>
                    {rec.type === 'lesson' && (
                      <span className="text-sm font-semibold text-primary-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        开始学习 <ChevronRight className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {recommendations.length === 0 && (
            <div className="md:col-span-2 card text-center py-12">
              <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">暂无推荐</h3>
              <p className="text-gray-500">去浏览所有课程，开启你的学习之旅吧！</p>
              <Link to="/courses" className="btn-accent mt-6 inline-flex items-center gap-2">
                浏览课程 <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary-500" />
              互动学习模块
            </h2>
            <p className="text-sm text-gray-500 mt-1">多样化学习形式，全方位提升语言能力</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(['vocabulary', 'grammar', 'speaking', 'listening'] as ModuleType[]).map(mod => {
            const Icon = moduleIcons[mod];
            const acc = moduleAccuracy(mod);
            return (
              <div
                key={mod}
                className="card-hover relative overflow-hidden group"
                onClick={() => {
                  const lesson = LESSONS.find(l => l.moduleType === mod && l.language === currentUser.currentLanguage);
                  if (lesson) startLesson(lesson.id);
                }}
              >
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${moduleColors[mod]}`} />
                <div className={`w-12 h-12 bg-gradient-to-br ${moduleColors[mod]} rounded-xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{moduleNames[mod]}</h3>
                <p className="text-xs text-gray-500 mb-3">
                  {mod === 'vocabulary' && '智能闪卡记忆法'}
                  {mod === 'grammar' && '系统语法讲解'}
                  {mod === 'speaking' && 'AI发音评分'}
                  {mod === 'listening' && '沉浸式听力训练'}
                </p>
                {acc !== null ? (
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500">正确率</span>
                      <span className={`font-semibold ${acc >= 80 ? 'text-green-600' : acc >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{acc}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className={`h-full rounded-full transition-all ${acc >= 80 ? 'bg-green-500' : acc >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${acc}%` }} />
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">还未练习，点击开始 →</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-indigo-500" />
              {LANGUAGE_INFO[currentUser.currentLanguage].flag} {LANGUAGE_INFO[currentUser.currentLanguage].name}学习路径
            </h2>
            <p className="text-sm text-gray-500 mt-1">科学分级，循序渐进</p>
          </div>
          <Link to="/courses" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            查看全部 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {currentLangCourses.map((course) => {
            const completedInCourse = course.lessons.filter(l => completedLessons.includes(l)).length;
            const total = course.lessons.length || 1;
            const progress = Math.round((completedInCourse / total) * 100);
            const isLocked = course.prerequisites.length > 0 &&
              !course.prerequisites.every(p => userProgress.completedCourses.includes(p) ||
                COURSES.find(c => c.id === p)?.lessons.every(l => completedLessons.includes(l)));

            return (
              <div
                key={course.id}
                onClick={() => !isLocked && navigate(`/course/${course.id}`)}
                className={`card-hover relative overflow-hidden ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <div className={`h-28 -mx-6 -mt-6 mb-5 bg-gradient-to-br ${course.color} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
                  <span className="text-5xl relative z-10">{course.icon}</span>
                  <div className="absolute top-3 right-3">
                    <span className={`badge ${LEVEL_INFO[course.level].color} bg-opacity-90`}>
                      {LEVEL_INFO[course.level].name}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">学习进度</span>
                    <span className="font-semibold text-gray-800">{completedInCourse}/{total} 节课 {progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">🎁 {course.totalXp} XP</span>
                  {!isLocked ? (
                    <span className="text-sm font-semibold text-primary-600 flex items-center gap-1">
                      {progress > 0 && progress < 100 ? '继续学习' : progress === 100 ? '已完成 ✓' : '开始学习'} <ChevronRight className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">🔒 需先完成前置课程</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
