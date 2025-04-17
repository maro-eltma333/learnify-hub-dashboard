
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Course, CourseProgress, User } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

// Mock course data
const MOCK_COURSES: Course[] = [
  {
    id: 'course1',
    title: 'Introduction to React',
    description: 'Learn the fundamentals of React including components, state, and hooks.',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80',
    teacherId: '2',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'course2',
    title: 'Advanced JavaScript Patterns',
    description: 'Dive deep into JavaScript patterns like closures, prototypes, and async programming.',
    coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-1.2.1&auto=format&fit=crop&w=1374&q=80',
    teacherId: '2',
    createdAt: '2023-02-01T00:00:00Z',
    updatedAt: '2023-02-10T00:00:00Z',
  },
  {
    id: 'course3',
    title: 'UI/UX Design Principles',
    description: 'Master the principles of effective user interface and experience design.',
    coverImage: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1471&q=80',
    teacherId: '2',
    createdAt: '2023-03-01T00:00:00Z',
    updatedAt: '2023-03-15T00:00:00Z',
  }
];

// Mock course progress data
const MOCK_PROGRESS: CourseProgress[] = [
  { userId: '1', courseId: 'course1', progress: 75, lastAccessed: '2023-04-10T14:30:00Z' },
  { userId: '1', courseId: 'course2', progress: 30, lastAccessed: '2023-04-12T16:45:00Z' },
  { userId: '2', courseId: 'course1', progress: 100, lastAccessed: '2023-04-05T10:15:00Z' },
];

// Mock enrolled students
const MOCK_ENROLLMENTS = [
  { courseId: 'course1', studentIds: ['1'] },
  { courseId: 'course2', studentIds: ['1'] },
  { courseId: 'course3', studentIds: [] },
];

