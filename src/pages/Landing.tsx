import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  MessageCircle,
  Ear,
  Mic,
  Trophy,
  BarChart3,
  Users,
  ArrowRight,
  ChevronRight,
  Globe,
  Star,
  UserPlus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function LandingPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const handleGuestEnter = () => {
    if (!state.currentUser) {
      dispatch({ type: 'GUEST_LOGIN' });
    }
    navigate('/dashboard');
  };
  const features = [
    {
      icon: BookOpen,
      title: '分级课程体系',
      description: '从入门到专家，科学分级的课程设计，每一步都有明确目标',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: MessageCircle,
      title: '单词记忆',
      description: '智能闪卡算法，结合例句和图片，高效记忆永不遗忘',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: Ear,
      title: '听力训练',
      description: '沉浸式听力素材，从简单对话到复杂场景，循序渐进',
      color: 'from-orange-500 to-amber-600',
    },
    {
      icon: Mic,
      title: '口语跟读',
      description: '智能语音评分，实时发音反馈，标准口音脱口而出',
      color: 'from-pink-500 to-rose-600',
    },
    {
      icon: BarChart3,
      title: '进度追踪',
      description: '可视化学习数据，全面掌握学习效果与薄弱环节',
      color: 'from-purple-500 to-violet-600',
    },
    {
      icon: Trophy,
      title: '成就激励',
      description: '丰富的成就系统和勋章墙，让学习像游戏一样有趣',
      color: 'from-yellow-500 to-orange-600',
    },
  ];

  const languages = [
    { name: '英语', native: 'English', flag: '🇺🇸', desc: '全球通用语言，国际职场必备', color: 'bg-blue-500' },
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent_50%)]" />
        
        <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LinguaLearn</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-white/90 hover:text-white font-medium px-4 py-2">
                登录
              </Link>
              <Link to="/register" className="bg-white text-indigo-600 font-semibold px-5 py-2 rounded-xl hover:bg-white/90 transition-all shadow-lg">
                免费注册
              </Link>
            </div>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 md:pt-20 md:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white/90 text-sm mb-6">
                <Globe className="w-4 h-4" />
                <span>专注英语学习，从入门到精通</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                沉浸式多语言
                <br />
                <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                  学习新体验
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl">
                科学分级的课程体系，互动式学习模块，个性化学习路径推荐。
                让语言学习变得轻松有趣，随时随地进步不停。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 font-bold px-8 py-4 rounded-2xl hover:bg-white/90 transition-all shadow-2xl text-lg"
                >
                  开始学习 <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleGuestEnter}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white font-semibold px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all text-lg"
                >
                  <UserPlus className="w-5 h-5" />
                  游客体验
                </button>
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white font-semibold px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all text-lg"
                >
                  浏览课程
                </Link>
              </div>
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">50K+</div>
                  <div className="text-white/70 text-sm">活跃学员</div>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">200+</div>
                  <div className="text-white/70 text-sm">精品课程</div>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-3xl font-bold text-white">4.9</span>
                    <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                  </div>
                  <div className="text-white/70 text-sm">用户评分</div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative animate-float">
                <div className="absolute -top-8 -left-8 w-72 h-72 bg-yellow-400/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-pink-400/30 rounded-full blur-3xl" />
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-5 shadow-xl">
                      <div className="text-4xl mb-2">🇺🇸</div>
                      <div className="text-sm font-bold text-gray-800">英语</div>
                      <div className="text-xs text-gray-500 mt-1">80节课</div>
                      <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-blue-500 rounded-full" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 shadow-xl text-white">
                      <Trophy className="w-8 h-8 mb-2" />
                      <div className="text-sm font-bold">+1,250 XP</div>
                      <div className="text-xs text-white/80 mt-1">本周学习</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-xl col-span-2">
                      <div className="text-4xl mb-2">🩺</div>
                      <div className="text-sm font-bold text-gray-800">医学英语</div>
                      <div className="text-xs text-gray-500 mt-1">肾病内分泌科专项</div>
                      <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-teal-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              为什么选择 <span className="gradient-text">LinguaLearn</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              我们将语言学前沿研究与先进技术结合，打造最高效的学习体验
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              主打英语，<span className="gradient-text">专业学习</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              从基础到医学专业英语，满足留学、工作和临床需求
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {languages.map((lang, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer"
              >
                <div className={`h-2 ${lang.color}`} />
                <div className="p-8">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">{lang.flag}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{lang.name}</h3>
                  <p className="text-gray-500 mb-4">{lang.native}</p>
                  <p className="text-gray-600 mb-6">{lang.desc}</p>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors"
                  >
                    开始学习 <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            准备好开始学习了吗？
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            加入50,000+学员的行列，今天就迈出语言学习的第一步。
            完全免费开始，无需信用卡！
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-10 py-5 rounded-2xl hover:bg-white/90 transition-all shadow-2xl text-xl"
          >
            <Sparkles className="w-6 h-6" />
            免费开始学习
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">LinguaLearn</span>
            </div>
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <span>© 2026 LinguaLearn. 保留所有权利。</span>
              <Users className="w-4 h-4" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
