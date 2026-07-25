import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { User, UserProgress, CommunityPost } from '../types';
import { INITIAL_POSTS } from '../data/mockData';

interface AppState {
  currentUser: User | null;
  userProgress: UserProgress | null;
  users: User[];
  posts: CommunityPost[];
}

type AppAction =
  | { type: 'REGISTER'; payload: { username: string; email: string; password: string } }
  | { type: 'LOGIN'; payload: { email: string; password: string } }
  | { type: 'GUEST_LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<UserProgress> }
  | { type: 'COMPLETE_LESSON'; payload: { lessonId: string; xp: number } }
  | { type: 'ADD_POST'; payload: CommunityPost }
  | { type: 'LIKE_POST'; payload: { postId: string; userId: string } }
  | { type: 'ADD_WORD_MASTERY'; payload: { wordId: string; level: number } }
  | { type: 'ADD_STUDY_TIME'; payload: number }
  | { type: 'UPDATE_MODULE_STATS'; payload: { module: keyof UserProgress['moduleStats']; correct: boolean } }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string };

const STORAGE_KEY = 'lingua-learn-state';

const getInitialProgress = (userId: string): UserProgress => ({
  userId,
  completedCourses: [],
  completedLessons: [],
  inProgressLessons: [],
  courseProgress: [],
  masteredWords: [],
  totalStudyMinutes: 0,
  dailyStreak: [new Date().toDateString()],
  moduleStats: {
    vocabulary: { correct: 0, total: 0 },
    grammar: { correct: 0, total: 0 },
    speaking: { correct: 0, total: 0 },
    listening: { correct: 0, total: 0 },
  },
});

