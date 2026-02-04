import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { ArrowLeft, Play, Check, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';
import { coursesAPI } from '../../../services/api';

export default function CourseViewer({ course, onBack, onEdit }) {
  const { user, hasRole } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());

  if (!course) {
    return null;
  }

  const handleCompleteLesson = async (lessonId) => {
    try {
      const newCompleted = new Set(completedLessons);
      newCompleted.add(lessonId);
      setCompletedLessons(newCompleted);

      // Calculate progress
      const totalLessons = course.modules?.reduce((sum, module) => sum + (module.lessons?.length || 0), 0) || 1;
      const progress = Math.round((newCompleted.size / totalLessons) * 100);

      await coursesAPI.updateProgress(course._id, { lessonId, progress });
      toast.success('Lesson marked as complete!');
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-indigo-300 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
        {hasRole('Super Admin', 'Admin', 'Trainer') && (
          <Button
            onClick={() => onEdit(course)}
            className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30"
          >
            Edit Course
          </Button>
        )}
      </div>

      {/* Course Header */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 h-48 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Play className="w-16 h-16 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-3">{course.title}</h1>
            <p className="text-indigo-200 mb-4">{course.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-indigo-300 mb-4">
              <span className="px-3 py-1 bg-white/10 rounded-full">{course.category}</span>
              <span className="px-3 py-1 bg-white/10 rounded-full">{course.level}</span>
              <span className="px-3 py-1 bg-white/10 rounded-full">{course.duration} mins</span>
              <span className="px-3 py-1 bg-white/10 rounded-full">{course.modules?.length || 0} modules</span>
            </div>
            {user.role === 'Learner' && (
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-indigo-300">Your Progress</span>
                  <span className="text-white font-medium">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Module List */}
        <div className="lg:col-span-1">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4 space-y-2 sticky top-6">
            <h3 className="text-white font-bold mb-4">Course Content</h3>
            {course.modules?.map((module, moduleIndex) => (
              <div key={module._id || moduleIndex}>
                <div className="text-white font-medium mb-2 px-3 py-2 bg-white/5 rounded-lg">
                  {moduleIndex + 1}. {module.title}
                </div>
                <div className="space-y-1 ml-4">
                  {module.lessons?.map((lesson, lessonIndex) => {
                    const isCompleted = completedLessons.has(lesson._id);
                    const isSelected = selectedLesson?._id === lesson._id;
                    return (
                      <button
                        key={lesson._id || lessonIndex}
                        onClick={() => setSelectedLesson(lesson)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                          isSelected
                            ? 'bg-indigo-500 text-white'
                            : 'text-indigo-300 hover:bg-white/10'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                        <span className="flex-1 text-left">{lesson.title}</span>
                        <span className="text-xs opacity-70">{lesson.duration}m</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Lesson Viewer */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
            {selectedLesson ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-4">{selectedLesson.title}</h2>
                <p className="text-indigo-200 mb-6">{selectedLesson.description}</p>

                {/* Lesson Content Based on Type */}
                <div className="bg-white/5 rounded-xl p-6 mb-6 min-h-[300px] flex items-center justify-center">
                  {selectedLesson.type === 'Video' && (
                    <div className="text-center">
                      <Play className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                      <p className="text-white">Video Player</p>
                      <p className="text-indigo-300 text-sm">URL: {selectedLesson.content}</p>
                    </div>
                  )}
                  {selectedLesson.type === 'PDF' && (
                    <div className="text-center">
                      <p className="text-white mb-2">PDF Document</p>
                      <a
                        href={selectedLesson.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        View PDF
                      </a>
                    </div>
                  )}
                  {selectedLesson.type === 'Link' && (
                    <div className="text-center">
                      <p className="text-white mb-2">External Resource</p>
                      <a
                        href={selectedLesson.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        Open Link
                      </a>
                    </div>
                  )}
                  {selectedLesson.type === 'Text' && (
                    <div className="text-left w-full">
                      <p className="text-indigo-200">{selectedLesson.content}</p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleCompleteLesson(selectedLesson._id)}
                  disabled={completedLessons.has(selectedLesson._id)}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  {completedLessons.has(selectedLesson._id) ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Mark as Complete
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center py-16">
                <Lock className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                <p className="text-white font-medium mb-2">Select a lesson to begin</p>
                <p className="text-indigo-300">Choose from the course content on the left</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
