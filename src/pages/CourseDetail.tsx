
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Clock, GraduationCap, User, FileText, Award } from 'lucide-react';
import { toast } from 'sonner';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { getCourse, getStudentsForCourse, enrollInCourse, getCourseProgress, updateProgress } = useCourses();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(courseId ? getCourse(courseId) : undefined);
  const [students, setStudents] = useState<any[]>([]);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!courseId) {
      navigate('/courses');
      return;
    }
    
    const courseData = getCourse(courseId);
    if (!courseData) {
      toast.error('Course not found');
      navigate('/courses');
      return;
    }
    
    setCourse(courseData);
    
    // Load students for this course
    if (user && (user.role === 'teacher' || user.role === 'manager')) {
      getStudentsForCourse(courseId).then(setStudents);
    }
    
    // Load progress if student
    if (user && user.role === 'student') {
      const userProgress = getCourseProgress(courseId, user.id);
      if (userProgress) {
        setProgress(userProgress.progress);
      }
    }
  }, [courseId, getCourse, getStudentsForCourse, getCourseProgress, user, navigate]);

  const handleEnroll = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login', { state: { from: `/course/${courseId}` } });
      return;
    }

    if (user.role !== 'student') {
      toast.info('Only students can enroll in courses');
      return;
    }

    if (!courseId) return;
    
    setIsEnrolling(true);
    try {
      await enrollInCourse(courseId);
      // After enrollment, fetch progress
      const userProgress = getCourseProgress(courseId, user.id);
      if (userProgress) {
        setProgress(userProgress.progress);
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleUpdateProgress = async (newProgress: number) => {
    if (!courseId || !user || user.role !== 'student') return;
    
    // This is just a mock implementation
    await updateProgress(courseId, newProgress);
    setProgress(newProgress);
    toast.success(`Progress updated to ${newProgress}%`);
  };

  if (!course) {
    return null; // Handled in useEffect
  }

  const isEnrolled = user?.role === 'student' && progress > 0;
  const isTeacher = user?.role === 'teacher' && course.teacherId === user.id;
  const isManager = user?.role === 'manager';

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 animate-fade-in">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-8">
          <div className="container">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-lg mb-4">{course.description}</p>
            <div className="flex items-center text-sm text-muted-foreground gap-4">
              <span className="flex items-center">
                <User className="mr-1 h-4 w-4" />
                <span>Teacher: {course.teacher?.name || 'Unknown Teacher'}</span>
              </span>
              <span className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
              </span>
              <span className="flex items-center">
                <GraduationCap className="mr-1 h-4 w-4" />
                <span>{students.length} students enrolled</span>
              </span>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Tabs defaultValue="overview">
                <TabsList className="w-full">
                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                  <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
                  {(isTeacher || isManager) && (
                    <TabsTrigger value="students" className="flex-1">Students</TabsTrigger>
                  )}
                </TabsList>
                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Overview</CardTitle>
                      <CardDescription>What you'll learn in this course</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-2">Course Description</h3>
                          <p className="text-muted-foreground">{course.description}</p>
                        </div>
                        <Separator />
                        <div>
                          <h3 className="font-medium mb-2">Key Learning Objectives</h3>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Understand the core principles of {course.title}</li>
                            <li>Apply theoretical knowledge to real-world scenarios</li>
                            <li>Develop practical skills through hands-on exercises</li>
                            <li>Master advanced techniques in this subject area</li>
                          </ul>
                        </div>
                        <Separator />
                        <div>
                          <h3 className="font-medium mb-2">Prerequisites</h3>
                          <p className="text-muted-foreground">No specific prerequisites. This course is suitable for beginners.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="content" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Content</CardTitle>
                      <CardDescription>Lessons and materials in this course</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Module 1 */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">Module 1: Introduction</h3>
                            <span className="text-xs text-muted-foreground">3 lessons</span>
                          </div>
                          <div className="space-y-2 pl-4">
                            <div className="flex items-center text-sm p-2 hover:bg-muted rounded-md cursor-pointer">
                              <FileText className="h-4 w-4 mr-2 text-primary" />
                              <span>Introduction to {course.title}</span>
                            </div>
                            <div className="flex items-center text-sm p-2 hover:bg-muted rounded-md cursor-pointer">
                              <FileText className="h-4 w-4 mr-2 text-primary" />
                              <span>Key Concepts and Terminology</span>
                            </div>
                            <div className="flex items-center text-sm p-2 hover:bg-muted rounded-md cursor-pointer">
                              <FileText className="h-4 w-4 mr-2 text-primary" />
                              <span>Setting Up Your Environment</span>
                            </div>
                          </div>
                        </div>
                        <Separator />
                        {/* Module 2 */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">Module 2: Core Principles</h3>
                            <span className="text-xs text-muted-foreground">4 lessons</span>
                          </div>
                          <div className="space-y-2 pl-4">
                            <div className="flex items-center text-sm p-2 hover:bg-muted rounded-md cursor-pointer">
                              <FileText className="h-4 w-4 mr-2 text-primary" />
                              <span>Fundamental Principles</span>
                            </div>
                            <div className="flex items-center text-sm p-2 hover:bg-muted rounded-md cursor-pointer">
                              <FileText className="h-4 w-4 mr-2 text-primary" />
                              <span>Working with Basic Examples</span>
                            </div>
                            <div className="flex items-center text-sm p-2 hover:bg-muted rounded-md cursor-pointer">
                              <FileText className="h-4 w-4 mr-2 text-primary" />
                              <span>Problem-Solving Techniques</span>
                            </div>
                            <div className="flex items-center text-sm p-2 hover:bg-muted rounded-md cursor-pointer">
                              <FileText className="h-4 w-4 mr-2 text-primary" />
                              <span>Practical Exercise</span>
                            </div>
                          </div>
                        </div>
                        <Separator />
                        {/* Module 3 */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">Module 3: Advanced Topics</h3>
                            <span className="text-xs text-muted-foreground">3 lessons</span>
                          </div>
                          <div className="space-y-2 pl-4">
                            <div className="flex items-center text-sm p-2 hover:bg-muted rounded-md cursor-pointer">
                              <FileText className="h-4 w-4 mr-2 text-primary" />
                              <span>Advanced Concepts</span>
                            </div>
                            <div className="flex items-center text-sm p-2 hover:bg-muted rounded-md cursor-pointer">
                              <FileText className="h-4 w-4 mr-2 text-primary" />
                              <span>Real-World Applications</span>
                            </div>
                            <div className="flex items-center text-sm p-2 hover:bg-muted rounded-md cursor-pointer">
                              <FileText className="h-4 w-4 mr-2 text-primary" />
                              <span>Final Project</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                {(isTeacher || isManager) && (
                  <TabsContent value="students" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Enrolled Students</CardTitle>
                        <CardDescription>Students taking this course</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {students.length === 0 ? (
                          <div className="text-center py-6">
                            <GraduationCap className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No students enrolled yet</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {students.map(student => (
                              <div key={student.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={student.profileImage} alt={student.name} />
                                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{student.name}</p>
                                    <p className="text-sm text-muted-foreground">{student.email}</p>
                                  </div>
                                </div>
                                <div className="text-sm">
                                  <p className="text-muted-foreground">Progress: 65%</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
            </div>
            <div>
              <Card className="sticky top-20">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={course.coverImage} 
                    alt={course.title} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Course Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEnrolled && (
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Your progress</span>
                        <span className="text-sm font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>10 lessons</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>5 hours of content</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Award className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Certificate on completion</span>
                    </div>
                  </div>

                  {user?.role === 'student' && (
                    isEnrolled ? (
                      <div className="space-y-3">
                        <Button className="w-full" onClick={() => navigate(`/course/${courseId}/learn`)}>
                          Continue Learning
                        </Button>
                        {/* Mock update progress buttons */}
                        <div className="grid grid-cols-3 gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleUpdateProgress(25)}
                            disabled={progress >= 25}
                          >
                            25%
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleUpdateProgress(50)}
                            disabled={progress >= 50}
                          >
                            50%
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleUpdateProgress(100)}
                            disabled={progress >= 100}
                          >
                            100%
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button className="w-full" onClick={handleEnroll} disabled={isEnrolling}>
                        {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                      </Button>
                    )
                  )}

                  {isTeacher && (
                    <Button className="w-full" onClick={() => navigate(`/dashboard/edit-course/${courseId}`)}>
                      Edit Course
                    </Button>
                  )}

                  {isManager && (
                    <div className="space-y-2">
                      <Button className="w-full" onClick={() => navigate(`/dashboard/edit-course/${courseId}`)}>
                        Edit Course
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => navigate(`/dashboard/all-courses`)}>
                        Back to All Courses
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default CourseDetail;
