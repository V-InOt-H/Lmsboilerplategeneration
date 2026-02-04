import { useState } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import AdminDashboard from './components/admin/AdminDashboard';
import TrainerDashboard from './components/trainer/TrainerDashboard';
import LearnerDashboard from './components/learner/LearnerDashboard';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import CourseList from './components/courses/CourseList';
import CourseViewer from './components/courses/CourseViewer';
import CourseBuilder from './components/courses/CourseBuilder';
import AssessmentList from './components/assessments/AssessmentList';
import AssessmentViewer from './components/assessments/AssessmentViewer';
import AssessmentBuilder from './components/assessments/AssessmentBuilder';
import KnowledgeBase from './components/knowledge/KnowledgeBase';
import ArticleViewer from './components/knowledge/ArticleViewer';
import ArticleEditor from './components/knowledge/ArticleEditor';
import Certificates from './components/certificates/Certificates';
import UserManagement from './components/admin/UserManagement';
import OrgSettings from './components/admin/OrgSettings';
import Analytics from './components/admin/Analytics';

function AppContent() {
  const { user, loading, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (loading) {
    return (
      <div className="size-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showForgotPassword) {
      return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
    }
    return <Login onForgotPassword={() => setShowForgotPassword(true)} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        if (user.role === 'Super Admin' || user.role === 'Admin' || user.role === 'HR') {
          return <AdminDashboard onNavigate={setCurrentView} />;
        } else if (user.role === 'Trainer') {
          return <TrainerDashboard onNavigate={setCurrentView} />;
        } else {
          return <LearnerDashboard onNavigate={setCurrentView} onSelectCourse={(course) => {
            setSelectedItem(course);
            setCurrentView('course-viewer');
          }} />;
        }
      
      case 'courses':
        return <CourseList 
          onSelectCourse={(course) => {
            setSelectedItem(course);
            setCurrentView('course-viewer');
          }}
          onCreateCourse={() => {
            setSelectedItem(null);
            setCurrentView('course-builder');
          }}
        />;
      
      case 'course-viewer':
        return <CourseViewer 
          course={selectedItem} 
          onBack={() => setCurrentView('courses')}
          onEdit={(course) => {
            setSelectedItem(course);
            setCurrentView('course-builder');
          }}
        />;
      
      case 'course-builder':
        return <CourseBuilder 
          course={selectedItem}
          onBack={() => setCurrentView('courses')}
          onSave={() => setCurrentView('courses')}
        />;
      
      case 'assessments':
        return <AssessmentList 
          onSelectAssessment={(assessment) => {
            setSelectedItem(assessment);
            setCurrentView('assessment-viewer');
          }}
          onCreateAssessment={() => {
            setSelectedItem(null);
            setCurrentView('assessment-builder');
          }}
        />;
      
      case 'assessment-viewer':
        return <AssessmentViewer 
          assessment={selectedItem}
          onBack={() => setCurrentView('assessments')}
        />;
      
      case 'assessment-builder':
        return <AssessmentBuilder 
          assessment={selectedItem}
          onBack={() => setCurrentView('assessments')}
          onSave={() => setCurrentView('assessments')}
        />;
      
      case 'knowledge':
        return <KnowledgeBase 
          onSelectArticle={(article) => {
            setSelectedItem(article);
            setCurrentView('article-viewer');
          }}
          onCreateArticle={() => {
            setSelectedItem(null);
            setCurrentView('article-editor');
          }}
        />;
      
      case 'article-viewer':
        return <ArticleViewer 
          article={selectedItem}
          onBack={() => setCurrentView('knowledge')}
          onEdit={(article) => {
            setSelectedItem(article);
            setCurrentView('article-editor');
          }}
        />;
      
      case 'article-editor':
        return <ArticleEditor 
          article={selectedItem}
          onBack={() => setCurrentView('knowledge')}
          onSave={() => setCurrentView('knowledge')}
        />;
      
      case 'certificates':
        return <Certificates />;
      
      case 'users':
        return <UserManagement />;
      
      case 'settings':
        return <OrgSettings />;
      
      case 'analytics':
        return <Analytics />;
      
      default:
        return <div className="text-white">View not found</div>;
    }
  };

  return (
    <div className="size-full flex bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 overflow-hidden">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentView={currentView} />
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
