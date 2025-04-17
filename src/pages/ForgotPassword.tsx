
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await resetPassword(email);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center py-12 px-4 animate-fade-in">
        <Card className="w-full max-w-md shadow-lg card-hover">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
            <CardDescription>
              {!isSubmitted 
                ? "Enter your email address and we'll send you a link to reset your password" 
                : "Check your email for reset instructions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary mx-auto w-fit">
                  <Mail className="h-6 w-6" />
                </div>
                <p className="mb-4">
                  If an account exists with the email <strong>{email}</strong>, 
                  you will receive password reset instructions shortly.
                </p>
                <p className="text-sm text-muted-foreground">
                  Please check your spam folder if you don't see the email in your inbox.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link
              to="/login"
              className="text-sm text-primary flex items-center underline-offset-4 hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
};

import { Mail } from 'lucide-react';

export default ForgotPassword;
