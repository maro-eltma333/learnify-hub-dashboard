
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search, BookOpen, GraduationCap } from 'lucide-react';

const Courses = () => {
  const { courses, isLoading, enrollInCourse } = useCourses();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(
    course => course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEnroll = async (courseId: string) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/course/${courseId}` } });
      return;
    }

    if (user?.role !== 'student') {
      // Teachers and managers view course details instead
      navigate(`/course/${courseId}`);
      return;
    }

    await enrollInCourse(courseId);
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-8 animate-fade-in">
        <div className="relative bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 md:p-10 mb-10">
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Discover</span> Your Next Learning Adventure
            </h1>
            <p className="text-lg mb-6">
              Explore our wide range of courses taught by expert instructors and take your skills to the next level.
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for courses..."
                className="pl-10 bg-background/80 backdrop-blur w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="absolute right-10 bottom-0 hidden md:block">
            <BookOpen className="h-24 w-24 text-primary/20" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
        <Separator className="mb-6" />

        {isLoading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg" />
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardHeader>
                <CardFooter>
                  <div className="h-10 bg-muted rounded w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or check back later for new courses.
            </p>
            <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover-scale">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={course.coverImage} 
                    alt={course.title} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <GraduationCap className="mr-1 h-4 w-4" />
                    <span>3 students enrolled</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleEnroll(course.id)}
                  >
                    {user?.role === 'student' ? 'Enroll Now' : 'View Course'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

export default Courses;
