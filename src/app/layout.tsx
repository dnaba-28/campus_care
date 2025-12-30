import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';
import { PT_Sans, Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import GlobalExitButton from '@/components/layout/global-exit-button';

export const metadata: Metadata = {
  title: 'CareCampus',
  description: 'Campus Safety Dashboard',
};

const fontPoppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '600', '700'],
});

const fontPTSans = PT_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pt-sans',
  weight: ['400', '700'],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-body antialiased", fontPoppins.variable, fontPTSans.variable)}>
        <FirebaseClientProvider>
          <GlobalExitButton />
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
