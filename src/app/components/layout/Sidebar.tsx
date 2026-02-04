import { useAuth } from '../../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Award, 
  Users, 
  Settings, 
  BarChart3,
  GraduationCap,
  ClipboardCheck
} from 'lucide-react';

export default function Sidebar({ currentView, onNavigate }) {
  const { user, hasRole } = useAuth();

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      roles: ['Super Admin', 'Admin', 'HR', 'Trainer', 'Learner'] 
    },
    { 
      id: 'courses', 
      label: 'Courses', 
      icon: BookOpen, 
      roles: ['Super Admin', 'Admin', 'HR', 'Trainer', 'Learner'] 
    },
    { 
      id: 'assessments', 
      label: 'Assessments', 
      icon: ClipboardCheck, 
      roles: ['Super Admin', 'Admin', 'HR', 'Trainer', 'Learner'] 
    },
    { 
      id: 'knowledge', 
      label: 'Knowledge Base', 
      icon: FileText, 
      roles: ['Super Admin', 'Admin', 'HR', 'Trainer', 'Learner'] 
    },
    { 
      id: 'certificates', 
      label: 'Certificates', 
      icon: Award, 
      roles: ['Super Admin', 'Admin', 'HR', 'Trainer', 'Learner'] 
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      roles: ['Super Admin', 'Admin', 'HR', 'Trainer'] 
    },
    { 
      id: 'users', 
      label: 'User Management', 
      icon: Users, 
      roles: ['Super Admin', 'Admin', 'HR'] 
    },
    { 
      id: 'settings', 
      label: 'Organization Settings', 
      icon: Settings, 
      roles: ['Super Admin', 'Admin'] 
    },
  ];

  const visibleItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <aside className="w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Zoho Learning</h2>
            <p className="text-indigo-300 text-xs">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-auto">
        <ul className="space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{user?.name}</p>
              <p className="text-indigo-300 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
