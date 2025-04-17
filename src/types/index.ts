
export type UserRole = 'student' | 'teacher' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  teacherId: string;
  teacher?: User;
  students?: User[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseProgress {
  userId: string;
  courseId: string;
  progress: number; // 0-100
  lastAccessed?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
