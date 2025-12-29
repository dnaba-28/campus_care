
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, User, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getAuth, onAuthStateChanged, AuthError } from 'firebase/auth';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';

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

    const unsubscribe = onAuthStateChanged(auth, (user, error) => {
      unsubscribe();
      setIsLoading(false);

      if (user) {
        toast({
          title: `Successfully ${action === 'signIn' ? 'signed in' : 'signed up'}!`,
          description: `Welcome! Redirecting you now...`,
        });
        router.push('/');
      } else {
        const authError = error as AuthError | undefined;
        let errorMessage = 'An unexpected error occurred. Please try again.';
        if (authError) {
            switch (authError.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
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
    <div className="flex min-h-screen flex-col bg-[#E8DCCA]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-[#5D2E46] px-4 shadow-md">
        <Link href="/" aria-label="Go back to homepage">
          <ArrowLeft className="h-6 w-6 text-white" />
        </Link>
        <h1 className="text-xl font-bold text-white">Student Login</h1>
        <div className="w-6"></div> {/* Spacer to balance the title */}
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center pt-16">
        <div className="relative mb-[-64px] z-10 flex h-32 w-32 items-center justify-center rounded-full bg-[#E07A7A]">
          <User className="h-20 w-20 text-white" />
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md rounded-3xl bg-[#0F2557] p-8 pt-24 shadow-2xl">
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-4 border-b border-white/30 pb-2">
                      <User className="h-5 w-5 text-white" />
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email Address"
                          className="flex-1 border-none bg-transparent text-lg text-white placeholder-white/70 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="pt-2 text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-4 border-b border-white/30 pb-2">
                      <Lock className="h-5 w-5 text-white" />
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          className="flex-1 border-none bg-transparent text-lg text-white placeholder-white/70 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                    </div>
                     <FormMessage className="pt-2 text-red-400" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex w-full max-w-md justify-center gap-4">
          <Button
            onClick={form.handleSubmit((data) => handleAuthAction('signIn', data))}
            disabled={isLoading}
            className="rounded-full bg-[#0F2557] px-10 py-6 text-lg text-white shadow-lg hover:bg-opacity-90"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Login'}
          </Button>
          <Button
            onClick={form.handleSubmit((data) => handleAuthAction('signUp', data))}
            disabled={isLoading}
            className="rounded-full bg-[#0F2557] px-10 py-6 text-lg text-white shadow-lg hover:bg-opacity-90"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Register'}
          </Button>
        </div>
      </main>
    </div>
  );
}
