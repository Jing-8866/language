import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import {
  GraduationCap,
  Lock,
  ChevronRight,
  CheckCircle2,
  Play,
  Clock,
  Star,
  BookOpen,
  MessageCircle,
  Ear,
  Mic,
  ArrowLeft,
  Globe,
  Filter,
} from 'lucide-react';
import { COURSES, LESSONS, LANGUAGE_INFO, LEVEL_INFO } from '../data/mockData';
import { useApp } from '../context/AppContext';
import type { Language, Level, ModuleType } from '../types';

export function CoursesPage() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [filterLang, setFilterLang] = useState<Language | 'all'>('all');
  const [filterLevel, setFilterLevel] = useState<Level | 'all'>('all');

  if (!state.currentUser) {
    return null;
  }

  const filteredCourses = COURSES.filter(c => {
    if (filterLang !== 'all' && c.language !== filterLang) return false;
    if (filterLevel !== 'all' && c.level !== filterLevel) return false;
    return true;
  });

  const moduleIcons: Record<ModuleType, typeof BookOpen> = {
    vocabulary: MessageCircle,
    grammar: BookOpen,
    speaking: Mic,
    listening: Ear,
  };

  const moduleNames: Record<ModuleType, string> = {
    vocabulary: '单词',
    grammar: '语法',
    speaking: '口语',
    listening: '听力',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <GraduationCap className="w-9 h-9 text-primary-600" />
          全部课程
        </h1>
        <p className="text-gray-600">探索英语分级课程体系，从零基础到医学专业英语，找到适合你的学习内容</p>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Globe className="w-4 h-4" />
              选择语言
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterLang('all')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${filterLang === 'all' ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                全部语言
              </button>
              {Object.entries(LANGUAGE_INFO).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setFilterLang(key as Language)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${filterLang === key ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {val.flag} {val.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4" />
              难度级别
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterLevel('all')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${filterLevel === 'all' ? 'bg-accent-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                全部级别
              </button>
              {Object.entries(LEVEL_INFO).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setFilterLevel(key as Level)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${filterLevel === key ? 'bg-accent-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {val.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => {
          const completedInCourse = course.lessons.filter(l =>
            state.userProgress?.completedLessons.includes(l)
          ).length;
          const total = course.lessons.length || 1;
          const progress = Math.round((completedInCourse / total) * 100);
          const isLocked = course.prerequisites.length > 0 &&
            !course.prerequisites.every(p =>
              state.userProgress?.completedCourses.includes(p) ||
              COURSES.find(c => c.id === p)?.lessons.every(l => state.userProgress?.completedLessons.includes(l))
            );
          const courseLessons = LESSONS.filter(l => course.lessons.includes(l.id));
          const moduleTypes = [...new Set(courseLessons.map(l => l.moduleType))];

          return (
            <div
              key={course.id}
              onClick={() => !isLocked && navigate(`/course/${course.id}`)}
              className={`card-hover relative overflow-hidden group ${isLocked ? 'opacity-70' : ''}`}
            >
              <div className={`h-32 -mx-6 -mt-6 mb-5 bg-gradient-to-br ${course.color} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.2),transparent_50%)]" />
                <div className="relative z-10 text-center">
                  <div className="text-5xl mb-1 group-hover:scale-110 transition-transform">{course.icon}</div>
                  <div className="flex items-center justify-center gap-2 text-white/90 text-sm font-medium">
                    <span>{LANGUAGE_INFO[course.language].flag}</span>
                    <span>Lv.{course.levelNumber}</span>
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <span className={`badge ${LEVEL_INFO[course.level].color}`}>
                    {LEVEL_INFO[course.level].name}
                  </span>
                </div>
                {isLocked && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-white text-center">
                      <Lock className="w-10 h-10 mx-auto mb-2" />
                      <p className="text-sm font-medium">需先完成前置课程</p>
                    </div>
                  </div>
                )}
                {progress === 100 && !isLocked && (
                  <div className="absolute top-3 right-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </div>

              <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-primary-600 transition-colors">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {moduleTypes.map(mt => {
                  const Icon = moduleIcons[mt];
                  return (
                    <span key={mt} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                      <Icon className="w-3.5 h-3.5" />
                      {moduleNames[mt]}
                    </span>
                  );
                })}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-medium">
                  <Star className="w-3.5 h-3.5" />
                  {course.totalXp} XP
                </span>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">课程进度</span>
                  <span className="font-semibold text-gray-800">
                    {progress > 0 || course.lessons.length > 0 ? `${completedInCourse}/${course.lessons.length} 节` : '敬请期待'}
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500 inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  约 {courseLessons.reduce((s, l) => s + l.estimatedMinutes, 0) || 0} 分钟
                </span>
                {!isLocked && (
                  <span className="text-sm font-semibold text-primary-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {progress > 0 && progress < 100 ? '继续学习' : progress === 100 ? '查看详情' : '立即开始'}
                    <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="card text-center py-16">
          <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">没有找到匹配的课程</h3>
          <p className="text-gray-500">试试调整筛选条件吧</p>
        </div>
      )}
    </div>
  );
}

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useApp();
  const navigate = useNavigate();

  if (!state.currentUser || !state.userProgress) {
    return null;
  }

  const course = COURSES.find(c => c.id === id);
  if (!course) {
    return (
      <div className="card text-center py-16">
        <h3 className="text-xl font-bold text-gray-700 mb-2">课程不存在</h3>
        <Link to="/courses" className="btn-primary mt-4 inline-flex items-center gap-2">
          返回课程列表
        </Link>
      </div>
    );
  }

  const courseLessons = LESSONS.filter(l => course.lessons.includes(l.id));
  const completedLessons = state.userProgress.completedLessons;
  const completedCount = courseLessons.filter(l => completedLessons.includes(l.id)).length;
  const progress = courseLessons.length > 0 ? Math.round((completedCount / courseLessons.length) * 100) : 0;

  const moduleColors: Record<ModuleType, string> = {
    vocabulary: 'from-green-500 to-emerald-600',
    grammar: 'from-blue-500 to-indigo-600',
    speaking: 'from-pink-500 to-rose-600',
    listening: 'from-orange-500 to-amber-600',
  };
  const moduleIcons: Record<ModuleType, typeof BookOpen> = {
    vocabulary: MessageCircle,
    grammar: BookOpen,
    speaking: Mic,
    listening: Ear,
  };
  const moduleNames: Record<ModuleType, string> = {
    vocabulary: '单词记忆',
    grammar: '语法练习',
    speaking: '口语跟读',
    listening: '听力训练',
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        返回
      </button>

      <div className={`card p-0 overflow-hidden`}>
        <div className={`h-56 bg-gradient-to-br ${course.color} flex items-center justify-center relative`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="relative z-10 text-center text-white px-6">
            <div className="text-7xl mb-4 animate-float">{course.icon}</div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
                {LANGUAGE_INFO[course.language].flag} {LANGUAGE_INFO[course.language].name}
              </span>
              <span className={`badge ${LEVEL_INFO[course.level].color}`}>
                Lv.{course.levelNumber} {LEVEL_INFO[course.level].name}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
          </div>
        </div>

        <div className="p-8">
          <p className="text-lg text-gray-700 mb-8">{course.description}</p>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 text-center">
              <GraduationCap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">{courseLessons.length}</div>
              <div className="text-sm text-blue-600">课程节数</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-5 text-center">
              <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-700">{course.totalXp}</div>
              <div className="text-sm text-yellow-600">总经验值</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">{completedCount}/{courseLessons.length}</div>
              <div className="text-sm text-green-600">完成进度</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5 text-center">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-700">{courseLessons.reduce((s, l) => s + l.estimatedMinutes, 0)}</div>
              <div className="text-sm text-orange-600">预计分钟</div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-800">总体进度</span>
              <span className="text-sm font-bold text-primary-600">{progress}%</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${course.color} rounded-full transition-all duration-700`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Play className="w-6 h-6 text-primary-600" />
              课程内容
            </h2>
            {courseLessons.length > 0 ? (
              <div className="space-y-3">
                {courseLessons.map((lesson, idx) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const Icon = moduleIcons[lesson.moduleType];
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => navigate(`/lesson/${lesson.id}`)}
                      className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all cursor-pointer group"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${moduleColors[lesson.moduleType]} rounded-xl flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        ) : (
                          <span className="text-white font-bold">{idx + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-bold ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {lesson.title}
                          </h3>
                          {isCompleted && (
                            <span className="badge bg-green-100 text-green-700">已完成</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{lesson.description}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <Icon className="w-3.5 h-3.5" />
                            {moduleNames[lesson.moduleType]}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {lesson.estimatedMinutes} 分钟
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-500" />
                            +{lesson.xpReward} XP
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <GraduationCap className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">课程内容正在精心筹备中，敬请期待...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
