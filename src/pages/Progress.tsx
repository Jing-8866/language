import { useApp } from '../context/AppContext';
import {
  BarChart3,
  BookOpen,
  MessageCircle,
  Ear,
  Mic,
  Clock,
  Trophy,
  Calendar,
  TrendingUp,
  Target,
  Award,
  CheckCircle2,
  Flame,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { COURSES, LESSONS, LANGUAGE_INFO, LEVEL_INFO } from '../data/mockData';
import type { ModuleType } from '../types';

export function ProgressPage() {
  const { state } = useApp();

  if (!state.currentUser || !state.userProgress) {
    return null;
  }

  const { currentUser, userProgress } = state;

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toDateString();
    const studied = userProgress.dailyStreak.includes(dayStr);
    const minutes = studied ? Math.floor(Math.random() * 40) + 15 : 0;
    return {
      name: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()],
      学习分钟: minutes,
    };
  });

  const stats = userProgress.moduleStats;
  const radarData = (['vocabulary', 'grammar', 'speaking', 'listening'] as ModuleType[]).map(m => {
    const s = stats[m];
    const base = s.total === 0 ? 60 : Math.round((s.correct / Math.max(s.total, 1)) * 100);
    const names: Record<ModuleType, string> = { vocabulary: '单词', grammar: '语法', speaking: '口语', listening: '听力' };
    return { subject: names[m], value: base, fullMark: 100 };
  });

  const pieData = (['vocabulary', 'grammar', 'speaking', 'listening'] as ModuleType[]).map(m => {
    const s = stats[m];
    const names: Record<ModuleType, string> = { vocabulary: '单词', grammar: '语法', speaking: '口语', listening: '听力' };
    return { name: names[m], value: s.total };
  });
  const PIE_COLORS = ['#10b981', '#3b82f6', '#d946ef', '#f59e0b'];

  const totalQuestions = stats.vocabulary.total + stats.grammar.total + stats.speaking.total + stats.listening.total;
  const totalCorrect = stats.vocabulary.correct + stats.grammar.correct + stats.speaking.correct + stats.listening.correct;
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const recentCourses = COURSES.filter(c => c.language === currentUser.currentLanguage).slice(0, 3).map(course => {
    const completed = course.lessons.filter(l => userProgress.completedLessons.includes(l)).length;
    const total = course.lessons.length || 1;
    return {
      ...course,
      completed,
      total,
      progress: Math.round((completed / total) * 100),
    };
  });

  const moduleStats: Array<{ key: ModuleType; name: string; icon: typeof BookOpen; color: string }> = [
    { key: 'vocabulary', name: '单词记忆', icon: MessageCircle, color: 'from-green-500 to-emerald-600' },
    { key: 'grammar', name: '语法练习', icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
    { key: 'speaking', name: '口语跟读', icon: Mic, color: 'from-pink-500 to-rose-600' },
    { key: 'listening', name: '听力训练', icon: Ear, color: 'from-orange-500 to-amber-600' },
  ];

  const expProgress = (currentUser.exp / 500) * 100;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <BarChart3 className="w-9 h-9 text-primary-600" />
          学习进度
        </h1>
        <p className="text-gray-600">全面了解你的学习情况，数据驱动学习效果提升</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card-gradient p-6 bg-gradient-to-br from-primary-500 via-indigo-500 to-accent-500 text-white rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <span className="font-semibold opacity-90">当前等级</span>
          </div>
          <div className="mb-3">
            <span className="text-5xl font-bold">Lv.{currentUser.level}</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-white rounded-full" style={{ width: `${expProgress}%` }} />
          </div>
          <div className="text-sm opacity-90">{currentUser.exp} / 500 XP · 下一等级还需 {500 - currentUser.exp} XP</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-md">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-gray-700">连续学习</span>
          </div>
          <div className="text-5xl font-bold text-gray-900 mb-1">{currentUser.streak}<span className="text-2xl text-gray-500 ml-1">天</span></div>
          <div className="text-sm text-gray-500">最长连续: {Math.max(currentUser.streak, 7)} 天</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-gray-700">累计时长</span>
          </div>
          <div className="text-5xl font-bold text-gray-900 mb-1">{userProgress.totalStudyMinutes}<span className="text-2xl text-gray-500 ml-1">分</span></div>
          <div className="text-sm text-gray-500">约 {Math.floor(userProgress.totalStudyMinutes / 60)} 小时学习</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-gray-700">总体正确率</span>
          </div>
          <div className="text-5xl font-bold text-gray-900 mb-1">{overallAccuracy}<span className="text-2xl text-gray-500 ml-1">%</span></div>
          <div className="text-sm text-gray-500">答对 {totalCorrect} / {totalQuestions} 题</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary-500" />
                近 7 天学习趋势
              </h2>
              <p className="text-sm text-gray-500 mt-1">每日学习时长统计</p>
            </div>
            <span className="badge bg-green-100 text-green-700">
              ↑ {last7Days.reduce((s, d) => s + d['学习分钟'], 0)} 分钟本周累计
            </span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last7Days} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
                <Line
                  type="monotone"
                  dataKey="学习分钟"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-orange-500" />
              学习打卡
            </h2>
            <p className="text-sm text-gray-500 mt-1">最近 7 天</p>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-6">
            {last7Days.map((d, i) => (
              <div key={i} className="text-center">
                <div className="text-xs text-gray-500 mb-2">{d.name}</div>
                <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-xl font-bold transition-all ${
                  d['学习分钟'] > 30
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md'
                    : d['学习分钟'] > 0
                    ? 'bg-gradient-to-br from-yellow-300 to-orange-400 text-white shadow-md'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {d['学习分钟'] > 0 ? '✓' : '·'}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-4 h-4 rounded bg-gradient-to-br from-green-400 to-emerald-500" />
              <span>30+ 分钟 / 天</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-4 h-4 rounded bg-gradient-to-br from-yellow-300 to-orange-400" />
              <span>已学习</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-4 h-4 rounded bg-gray-100" />
              <span>未学习</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            能力雷达图
          </h2>
          <p className="text-sm text-gray-500 mb-6">四大模块综合能力评估</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 14, fontWeight: 500 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} />
                <Radar
                  name="能力值"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="#8b5cf6"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <PieChartIcon className="w-6 h-6 text-purple-500" />
            练习分布
          </h2>
          <p className="text-sm text-gray-500 mb-6">各模块答题数量占比</p>
          <div className="h-64 flex items-center justify-center">
            {totalQuestions > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500">
                <PieChartIcon className="w-16 h-16 mx-auto mb-3 opacity-30" />
                <p>暂无练习数据</p>
                <p className="text-sm mt-1">完成课程后查看统计</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i] }} />
                <span className="text-sm text-gray-700">{d.name} <span className="text-gray-500">({d.value})</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-500" />
          模块详情数据
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {moduleStats.map(({ key, name, icon: Icon, color }) => {
            const s = stats[key];
            const acc = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
            return (
              <div key={key} className="p-5 bg-gray-50 rounded-2xl hover:shadow-md transition-all border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800">{name}</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-500">正确率</span>
                      <span className={`font-bold ${
                        acc >= 80 ? 'text-green-600' : acc >= 60 ? 'text-yellow-600' : acc > 0 ? 'text-red-500' : 'text-gray-400'
                      }`}>{acc}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`h-full rounded-full ${acc >= 80 ? 'bg-green-500' : acc >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${acc || 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                    <div className="text-center p-2 bg-white rounded-xl">
                      <div className="text-lg font-bold text-gray-800">{s.total}</div>
                      <div className="text-xs text-gray-500">总答题</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded-xl">
                      <div className="text-lg font-bold text-green-600">{s.correct}</div>
                      <div className="text-xs text-gray-500">答对</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              正在学习的课程
            </h2>
            <p className="text-sm text-gray-500 mt-1">{LANGUAGE_INFO[currentUser.currentLanguage].flag} {LANGUAGE_INFO[currentUser.currentLanguage].name}</p>
          </div>
        </div>
        <div className="space-y-4">
          {recentCourses.map(course => (
            <div
              key={course.id}
              className="flex items-center gap-5 p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-md transition-all"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                <span className="text-3xl">{course.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{course.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`badge ${LEVEL_INFO[course.level].color}`}>
                        {LEVEL_INFO[course.level].name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {LESSONS.filter(l => course.lessons.includes(l.id)).reduce((s, l) => s + l.estimatedMinutes, 0)} 分钟
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-gray-800">{course.progress}%</div>
                    <div className="text-xs text-gray-500">{course.completed}/{course.total} 节</div>
                  </div>
                </div>
                <div className="progress-bar">
                  <div
                    className={`h-full bg-gradient-to-r ${course.color} rounded-full`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
          {recentCourses.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              暂无进行中的课程
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