interface CourseContextType {
  courses: Course[];
  isLoading: boolean;
  userCourses: Course[];
  courseProgress: CourseProgress[];
  getCourse: (id: string) => Course | undefined;
  getStudentsForCourse: (courseId: string) => Promise<User[]>;
  getCourseProgress: (courseId: string, userId: string) => CourseProgress | undefined;
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'teacherId'>) => Promise<boolean>;
  updateCourse: (id: string, data: Partial<Course>) => Promise<boolean>;
  deleteCourse: (id: string) => Promise<boolean>;
  enrollInCourse: (courseId: string) => Promise<boolean>;
  updateProgress: (courseId: string, progress: number) => Promise<boolean>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [enrollments, setEnrollments] = useState(MOCK_ENROLLMENTS);

  useEffect(() => {
    // Load mock data
    setCourses(MOCK_COURSES);
    setCourseProgress(MOCK_PROGRESS);
    setIsLoading(false);
  }, []);

  // Filter courses based on user role
  const userCourses = user
    ? user.role === 'student'
      ? courses.filter(course => 
          enrollments.find(e => e.courseId === course.id)?.studentIds.includes(user.id)
        )
      : user.role === 'teacher'
        ? courses.filter(course => course.teacherId === user.id)
        : courses // Manager sees all courses
    : [];

  // Get a single course by ID
  const getCourse = (id: string) => courses.find(course => course.id === id);

  // Get students enrolled in a course
  const getStudentsForCourse = async (courseId: string): Promise<User[]> => {
    // Mock data - in real app would fetch from database
    const enrollment = enrollments.find(e => e.courseId === courseId);
    if (!enrollment) return [];
    
    // Mock student data
    const students: User[] = enrollment.studentIds.map(id => ({
      id,
      name: `Student ${id}`,
      email: `student${id}@example.com`,
      role: 'student',
      profileImage: `https://ui-avatars.com/api/?name=Student+${id}&background=6366f1&color=fff`
    }));

    return students;
  };

  // Get progress for a specific course and user
  const getCourseProgress = (courseId: string, userId: string) => 
    courseProgress.find(p => p.courseId === courseId && p.userId === userId);

  // Add a new course
  const addCourse = async (
    course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'teacherId'>
  ): Promise<boolean> => {
    try {
      if (!user) {
        toast.error('You must be logged in to add a course');
        return false;
      }

      if (user.role !== 'teacher' && user.role !== 'manager') {
        toast.error('Only teachers and managers can add courses');
        return false;
      }

      const newCourse: Course = {
        ...course,
        id: `course_${Date.now()}`,
        teacherId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCourses(prev => [...prev, newCourse]);
      setEnrollments(prev => [...prev, { courseId: newCourse.id, studentIds: [] }]);
      
      toast.success('Course added successfully');
      return true;
    } catch (error) {
      console.error('Add course error:', error);
      toast.error('Failed to add course');
      return false;
    }
  };

  // Update an existing course
  const updateCourse = async (id: string, data: Partial<Course>): Promise<boolean> => {
    try {
      const courseIndex = courses.findIndex(c => c.id === id);
      if (courseIndex === -1) {
        toast.error('Course not found');
        return false;
      }

      if (!user) {
        toast.error('You must be logged in to update a course');
        return false;
      }

      const course = courses[courseIndex];
      
      // Only the teacher who created the course or a manager can update it
      if (user.role !== 'manager' && course.teacherId !== user.id) {
        toast.error('You do not have permission to update this course');
        return false;
      }

      const updatedCourse = {
        ...course,
        ...data,
        updatedAt: new Date().toISOString()
      };

      const newCourses = [...courses];
      newCourses[courseIndex] = updatedCourse;
      setCourses(newCourses);
      
      toast.success('Course updated successfully');
      return true;
    } catch (error) {
      console.error('Update course error:', error);
      toast.error('Failed to update course');
      return false;
    }
  };

  // Delete a course
  const deleteCourse = async (id: string): Promise<boolean> => {
    try {
      const courseIndex = courses.findIndex(c => c.id === id);
      if (courseIndex === -1) {
        toast.error('Course not found');
        return false;
      }

      if (!user) {
        toast.error('You must be logged in to delete a course');
        return false;
      }

      // Only managers can delete courses
      if (user.role !== 'manager') {
        toast.error('Only managers can delete courses');
        return false;
      }

      setCourses(courses.filter(c => c.id !== id));
      setEnrollments(enrollments.filter(e => e.courseId !== id));
      setCourseProgress(courseProgress.filter(p => p.courseId !== id));
      
      toast.success('Course deleted successfully');
      return true;
    } catch (error) {
      console.error('Delete course error:', error);
      toast.error('Failed to delete course');
      return false;
    }
  };

  // Enroll a student in a course
  const enrollInCourse = async (courseId: string): Promise<boolean> => {
    try {
      if (!user) {
        toast.error('You must be logged in to enroll in a course');
        return false;
      }

      if (user.role !== 'student') {
        toast.error('Only students can enroll in courses');
        return false;
      }

      const enrollmentIndex = enrollments.findIndex(e => e.courseId === courseId);
      if (enrollmentIndex === -1) {
        toast.error('Course not found');
        return false;
      }

      const enrollment = enrollments[enrollmentIndex];
      if (enrollment.studentIds.includes(user.id)) {
        toast.info('You are already enrolled in this course');
        return true;
      }

      const updatedEnrollment = {
        ...enrollment,
        studentIds: [...enrollment.studentIds, user.id]
      };

      const newEnrollments = [...enrollments];
      newEnrollments[enrollmentIndex] = updatedEnrollment;
      setEnrollments(newEnrollments);

      // Initialize progress
      setCourseProgress([
        ...courseProgress,
        { userId: user.id, courseId, progress: 0, lastAccessed: new Date().toISOString() }
      ]);
      
      toast.success('Enrolled in course successfully');
      return true;
    } catch (error) {
      console.error('Enroll in course error:', error);
      toast.error('Failed to enroll in course');
      return false;
    }
  };

  // Update a student's progress in a course
  const updateProgress = async (courseId: string, progress: number): Promise<boolean> => {
    try {
      if (!user) {
        toast.error('You must be logged in to update progress');
        return false;
      }

      if (user.role !== 'student') {
        toast.error('Only students can update course progress');
        return false;
      }

      const progressIndex = courseProgress.findIndex(
        p => p.courseId === courseId && p.userId === user.id
      );

      if (progressIndex === -1) {
        // Create new progress entry
        setCourseProgress([
          ...courseProgress,
          {
            userId: user.id,
            courseId,
            progress,
            lastAccessed: new Date().toISOString()
          }
        ]);
      } else {
        // Update existing progress
        const newProgress = [...courseProgress];
        newProgress[progressIndex] = {
          ...newProgress[progressIndex],
          progress,
          lastAccessed: new Date().toISOString()
        };
        setCourseProgress(newProgress);
      }
      
      toast.success('Progress updated');
      return true;
    } catch (error) {
      console.error('Update progress error:', error);
      toast.error('Failed to update progress');
      return false;
    }
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        isLoading,
        userCourses,
        courseProgress,
        getCourse,
        getStudentsForCourse,
        getCourseProgress,
        addCourse,
        updateCourse,
        deleteCourse,
        enrollInCourse,
        updateProgress
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};
