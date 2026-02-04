import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Bell, LogOut, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { notificationsAPI } from '../../../services/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function Header({ currentView }) {
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsAPI.getAll();
      setNotifications(response.notifications || []);
      setUnreadCount(response.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      courses: 'Courses',
      assessments: 'Assessments',
      knowledge: 'Knowledge Base',
      certificates: 'My Certificates',
      users: 'User Management',
      settings: 'Organization Settings',
      analytics: 'Analytics',
      'course-viewer': 'Course',
      'course-builder': 'Course Builder',
      'assessment-viewer': 'Assessment',
      'assessment-builder': 'Assessment Builder',
      'article-viewer': 'Article',
      'article-editor': 'Article Editor',
    };
    return titles[currentView] || 'Zoho Learning';
  };

  return (
    <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-white">{getPageTitle()}</h1>
          <p className="text-indigo-300 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 w-64 bg-white/10 border-white/20 text-white placeholder:text-indigo-300"
            />
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative text-indigo-200 hover:text-white hover:bg-white/10"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-slate-900/95 backdrop-blur-xl border-white/20">
              <div className="p-3 border-b border-white/10">
                <h3 className="text-white font-semibold">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-indigo-300">
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <DropdownMenuItem
                      key={notification._id}
                      className={`p-4 cursor-pointer ${
                        !notification.isRead ? 'bg-indigo-500/10' : ''
                      }`}
                      onClick={() => handleMarkAsRead(notification._id)}
                    >
                      <div>
                        <p className="text-white font-medium">{notification.title}</p>
                        <p className="text-indigo-300 text-sm mt-1">{notification.message}</p>
                        <p className="text-indigo-400 text-xs mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Logout */}
          <Button
            onClick={logout}
            variant="ghost"
            className="text-indigo-200 hover:text-white hover:bg-white/10"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
