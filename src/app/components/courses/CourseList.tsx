import { useState, useEffect } from 'react';
import { coursesAPI } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { usePermission } from '../../../hooks/usePermission';
import { BookOpen, Plus, Search, Filter, Trash2, Edit } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  status: string;
  modules: any[];
  enrolledUsers: any[];
}

interface Enrollment {
  course: string;
  enrolledAt: string;
  progress: number;
  status: string;
}

interface User {
  _id: string;
  role: string;
  enrolledCourses: Enrollment[];
}

interface CourseListProps {
  onSelectCourse: (course: Course) => void;
  onCreateCourse: () => void;
}

export default function CourseList({ onSelectCourse, onCreateCourse }: CourseListProps) {
  const { user } = useAuth() as { user: User | null };
  const { isRole } = usePermission();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  useEffect(() => {
    fetchCourses();
  }, [filter]);

  const fetchCourses = async () => {
    try {
      const query = filter !== 'all' ? { status: filter } : {};
      const response = await coursesAPI.getAll(query);
      setCourses(response.courses || []);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await coursesAPI.enroll(courseId);
      toast.success('Successfully enrolled in course!');
      fetchCourses();
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to enroll');
    }
  };

  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    
    try {
      await coursesAPI.delete(courseToDelete._id);
      toast.success('Course deleted successfully!');
      fetchCourses();
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to delete course');
    } finally {
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  const isEnrolled = (courseId: string) => {
    if (!user?.enrolledCourses) return false;
    return user.enrolledCourses.some((enrollment: Enrollment) => enrollment.course === courseId);
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-white">Loading courses...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Courses</h2>
          <p className="text-indigo-300 mt-1">Explore and enroll in courses</p>
        </div>
        {isRole('Super Admin', 'Admin', 'Trainer') && (
          <Button
            onClick={onCreateCourse}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
          <Input
            type="search"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-indigo-300"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'ghost'}
            className={filter === 'all' ? 'bg-indigo-500' : 'text-indigo-300 hover:bg-white/10'}
          >
            All
          </Button>
          <Button
            onClick={() => setFilter('Published')}
            variant={filter === 'Published' ? 'default' : 'ghost'}
            className={filter === 'Published' ? 'bg-indigo-500' : 'text-indigo-300 hover:bg-white/10'}
          >
            Published
          </Button>
          {isRole('Super Admin', 'Admin', 'Trainer') && (
            <Button
              onClick={() => setFilter('Draft')}
              variant={filter === 'Draft' ? 'default' : 'ghost'}
              className={filter === 'Draft' ? 'bg-indigo-500' : 'text-indigo-300 hover:bg-white/10'}
            >
              Draft
            </Button>
          )}
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-12 text-center">
          <BookOpen className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
          <p className="text-white font-medium mb-2">No courses found</p>
          <p className="text-indigo-300">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden hover:border-indigo-500/50 transition-all group"
            >
              {/* Course Thumbnail */}
              <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                <BookOpen className="w-16 h-16 text-white opacity-30" />
                {course.status === 'Draft' && (
                  <div className="absolute top-4 right-4 bg-yellow-500/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Draft
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-indigo-300 text-sm">{course.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    course.level === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                    course.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {course.level}
                  </span>
                </div>

                <p className="text-indigo-200 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-sm text-indigo-300 mb-4">
                  <span>{course.modules?.length || 0} modules</span>
                  <span>{course.duration || 0} mins</span>
                  <span>{course.enrolledUsers?.length || 0} enrolled</span>
                </div>

                {user?.role === 'Learner' && !isEnrolled(course._id) ? (
                  <Button
                    onClick={() => handleEnroll(course._id)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    Enroll Now
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onSelectCourse(course)}
                      className="flex-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30"
                    >
                      View Course
                    </Button>
                    {isRole('Super Admin', 'Admin', 'Trainer') && (
                      <Button
                        onClick={() => handleDeleteClick(course)}
                        variant="destructive"
                        size="icon"
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-900 border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Course</AlertDialogTitle>
            <AlertDialogDescription className="text-indigo-300">
              Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone and all enrolled users will lose access to this course.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete Course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
