import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/Landing';
import { LoginPage, RegisterPage } from './pages/Auth';
import { DashboardPage } from './pages/Dashboard';
import { CoursesPage, CourseDetailPage } from './pages/Courses';
import { LessonPage } from './pages/Lesson';
import { ProgressPage } from './pages/Progress';
import { AchievementsPage } from './pages/Achievements';
import { CommunityPage } from './pages/Community';
import './index.css';

function SpeechInit() {
  const warmedUp = useRef(false);

  useEffect(() => {
    const warmUp = () => {
      if (warmedUp.current) return;
      warmedUp.current = true;
      if (!('speechSynthesis' in window)) return;
      // 预加载语音列表，触发浏览器加载 TTS 引擎
      window.speechSynthesis.getVoices();
      // 发送一个无声的空文本，激活移动端音频上下文
      const u = new SpeechSynthesisUtterance('');
      u.volume = 0;
      u.rate = 1;
      window.speechSynthesis.speak(u);
      document.removeEventListener('click', warmUp);
      document.removeEventListener('touchstart', warmUp);
    };
    document.addEventListener('click', warmUp);
    document.addEventListener('touchstart', warmUp);
    return () => {
      document.removeEventListener('click', warmUp);
      document.removeEventListener('touchstart', warmUp);
    };
  }, []);

  return null;
}

function App() {
  return (
    <AppProvider>
      <SpeechInit />
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <DashboardPage />
              </Layout>
            }
          />
          <Route
            path="/courses"
            element={
              <Layout>
                <CoursesPage />
              </Layout>
            }
          />
          <Route
            path="/course/:id"
            element={
              <Layout>
                <CourseDetailPage />
              </Layout>
            }
          />
          <Route
            path="/lesson/:id"
            element={
              <Layout>
                <LessonPage />
              </Layout>
            }
          />
          <Route
            path="/progress"
            element={
              <Layout>
                <ProgressPage />
              </Layout>
            }
          />
          <Route
            path="/achievements"
            element={
              <Layout>
                <AchievementsPage />
              </Layout>
            }
          />
          <Route
            path="/community"
            element={
              <Layout>
                <CommunityPage />
              </Layout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
