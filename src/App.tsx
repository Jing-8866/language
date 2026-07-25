import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <AppProvider>
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
