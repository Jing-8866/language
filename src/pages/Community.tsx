import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Heart,
  MessageCircle,
  Send,
  Plus,
  Globe,
  Filter,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import { LANGUAGE_INFO } from '../data/mockData';
import type { Language, CommunityPost } from '../types';

export function CommunityPage() {
  const { state, dispatch } = useApp();
  const [filterLang, setFilterLang] = useState<Language | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostLanguage, setNewPostLanguage] = useState<Language>('english');
  const [newPostTags, setNewPostTags] = useState('');

  if (!state.currentUser) {
    return null;
  }

  const filteredPosts = state.posts.filter(p => {
    if (filterLang !== 'all' && p.language !== filterLang) return false;
    return true;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleLike = (postId: string) => {
    dispatch({ type: 'LIKE_POST', payload: { postId, userId: state.currentUser!.id } });
  };

  const handleSubmitPost = () => {
    if (!newPostContent.trim()) return;
    const tags = newPostTags.split(/[,，\s]+/).filter(t => t.trim());
    const post: CommunityPost = {
      id: `p_${Date.now()}`,
      authorId: state.currentUser!.id,
      authorName: state.currentUser!.username,
      authorAvatar: state.currentUser!.avatar,
      language: newPostLanguage,
      content: newPostContent.trim(),
      likes: 0,
      comments: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
      tags,
    };
    dispatch({ type: 'ADD_POST', payload: post });
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'ach6' });
    setNewPostContent('');
    setNewPostTags('');
    setShowCreateModal(false);
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    return `${days}天前`;
  };

  const trendingTags = ['学习方法', '打卡', '经验分享', '英语', '医学英语', '趣味学习', '励志'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Users className="w-9 h-9 text-accent-500" />
            学习社区
          </h1>
          <p className="text-gray-600">与全球学习者交流，分享经验，共同进步</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-accent inline-flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          发布帖子
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="card">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Filter className="w-4 h-4" />
                  按语言筛选
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterLang('all')}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${filterLang === 'all' ? 'bg-accent-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <Globe className="w-4 h-4 inline mr-1" />
                    全部
                  </button>
                  {Object.entries(LANGUAGE_INFO).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setFilterLang(key as Language)}
                      className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${filterLang === key ? 'bg-accent-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {val.flag} {val.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                共 <span className="font-bold text-gray-800">{sortedPosts.length}</span> 条帖子
              </div>
            </div>
          </div>

          {sortedPosts.length > 0 ? (
            <div className="space-y-4">
              {sortedPosts.map(post => {
                const isLiked = post.likedBy.includes(state.currentUser!.id);
                return (
                  <div key={post.id} className="card hover:shadow-xl transition-all">
                    <div className="flex items-start gap-4">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 shadow-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="font-bold text-gray-900">{post.authorName}</span>
                          <span className="badge bg-gray-100 text-gray-600">
                            {LANGUAGE_INFO[post.language].flag} {LANGUAGE_INFO[post.language].name}
                          </span>
                          <span className="text-xs text-gray-400 inline-flex items-center gap-1 ml-auto">
                            <Clock className="w-3.5 h-3.5" />
                            {timeAgo(post.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-800 text-base leading-relaxed mb-4 whitespace-pre-wrap">
                          {post.content}
                        </p>
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="text-xs font-medium px-3 py-1 bg-primary-50 text-primary-700 rounded-full hover:bg-primary-100 cursor-pointer transition-colors"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`inline-flex items-center gap-2 font-medium transition-all ${
                              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500' : ''}`} />
                            <span>{post.likes}</span>
                          </button>
                          <button className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 font-medium transition-colors">
                            <MessageCircle className="w-5 h-5" />
                            <span>{post.comments}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card text-center py-16">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">暂无相关帖子</h3>
              <p className="text-gray-500 mb-6">换个语言筛选或发布第一个帖子吧！</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-accent inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                发布帖子
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              热门话题
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag, i) => (
                <button
                  key={i}
                  className="text-sm px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-primary-50 hover:to-accent-50 text-gray-700 hover:text-primary-700 rounded-full transition-all font-medium border border-gray-200 hover:border-primary-200"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              社区公约
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>分享有用的学习经验和心得</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>尊重他人，友善交流</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>互相鼓励，共同进步</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">✗</span>
                <span>禁止发布广告和无关内容</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">✗</span>
                <span>禁止人身攻击和不当言论</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative card w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary-500" />
              发布新帖子
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择语言分类</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(LANGUAGE_INFO).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setNewPostLanguage(key as Language)}
                      className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                        newPostLanguage === key
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {val.flag} {val.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">帖子内容</label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={6}
                  placeholder="分享你的学习心得、提问、经验、打卡记录..."
                  className="input-field resize-none"
                />
                <div className="text-right text-xs text-gray-400 mt-1">{newPostContent.length} 字</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  标签 <span className="text-gray-400 font-normal">（空格或逗号分隔）</span>
                </label>
                <input
                  type="text"
                  value={newPostTags}
                  onChange={(e) => setNewPostTags(e.target.value)}
                  placeholder="如：学习方法 英语 经验分享"
                  className="input-field"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmitPost}
                  disabled={!newPostContent.trim()}
                  className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  发布
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
