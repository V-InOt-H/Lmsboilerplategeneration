import { useState, useEffect } from 'react';
import { analyticsAPI, assessmentsAPI } from '../../../services/api';
import { BookOpen, Award, Clock, TrendingUp, Play, ClipboardCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';

interface LearnerDashboardProps {
  onNavigate: (view: string) => void;
  onSelectCourse: (course: any) => void;
  onSelectAssessment: (assessment: any) => void;
}

interface Assessment {
  _id: string;
  title: string;
  description: string;
  course?: any;
  questions: any[];
  duration: number;
  passingScore: number;
  status: string;
  userAttempted: boolean;
  userScore: number | null;
  userPassed: boolean | null;
  attemptNumber: number;
}

export default function LearnerDashboard({ onNavigate, onSelectCourse, onSelectAssessment }: LearnerDashboardProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [availableAssessments, setAvailableAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const analyticsData = await analyticsAPI.getLearner();
      setAnalytics(analyticsData.analytics);
      setEnrolledCourses(analyticsData.analytics?.enrolledCourses || []);
      setAvailableAssessments(analyticsData.analytics?.availableAssessments || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  const handleStartAssessment = (assessment: Assessment) => {
    onSelectAssessment(assessment);
  };

  return (
    <div className="space-y-6">
      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Card 1 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <p className="text-indigo-300 text-sm mb-1">Total Courses</p>
          <p className="text-white text-3xl font-bold">{analytics?.courses?.total || 0}</p>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="text-indigo-300 text-sm mb-1">Completed</p>
          <p className="text-white text-3xl font-bold">{analytics?.courses?.completed || 0}</p>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-indigo-300 text-sm mb-1">In Progress</p>
          <p className="text-white text-3xl font-bold">{analytics?.courses?.inProgress || 0}</p>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <p className="text-indigo-300 text-sm mb-1">Avg Progress</p>
          <p className="text-white text-3xl font-bold">{analytics?.courses?.averageProgress || 0}%</p>
        </div>
      </div>

      {/* My Courses */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">My Courses</h2>
          <Button
            onClick={() => onNavigate('courses')}
            variant="ghost"
            className="text-indigo-300 hover:text-white hover:bg-white/10"
          >
            View All
          </Button>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">No courses enrolled yet</p>
            <p className="text-indigo-300 mb-4">Start your learning journey today!</p>
            <Button
              onClick={() => onNavigate('courses')}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              Browse Courses
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.map((enrollment) => (
              <div
                key={enrollment._id}
                className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-indigo-500/50 transition-all group"
              >
                <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white opacity-50" />
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2 line-clamp-2">
                    {enrollment.course?.title || 'Course Title'}
                  </h3>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-indigo-300">Progress</span>
                      <span className="text-white font-medium">{enrollment.progress || 0}%</span>
                    </div>
                    <Progress value={enrollment.progress || 0} className="h-2" />
                  </div>
                  <Button
                    onClick={() => onSelectCourse(enrollment.course)}
                    size="sm"
                    className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Assessments */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Available Assessments</h2>
          <Button
            onClick={() => onNavigate('assessments')}
            variant="ghost"
            className="text-indigo-300 hover:text-white hover:bg-white/10"
          >
            View All
          </Button>
        </div>

        {availableAssessments.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardCheck className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">No assessments available</p>
            <p className="text-indigo-300">Enroll in courses to access assessments</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableAssessments.slice(0, 6).map((assessment) => (
              <div
                key={assessment._id}
                className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-indigo-500/50 transition-all group"
              >
                <div className="h-32 bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <ClipboardCheck className="w-12 h-12 text-white opacity-50" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold line-clamp-2 flex-1">
                      {assessment.title}
                    </h3>
                    <span className={`ml-2 px-2 py-1 rounded-lg text-xs font-medium ${
                      assessment.status === 'Published' 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {assessment.status}
                    </span>
                  </div>
                  <p className="text-indigo-300 text-sm mb-3 line-clamp-2">
                    {assessment.description || 'Test your knowledge'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-indigo-300 mb-3">
                    <span>{assessment.questions?.length || 0} questions</span>
                    <span>{assessment.duration} mins</span>
                    <span>Pass: {assessment.passingScore}%</span>
                  </div>
                  {assessment.status === 'Draft' ? (
                    <div className="bg-yellow-500/20 text-yellow-300 text-sm font-medium px-3 py-2 rounded-lg text-center">
                      Coming Soon
                    </div>
                  ) : assessment.userAttempted ? (
                    <div className="space-y-2">
                      <div className={`text-sm font-medium px-3 py-2 rounded-lg text-center ${
                        assessment.userPassed 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {assessment.userPassed ? 'Passed' : 'Failed'} - {assessment.userScore?.toFixed(0)}%
                      </div>
                      <Button
                        onClick={() => handleStartAssessment(assessment)}
                        size="sm"
                        className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30"
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleStartAssessment(assessment)}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Assessment
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assessment Performance */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <h2 className="text-xl font-bold text-white mb-6">Assessment Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-indigo-300 text-sm mb-2">Total Assessments</p>
            <p className="text-white text-4xl font-bold">{analytics?.assessments?.total || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-indigo-300 text-sm mb-2">Passed</p>
            <p className="text-green-400 text-4xl font-bold">{analytics?.assessments?.passed || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-indigo-300 text-sm mb-2">Average Score</p>
            <p className="text-white text-4xl font-bold">{analytics?.assessments?.averageScore || 0}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
