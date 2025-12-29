'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/layout/navbar';
import { getAuth, onAuthStateChanged, AuthError } from 'firebase/auth';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const auth = getAuth();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleAuthAction = async (action: 'signIn' | 'signUp', data: UserFormValue) => {
    setIsLoading(true);

    const authAction = action === 'signIn' 
      ? initiateEmailSignIn 
      : initiateEmailSignUp;

    // Listen for the next auth state change to get the result of the action
    const unsubscribe = onAuthStateChanged(auth, (user, error) => {
      unsubscribe(); // Stop listening immediately after the first event
      setIsLoading(false);

      if (user) {
        toast({
          title: `Successfully ${action === 'signIn' ? 'signed in' : 'signed up'}!`,
          description: `Redirecting you to the homepage...`,
        });
        router.push('/');
      } else {
        // This 'else' block will catch AuthError from Firebase
        const authError = error as AuthError | undefined;
        let errorMessage = 'An unexpected error occurred. Please try again.';
        if (authError) {
          switch (authError.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
              errorMessage = 'Invalid email or password. Please try again.';
              break;
            case 'auth/email-already-in-use':
              errorMessage = 'An account with this email already exists. Please sign in.';
              break;
            case 'auth/invalid-email':
                errorMessage = 'Please enter a valid email address.';
                break;
            default:
              errorMessage = authError.message;
              break;
          }
        }
        toast({
          variant: 'destructive',
          title: `Authentication Failed`,
          description: errorMessage,
        });
      }
    });

    authAction(auth, data.email, data.password);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-100">
      <Navbar />
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login / Sign Up</CardTitle>
            <CardDescription>
              Enter your credentials to access your account.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form
              onSubmit={(e) => e.preventDefault()} // Prevent default form submission
              className="space-y-4"
            >
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button 
                  className="w-full" 
                  disabled={isLoading}
                  onClick={form.handleSubmit((data) => handleAuthAction('signIn', data))}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
                 <Button 
                  variant="outline" 
                  className="w-full" 
                  disabled={isLoading}
                  onClick={form.handleSubmit((data) => handleAuthAction('signUp', data))}
                >
                   {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign Up
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </main>
    </div>
  );
}
