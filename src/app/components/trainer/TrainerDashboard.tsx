import { useState, useEffect } from 'react';
import { analyticsAPI } from '../../../services/api';
import { BookOpen, Users, TrendingUp, Clock } from 'lucide-react';
import { Button } from '../ui/button';

export default function TrainerDashboard({ onNavigate }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsAPI.getDashboard();
      setAnalytics(response.analytics);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  const overview = analytics?.overview || {};

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome, Trainer! 📚</h2>
        <p className="text-purple-100">Create engaging content and track learner progress.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-indigo-300 text-sm mb-1">My Courses</p>
          <p className="text-white text-3xl font-bold">{overview.totalCourses || 0}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-indigo-300 text-sm mb-1">Total Learners</p>
          <p className="text-white text-3xl font-bold">{overview.totalEnrollments || 0}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="text-indigo-300 text-sm mb-1">Completions</p>
          <p className="text-white text-3xl font-bold">{overview.completedCourses || 0}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <p className="text-indigo-300 text-sm mb-1">Avg. Completion</p>
          <p className="text-white text-3xl font-bold">
            {overview.completedCourses && overview.totalEnrollments
              ? Math.round((overview.completedCourses / overview.totalEnrollments) * 100)
              : 0}%
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => onNavigate('courses')}
            className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 py-6"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Create New Course
          </Button>
          <Button
            onClick={() => onNavigate('assessments')}
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 py-6"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Create Assessment
          </Button>
          <Button
            onClick={() => onNavigate('knowledge')}
            className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 py-6"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Write Article
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <h3 className="text-xl font-bold text-white mb-6">Recent Enrollments</h3>
        <div className="space-y-3">
          {analytics?.recentEnrollments?.slice(0, 5).map((enrollment) => (
            <div key={enrollment._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {enrollment.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium">{enrollment.name}</p>
                  <p className="text-indigo-300 text-sm">{enrollment.email}</p>
                </div>
              </div>
            </div>
          )) || (
            <p className="text-indigo-300 text-center py-8">No recent enrollments</p>
          )}
        </div>
      </div>
    </div>
  );
}
