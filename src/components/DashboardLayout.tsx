
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Users, 
  User, 
  BarChart4, 
  Settings, 
  FileEdit, 
  GraduationCap, 
  ChevronRight,
  Home
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: Home,
      },
      {
        title: 'Profile',
        href: '/profile',
        icon: User,
      },
    ];

    if (user?.role === 'student') {
      return [
        ...commonItems,
        {
          title: 'My Courses',
          href: '/dashboard/my-courses',
          icon: BookOpen,
        },
        {
          title: 'Progress',
          href: '/dashboard/progress',
          icon: BarChart4,
        },
      ];
    } else if (user?.role === 'teacher') {
      return [
        ...commonItems,
        {
          title: 'My Courses',
          href: '/dashboard/my-courses',
          icon: BookOpen,
        },
        {
          title: 'Create Course',
          href: '/dashboard/create-course',
          icon: FileEdit,
        },
        {
          title: 'Students',
          href: '/dashboard/students',
          icon: GraduationCap,
        },
      ];
    } else if (user?.role === 'manager') {
      return [
        ...commonItems,
        {
          title: 'All Courses',
          href: '/dashboard/all-courses',
          icon: BookOpen,
        },
        {
          title: 'All Users',
          href: '/dashboard/users',
          icon: Users,
        },
        {
          title: 'Settings',
          href: '/dashboard/settings',
          icon: Settings,
        },
      ];
    }

    return commonItems;
  };

  const navItems = getNavItems();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10 py-8">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <div className="py-6 pr-6">
            <div className="rounded-lg border bg-card p-2">
              <div className="grid gap-1">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    className={cn("justify-start gap-2", isActive(item.href) && "bg-muted")}
                    onClick={() => navigate(item.href)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </aside>
        <main className="flex flex-1 flex-col overflow-hidden">
          <nav className="flex mb-6 items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link to="/dashboard" className={cn(isActive('/dashboard') ? 'text-foreground' : 'hover:text-foreground')}>
              Dashboard
            </Link>
            {location.pathname !== '/dashboard' && (
              <>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span className="text-foreground">
                  {navItems.find(item => isActive(item.href))?.title || 'Page'}
                </span>
              </>
            )}
          </nav>
          {children}
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
