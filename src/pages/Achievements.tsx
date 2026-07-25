import { useApp } from '../context/AppContext';
import { Trophy, Lock, Star, Sparkles, Target, Flame, BookOpen, Globe, MessageCircle, Award, CheckCircle2, Clock } from 'lucide-react';
import { ACHIEVEMENTS_DATA } from '../data/mockData';

export function AchievementsPage() {
  const { state } = useApp();

  if (!state.currentUser || !state.userProgress) {
    return null;
  }

  const unlockedCount = state.currentUser.achievements.length;
  const totalCount = ACHIEVEMENTS_DATA.length;
  const progressPct = Math.round((unlockedCount / totalCount) * 100);
  const totalReward = ACHIEVEMENTS_DATA.filter(a => state.currentUser!.achievements.includes(a.id))
    .reduce((s, a) => s + a.reward, 0);

  const getAchievementIcon = (req: string) => {
    switch (req) {
      case 'complete-first-lesson': return Star;
      case 'streak-7': return Flame;
      case 'study-100min': return Clock;
      case 'words-50': return BookOpen;
      case 'multilingual': return Globe;
      case 'first-post': return MessageCircle;
      case 'perfect-score': return Target;
      case 'complete-course': return Trophy;
      default: return Award;
    }
  };

  const getColor = (req: string) => {
    const colors = [
      'from-green-400 to-emerald-600',
      'from-orange-400 to-red-500',
      'from-blue-400 to-indigo-600',
      'from-purple-400 to-pink-600',
      'from-cyan-400 to-blue-600',
      'from-pink-400 to-rose-500',
      'from-yellow-400 to-orange-500',
      'from-amber-400 to-yellow-500',
    ];
    const idx = ['complete-first-lesson', 'streak-7', 'study-100min', 'words-50', 'multilingual', 'first-post', 'perfect-score', 'complete-course'].indexOf(req);
    return colors[idx >= 0 ? idx : 0];
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Trophy className="w-9 h-9 text-yellow-500" />
          成就中心
        </h1>
        <p className="text-gray-600">解锁成就，见证你的成长之路</p>
      </div>

      <div className="relative overflow-hidden rounded-3xl p-8 md:p-10 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.25),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="relative z-10 grid md:grid-cols-4 gap-8 items-center">
          <div className="md:col-span-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              成就总览
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3">
              {unlockedCount} / {totalCount}
            </h2>
            <p className="text-white/90 text-lg">已解锁成就 · 继续加油！</p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="opacity-90">解锁进度</span>
                <span className="font-bold">{progressPct}%</span>
              </div>
              <div className="h-4 bg-white/20 backdrop-blur rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-1000"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/15 backdrop-blur rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-5 h-5" />
                  <span className="text-sm opacity-90">奖励 XP</span>
                </div>
                <div className="text-2xl font-bold">+{totalReward}</div>
              </div>
              <div className="bg-white/15 backdrop-blur rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-5 h-5" />
                  <span className="text-sm opacity-90">剩余</span>
                </div>
                <div className="text-2xl font-bold">{totalCount - unlockedCount} 项</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Award className="w-6 h-6 text-primary-500" />
          全部成就
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ACHIEVEMENTS_DATA.map(achievement => {
            const unlocked = state.currentUser!.achievements.includes(achievement.id);
            const Icon = getAchievementIcon(achievement.requirement);
            const color = getColor(achievement.requirement);

            let progressInfo = null;
            switch (achievement.requirement) {
              case 'complete-first-lesson': {
                const done = state.userProgress!.completedLessons.length >= 1;
                progressInfo = { current: Math.min(state.userProgress!.completedLessons.length, 1), total: 1, done };
                break;
              }
              case 'streak-7': {
                const current = Math.min(state.currentUser!.streak, 7);
                progressInfo = { current, total: 7, done: current >= 7 };
                break;
              }
              case 'study-100min': {
                const current = Math.min(state.userProgress!.totalStudyMinutes, 100);
                progressInfo = { current, total: 100, done: current >= 100 };
                break;
              }
              case 'words-50': {
                const current = Math.min(state.userProgress!.masteredWords.length, 50);
                progressInfo = { current, total: 50, done: current >= 50 };
                break;
              }
              case 'multilingual': {
                const current = Math.min(state.currentUser!.languages.length, 2);
                progressInfo = { current, total: 2, done: current >= 2 };
                break;
              }
              case 'first-post': {
                progressInfo = { current: unlocked ? 1 : 0, total: 1, done: unlocked };
                break;
              }
              case 'perfect-score': {
                progressInfo = { current: unlocked ? 1 : 0, total: 1, done: unlocked };
                break;
              }
              case 'complete-course': {
                const current = Math.min(state.userProgress!.completedCourses.length, 1);
                progressInfo = { current, total: 1, done: current >= 1 };
                break;
              }
            }
            const pct = progressInfo && progressInfo.total > 0 ? Math.round((progressInfo.current / progressInfo.total) * 100) : 0;

            return (
              <div
                key={achievement.id}
                className={`card-hover relative overflow-hidden ${!unlocked ? 'grayscale-[30%]' : ''}`}
              >
                {unlocked && (
                  <div className="absolute top-3 right-3">
                    <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-xl relative ${unlocked ? 'animate-float' : 'opacity-50'}`}>
                  {unlocked ? (
                    <Icon className="w-10 h-10 text-white" />
                  ) : (
                    <Lock className="w-8 h-8 text-white/80" />
                  )}
                </div>
                <div className="text-center mb-4">
                  <h3 className={`font-bold text-lg mb-1 ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                    {unlocked ? achievement.title : '???'}
                  </h3>
                  <p className={`text-sm ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                    {unlocked ? achievement.description : '完成挑战即可解锁'}
                  </p>
                </div>
                {progressInfo && !unlocked && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500">进度</span>
                      <span className="font-semibold text-gray-700">{progressInfo.current} / {progressInfo.total}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {unlocked ? '✨ 已获得' : '🔒 未解锁'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-yellow-600">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    +{achievement.reward} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