const initialState: AppState = {
  currentUser: null,
  userProgress: null,
  users: [],
  posts: INITIAL_POSTS,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'REGISTER': {
      const { username, email, password } = action.payload;
      if (state.users.some(u => u.email === email)) {
        return state;
      }
      const newUser: User = {
        id: `u_${Date.now()}`,
        username,
        email,
        password,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        level: 1,
        exp: 0,
        streak: 1,
        lastActive: new Date().toISOString(),
        joinedAt: new Date().toISOString(),
        languages: [],
        currentLanguage: 'english',
        achievements: [],
        friends: [],
      };
      const progress = getInitialProgress(newUser.id);
      const newState = {
        ...state,
        users: [...state.users, newUser],
        currentUser: newUser,
        userProgress: progress,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    }

    case 'LOGIN': {
      const { email, password } = action.payload;
      const user = state.users.find(u => u.email === email && u.password === password);
      if (!user) return state;
      const today = new Date().toDateString();
      const updatedUser = { ...user, lastActive: new Date().toISOString() };
      let updatedProgress = state.userProgress;
      if (state.userProgress) {
        const lastStreak = state.userProgress.dailyStreak[state.userProgress.dailyStreak.length - 1];
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (lastStreak !== today) {
          const newStreak = lastStreak === yesterday
            ? [...state.userProgress.dailyStreak, today]
            : [today];
          updatedProgress = {
            ...state.userProgress,
            dailyStreak: newStreak,
          };
          updatedUser.streak = newStreak.length;
        }
      }
      const newState = { ...state, currentUser: updatedUser, userProgress: updatedProgress };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    }

    case 'LOGOUT': {
      const newState = { ...state, currentUser: null, userProgress: null };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    }

    case 'GUEST_LOGIN': {
      const guestId = 'guest_user';
      const existingGuest = state.users.find(u => u.id === guestId);
      const guestUser: User = existingGuest || {
        id: guestId,
        username: '游客',
        email: 'guest@lingualearn.app',
        password: '',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=guest`,
        level: 1,
        exp: 0,
        streak: 1,
        lastActive: new Date().toISOString(),
        joinedAt: new Date().toISOString(),
        languages: [],
        currentLanguage: 'english',
        achievements: [],
        friends: [],
      };
      const guestProgress = state.userProgress?.userId === guestId
        ? state.userProgress
        : getInitialProgress(guestId);
      const allUsers = existingGuest
        ? state.users
        : [...state.users, guestUser];
      const newState = {
        ...state,
        users: allUsers,
        currentUser: guestUser,
        userProgress: guestProgress,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    }

    case 'UPDATE_USER': {
      if (!state.currentUser) return state;
      const updatedUser = { ...state.currentUser, ...action.payload };
      const newState = {
        ...state,
        currentUser: updatedUser,
        users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    }

    case 'UPDATE_PROGRESS': {
      if (!state.userProgress) return state;
      const newProgress = { ...state.userProgress, ...action.payload };
      const newState = { ...state, userProgress: newProgress };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    }

    case 'COMPLETE_LESSON': {
      if (!state.currentUser || !state.userProgress) return state;
      const { lessonId, xp } = action.payload;
      const newExp = state.currentUser.exp + xp;
      const newLevel = Math.floor(newExp / 500) + 1;
      const levelUpXp = newLevel > state.currentUser.level ? 500 : 0;
      
      const updatedUser = {
        ...state.currentUser,
        exp: newExp - levelUpXp * (newLevel - state.currentUser.level - 1),
        level: newLevel,
      };

      const completedLessons = state.userProgress.completedLessons.includes(lessonId)
        ? state.userProgress.completedLessons
        : [...state.userProgress.completedLessons, lessonId];

      const newProgress = {
        ...state.userProgress,
        completedLessons,
        inProgressLessons: state.userProgress.inProgressLessons.filter(l => l.lessonId !== lessonId),
      };

      const newState = {
        ...state,
        currentUser: updatedUser,
        users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u),
        userProgress: newProgress,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    }

    case 'ADD_POST': {
      const newState = { ...state, posts: [action.payload, ...state.posts] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    }

    case 'LIKE_POST': {
      const { postId, userId } = action.payload;
      const newPosts = state.posts.map(post => {
        if (post.id === postId) {
          const alreadyLiked = post.likedBy.includes(userId);
          return {
            ...post,
            likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
            likedBy: alreadyLiked
              ? post.likedBy.filter(id => id !== userId)
              : [...post.likedBy, userId],
          };
        }
        return post;
      });
      const newState = { ...state, posts: newPosts };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    }

    case 'ADD_WORD_MASTERY': {
      if (!state.userProgress) return state;
      const { wordId, level } = action.payload;
      const existingIndex = state.userProgress.masteredWords.findIndex(w => w.wordId === wordId);
      const newMastered = [...state.userProgress.masteredWords];
      if (existingIndex >= 0) {
        newMastered[existingIndex] = { wordId, masteryLevel: Math.max(newMastered[existingIndex].masteryLevel, level) };
      } else {
        newMastered.push({ wordId, masteryLevel: level });
      }
      const newState = { ...state, userProgress: { ...state.userProgress, masteredWords: newMastered } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    }

    case 'ADD_STUDY_TIME': {
      if (!state.userProgress) return state;
      const newProgress = {
        ...state.userProgress,
        totalStudyMinutes: state.userProgress.totalStudyMinutes + action.payload,
      };
      const newState = { ...state, userProgress: newProgress };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    }

    case 'UPDATE_MODULE_STATS': {
      if (!state.userProgress) return state;
      const { module, correct } = action.payload;
      const stats = state.userProgress.moduleStats[module];
      const newStats = {
        ...stats,
        correct: correct ? stats.correct + 1 : stats.correct,
        total: stats.total + 1,
      };
      const newProgress = {
        ...state.userProgress,
        moduleStats: { ...state.userProgress.moduleStats, [module]: newStats },
      };
      const newState = { ...state, userProgress: newProgress };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    }

    case 'UNLOCK_ACHIEVEMENT': {
      if (!state.currentUser) return state;
      if (state.currentUser.achievements.includes(action.payload)) return state;
      const updatedUser = {
        ...state.currentUser,
        achievements: [...state.currentUser.achievements, action.payload],
      };
      const newState = {
        ...state,
        currentUser: updatedUser,
        users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    }

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (initial) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initial, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load state:', e);
    }
    return initial;
  });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
