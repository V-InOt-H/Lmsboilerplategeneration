import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { ArrowLeft, Play, Check, Lock, Award, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';
import { coursesAPI, certificatesAPI } from '../../../services/api';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  modules: Module[];
}

interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  _id: string;
  title: string;
  description: string;
  type: string;
  content: string;
  duration: number;
}

interface Enrollment {
  course: string;
  enrolledAt: string;
  progress: number;
  status: string;
}

interface Certificate {
  _id: string;
  certificateNumber: string;
  course?: {
    _id: string;
    title: string;
  };
  issuedDate: string;
}

// Extended User interface that includes enrolledCourses
interface UserWithEnrollments {
  _id: string;
  role: string;
  name: string;
  enrolledCourses: Enrollment[];
}

interface CourseViewerProps {
  course: Course | null;
  onBack: () => void;
  onEdit: (course: Course) => void;
}

export default function CourseViewer({ course, onBack, onEdit }: CourseViewerProps) {
  const { user, hasRole } = useAuth() as { user: UserWithEnrollments | null; hasRole: (...roles: string[]) => boolean };
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [enrollmentStatus, setEnrollmentStatus] = useState<string>('In Progress');
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [generatingCertificate, setGeneratingCertificate] = useState(false);

  useEffect(() => {
    if (user?.enrolledCourses && course) {
      const enrolled = user.enrolledCourses.find((e: Enrollment) => e.course === course._id);
      setIsEnrolled(!!enrolled);
      if (enrolled) {
        setProgress(enrolled.progress || 0);
        setEnrollmentStatus(enrolled.status || 'In Progress');
        if (enrolled.status === 'Completed') {
          checkForCertificate();
        }
      }
    }
  }, [user, course]);

  const checkForCertificate = async () => {
    if (!course) return;
    try {
      const response = await certificatesAPI.getAll();
      const cert = response.certificates?.find((c: any) => c.course?._id === course._id);
      if (cert) {
        setCertificate(cert);
      }
    } catch (err) {
      console.error('Failed to check for certificate:', err);
    }
  };

  const handleEnroll = async () => {
    if (!course) return;
    try {
      await coursesAPI.enroll(course._id);
      toast.success('Successfully enrolled in course!');
      setIsEnrolled(true);
      window.location.reload();
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to enroll');
    }
  };

  if (!course) {
    return null;
  }

  const handleCompleteLesson = async (lessonId: string) => {
    if (!course) return;
    try {
      const newCompleted = new Set(completedLessons);
      newCompleted.add(lessonId);
      setCompletedLessons(newCompleted);

      const totalLessons = course.modules?.reduce((sum: number, module: Module) => sum + (module.lessons?.length || 0), 0) || 1;
      const newProgress = Math.round((newCompleted.size / totalLessons) * 100);
      setProgress(newProgress);

      const newStatus = newProgress >= 100 ? 'Completed' : 'In Progress';
      setEnrollmentStatus(newStatus);
      await coursesAPI.updateProgress(course._id, { lessonId, progress: newProgress, status: newStatus });
      toast.success('Lesson marked as complete!');

      if (newProgress >= 100) {
        toast.success('Congratulations! You have completed this course!');
      }
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  const handleGenerateCertificate = async () => {
    if (!course) return;
    setGeneratingCertificate(true);
    try {
      const response = await certificatesAPI.generate(course._id);
      if (response.certificate) {
        setCertificate(response.certificate);
        toast.success('Certificate generated successfully!');
        window.open(`/certificates/${response.certificate.certificateNumber}`, '_blank');
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to generate certificate');
    } finally {
      setGeneratingCertificate(false);
    }
  };

  const handleViewCertificate = () => {
    if (certificate?.certificateNumber) {
      window.open(`/certificates/${certificate.certificateNumber}`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="ghost" className="text-indigo-300 hover:text-white hover:bg-white/10">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
        {hasRole('Super Admin', 'Admin', 'Trainer') && (
          <Button onClick={() => onEdit(course)} className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30">
            Edit Course
          </Button>
        )}
      </div>

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
            
            {user && user.role === 'Learner' && isEnrolled ? (
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-indigo-300">Your Progress</span>
                  <span className="text-white font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                
                {enrollmentStatus === 'Completed' && (
                  <div className="mt-4 p-4 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                    {certificate ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Award className="w-8 h-8 text-yellow-400" />
                          <div>
                            <p className="text-white font-medium">Certificate Available!</p>
                            <p className="text-indigo-300 text-sm">ID: {certificate.certificateNumber}</p>
                          </div>
                        </div>
                        <Button onClick={handleViewCertificate} className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Certificate
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={handleGenerateCertificate} disabled={generatingCertificate} className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700">
                        <Award className="w-4 h-4 mr-2" />
                        {generatingCertificate ? 'Generating...' : 'Generate Certificate'}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ) : user && user.role === 'Learner' && !isEnrolled ? (
              <Button onClick={handleEnroll} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                Enroll in Course
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4 space-y-2 sticky top-6">
            <h3 className="text-white font-bold mb-4">Course Content</h3>
            {user && user.role === 'Learner' && !isEnrolled ? (
              <div className="text-center py-8">
                <Lock className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <p className="text-indigo-300 text-sm">Enroll to view course content</p>
              </div>
            ) : (
              course.modules?.map((module, moduleIndex) => (
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
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${isSelected ? 'bg-indigo-500 text-white' : 'text-indigo-300 hover:bg-white/10'}`}
                        >
                          {isCompleted ? <Check className="w-4 h-4 text-green-400" /> : <Play className="w-4 h-4" />}
                          <span className="flex-1 text-left">{lesson.title}</span>
                          <span className="text-xs opacity-70">{lesson.duration}m</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
            {user && user.role === 'Learner' && !isEnrolled ? (
              <div className="text-center py-16">
                <Lock className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                <p className="text-white font-medium mb-2">Enroll to Access Course Content</p>
                <p className="text-indigo-300 mb-6">Enroll in this course to start learning and access all lessons.</p>
                <Button onClick={handleEnroll} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">Enroll Now</Button>
              </div>
            ) : selectedLesson ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-4">{selectedLesson.title}</h2>
                <p className="text-indigo-200 mb-6">{selectedLesson.description}</p>
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
                      <a href={selectedLesson.content} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">View PDF</a>
                    </div>
                  )}
                  {selectedLesson.type === 'Link' && (
                    <div className="text-center">
                      <p className="text-white mb-2">External Resource</p>
                      <a href={selectedLesson.content} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">Open Link</a>
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
                      <Check className="w-4 h-4 mr-2" /> Completed
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" /> Mark as Complete
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center py-16">
                <Play className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
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

