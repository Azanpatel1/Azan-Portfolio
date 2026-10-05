import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GoalPage from './pages/GoalPage';
import InternshipsPage from './pages/InternshipsPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ResearchPage from './pages/ResearchPage';
import MediaPage from './pages/MediaPage';
import ScrollToTop from './components/layout/ScrollToTop';
import './index.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/goal" element={<GoalPage />} />
        <Route path="/vision" element={<Navigate to="/goal" replace />} />
        <Route path="/internships" element={<InternshipsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/media" element={<MediaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
