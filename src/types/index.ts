export type Language = 'english';

export type Level = 'beginner' | 'elementary' | 'intermediate' | 'advanced' | 'expert';

export type ModuleType = 'vocabulary' | 'grammar' | 'speaking' | 'listening';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  level: number;
  exp: number;
  streak: number;
  lastActive: string;
  joinedAt: string;
  languages: Language[];
  currentLanguage: Language;
  achievements: string[];
  friends: string[];
}

export interface Word {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
  exampleTranslation: string;
  imageUrl?: string;
  difficulty: number;
}

export interface GrammarPoint {
  id: string;
  title: string;
  explanation: string;
  examples: { sentence: string; translation: string }[];
  structure: string;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'match' | 'speaking' | 'listening';
  content: string;
  options?: string[];
  answer: string | string[];
  explanation?: string;
  audioUrl?: string;
  audioText?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  moduleType: ModuleType;
  level: Level;
  language: Language;
  words?: Word[];
  grammarPoints?: GrammarPoint[];
  questions: Question[];
  xpReward: number;
  estimatedMinutes: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  language: Language;
  level: Level;
  levelNumber: number;
  icon: string;
  color: string;
  lessons: string[];
  prerequisites: string[];
  totalXp: number;
}

export interface UserProgress {
  userId: string;
  completedCourses: string[];
  completedLessons: string[];
  inProgressLessons: { lessonId: string; progress: number }[];
  courseProgress: { courseId: string; progress: number }[];
  masteredWords: { wordId: string; masteryLevel: number }[];
  totalStudyMinutes: number;
  dailyStreak: string[];
  moduleStats: {
    vocabulary: { correct: number; total: number };
    grammar: { correct: number; total: number };
    speaking: { correct: number; total: number };
    listening: { correct: number; total: number };
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: string;
  reward: number;
  checkCondition: (user: User, progress: UserProgress) => boolean;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  language: Language;
  content: string;
  likes: number;
  comments: number;
  likedBy: string[];
  createdAt: string;
  tags: string[];
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface StudyRecommendation {
  type: 'lesson' | 'review' | 'module';
  title: string;
  description: string;
  targetId: string;
  language: Language;
  priority: number;
  reason: string;
}
