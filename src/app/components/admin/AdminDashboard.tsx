import { useState, useEffect } from 'react';
import { analyticsAPI } from '../../../services/api';
import { Users, BookOpen, Award, TrendingUp, UserCheck, FileText, Download } from 'lucide-react';
import { Button } from '../ui/button';

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

interface Overview {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  publishedCourses: number;
  totalEnrollments: number;
  completedCourses: number;
  totalCertificates: number;
}

interface AssessmentStats {
  totalAttempts: number;
  passedAssessments: number;
  averageScore: string;
}

interface AnalyticsData {
  overview: Overview;
  assessments: AssessmentStats;
  topCourses?: any[];
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsAPI.getDashboard();
      // Cast the response to match our interface
      const analyticsData = response.analytics as AnalyticsData;
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: string) => {
    try {
      await analyticsAPI.export(type);
    } catch (err) {
      console.error('Failed to export:', err);
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  const overview: Overview = analytics?.overview || {
    totalUsers: 0,
    activeUsers: 0,
    totalCourses: 0,
    publishedCourses: 0,
    totalEnrollments: 0,
    completedCourses: 0,
    totalCertificates: 0
  };
  
  const assessmentStats: AssessmentStats = analytics?.assessments || {
    totalAttempts: 0,
    passedAssessments: 0,
    averageScore: '0'
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h2>
        <p className="text-indigo-100">Here&apos;s what&apos;s happening with your learning platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-indigo-300 text-sm mb-1">Total Users</p>
          <p className="text-white text-3xl font-bold">{overview.totalUsers}</p>
          <p className="text-indigo-400 text-xs mt-2">{overview.activeUsers} active</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-indigo-300 text-sm mb-1">Total Courses</p>
          <p className="text-white text-3xl font-bold">{overview.totalCourses}</p>
          <p className="text-indigo-400 text-xs mt-2">{overview.publishedCourses} published</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="text-indigo-300 text-sm mb-1">Enrollments</p>
          <p className="text-white text-3xl font-bold">{overview.totalEnrollments}</p>
          <p className="text-indigo-400 text-xs mt-2">{overview.completedCourses} completed</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <p className="text-indigo-300 text-sm mb-1">Certificates</p>
          <p className="text-white text-3xl font-bold">{overview.totalCertificates}</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Courses */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <h3 className="text-xl font-bold text-white mb-6">Top Courses</h3>
          <div className="space-y-4">
            {analytics?.topCourses?.slice(0, 5).map((course: any, index: number) => (
              <div key={course._id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{course.title}</p>
                  <p className="text-indigo-300 text-sm">{course.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{course.enrolledUsers?.length || 0}</p>
                  <p className="text-indigo-400 text-xs">enrollments</p>
                </div>
              </div>
            )) || (
              <p className="text-indigo-300 text-center py-8">No course data available</p>
            )}
          </div>
        </div>

        {/* Assessment Performance */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <h3 className="text-xl font-bold text-white mb-6">Assessment Overview</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <FileText className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <p className="text-white text-2xl font-bold">{assessmentStats.totalAttempts}</p>
                <p className="text-indigo-300 text-sm">Total Attempts</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <UserCheck className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-white text-2xl font-bold">{assessmentStats.passedAssessments}</p>
                <p className="text-indigo-300 text-sm">Passed</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-white text-2xl font-bold">{assessmentStats.averageScore}%</p>
                <p className="text-indigo-300 text-sm">Avg Score</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button
            onClick={() => onNavigate('users')}
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30"
          >
            <Users className="w-4 h-4 mr-2" />
            Manage Users
          </Button>
          <Button
            onClick={() => onNavigate('courses')}
            className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Manage Courses
          </Button>
          <Button
            onClick={() => onNavigate('analytics')}
            className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
          <Button
            onClick={() => handleExport('users')}
            className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>
    </div>
  );
}

