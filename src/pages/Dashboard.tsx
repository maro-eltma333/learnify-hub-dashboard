
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Users, Plus, User } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { userCourses, courses, courseProgress } = useCourses();
  const navigate = useNavigate();

  // Filter progress data for the current user
  const userProgress = user ? courseProgress.filter(p => p.userId === user.id) : [];

  // Calculate completion percentage
  const calculateCompletion = () => {
    if (!user || user.role !== 'student' || userProgress.length === 0) return 0;
    
    const totalProgress = userProgress.reduce((sum, p) => sum + p.progress, 0);
    return Math.round(totalProgress / userProgress.length);
  };

  const renderStudentDashboard = () => (
    <>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCourses.length}</div>
            <p className="text-xs text-muted-foreground">
              {userCourses.length === 0 ? 'No courses yet' : 'Courses in progress'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateCompletion()}%</div>
            <Progress value={calculateCompletion()} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">My Courses</h3>
          <Button variant="outline" size="sm" onClick={() => navigate('/courses')}>
            Explore Courses
          </Button>
        </div>
        <Separator className="my-4" />
        
        {userCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 border rounded-lg bg-muted/20">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="text-xl font-medium mb-2">No courses yet</h4>
            <p className="text-muted-foreground mb-4">Enroll in courses to start learning</p>
            <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {userCourses.map(course => {
              const progress = userProgress.find(p => p.courseId === course.id)?.progress || 0;
              return (
                <Card key={course.id} className="overflow-hidden card-hover">
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={course.coverImage} 
                      alt={course.title} 
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <Button 
                      className="w-full mt-4" 
                      onClick={() => navigate(`/course/${course.id}`)}
                    >
                      Continue Learning
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );

  const renderTeacherDashboard = () => (
    <>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCourses.length}</div>
            <p className="text-xs text-muted-foreground">
              {userCourses.length === 1 ? 'Course created' : 'Courses created'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Enrolled in your courses</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Manage Your Courses</h3>
          <Button onClick={() => navigate('/dashboard/create-course')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </div>
        <Separator className="my-4" />
        
        {userCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 border rounded-lg bg-muted/20">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="text-xl font-medium mb-2">No courses yet</h4>
            <p className="text-muted-foreground mb-4">Create your first course to get started</p>
            <Button onClick={() => navigate('/dashboard/create-course')}>Create Course</Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {userCourses.map(course => (
              <Card key={course.id} className="overflow-hidden card-hover">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={course.coverImage} 
                    alt={course.title} 
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center text-sm mb-4">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>3 Students</span>
                    </span>
                    <span className="text-muted-foreground">Created {new Date(course.createdAt).toLocaleDateString()}</span>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate(`/dashboard/edit-course/${course.id}`)}
                  >
                    Manage Course
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderManagerDashboard = () => (
    <>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              {courses.length === 1 ? 'Course available' : 'Courses available'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">Active users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Active teachers</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium">Platform Overview</h3>
        <Separator className="my-4" />
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Courses</CardTitle>
              <CardDescription>Newly added courses on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.slice(0, 5).map(course => (
                  <div key={course.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={course.coverImage} 
                        alt={course.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{course.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        Added on {new Date(course.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => navigate(`/course/${course.id}`)}>
                      View
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="link" className="mt-4 p-0" onClick={() => navigate('/dashboard/all-courses')}>
                View all courses
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>System Statistics</CardTitle>
              <CardDescription>Overview of the platform performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">New users this month</span>
                  <span className="font-medium">8</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">New courses this month</span>
                  <span className="font-medium">3</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average course completion</span>
                  <span className="font-medium">67%</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active sessions this week</span>
                  <span className="font-medium">42</span>
                </div>
              </div>
              <Button variant="link" className="mt-4 p-0" onClick={() => navigate('/dashboard/settings')}>
                View system settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );

  const renderDashboardContent = () => {
    if (!user) return null;

    switch (user.role) {
      case 'student':
        return renderStudentDashboard();
      case 'teacher':
        return renderTeacherDashboard();
      case 'manager':
        return renderManagerDashboard();
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's an overview of your {user?.role} dashboard.
          </p>
        </div>
        <Separator />
        {renderDashboardContent()}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
