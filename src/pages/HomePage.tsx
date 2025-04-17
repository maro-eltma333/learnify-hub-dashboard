
import { useNavigate } from 'react-router-dom';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCourses } from '@/contexts/CourseContext';
import { BookOpen, GraduationCap, Users, Award, ArrowRight, CheckCircle } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { courses } = useCourses();
  
  // Show only featured courses on the homepage
  const featuredCourses = courses.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none animate-fade-in">
                  Welcome to <span className="gradient-text">LearnifyHub</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  Unlock your potential with our expert-led courses. Learn at your own pace and achieve your goals.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 min-[400px]:gap-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <Button size="lg" onClick={() => navigate('/courses')}>
                  Explore Courses
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/signup')}>
                  Join Now
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        </section>
        
        {/* Features Section */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Why Choose LearnifyHub</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Features Designed For Learning
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Our platform provides everything you need to succeed in your learning journey.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-screen-lg items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover-scale">
                <CardHeader>
                  <BookOpen className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Diverse Course Library</CardTitle>
                  <CardDescription>Access a wide range of courses across multiple disciplines.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    From programming to design, business to science, we have courses to match your interests and career goals.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-scale">
                <CardHeader>
                  <GraduationCap className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Expert Instructors</CardTitle>
                  <CardDescription>Learn from industry experts and experienced educators.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Our instructors bring real-world experience to the classroom, ensuring you learn practical, applicable skills.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-scale">
                <CardHeader>
                  <Users className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Collaborative Learning</CardTitle>
                  <CardDescription>Connect with fellow students and instructors.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Engage in discussions, share insights, and learn from your peers to enhance your educational experience.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-scale">
                <CardHeader>
                  <Award className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Certificates</CardTitle>
                  <CardDescription>Earn certificates upon course completion.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Showcase your achievements with verified certificates that validate your newly acquired skills.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-scale md:col-span-2 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Role-Based Learning Experience</CardTitle>
                  <CardDescription>Our platform is designed for different user roles.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                        For Students
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Track progress, access courses, and connect with instructors in a personalized learning environment.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                        For Teachers
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Create and manage courses, track student progress, and engage with your audience effectively.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Featured Courses Section */}
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Featured Courses</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Discover our most popular courses and start your learning journey today.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-screen-lg gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover-scale">
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={course.coverImage} 
                      alt={course.title} 
                      className="h-full w-full object-cover transition-transform hover:scale-105"
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
                      onClick={() => navigate(`/course/${course.id}`)}
                    >
                      View Course
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                className="gap-1"
                onClick={() => navigate('/courses')}
              >
                View All Courses <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 md:py-20 bg-gradient-to-br from-accent/20 via-background to-primary/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Start Learning?</h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                  Join thousands of learners and start your journey with LearnifyHub today.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => navigate('/signup')}>
                  Sign Up Now
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                  Log In
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default HomePage;
