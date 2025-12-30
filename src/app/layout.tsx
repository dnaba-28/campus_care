'use client';

import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';
import { PT_Sans, Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

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

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showExitButton = isMounted && pathname !== '/';

  return (
    <>
      {showExitButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className={cn(
            'fixed top-4 right-4 z-50 h-10 w-10 rounded-full',
            'bg-black/30 backdrop-blur-sm border border-white/20 text-white',
            'hover:bg-black/50 hover:scale-110 transition-transform'
          )}
          aria-label="Go back to previous page"
        >
          <X className="h-5 w-5" />
        </Button>
      )}
      {children}
    </>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>CareCampus</title>
        <meta name="description" content="Campus Safety Dashboard" />
      </head>
      <body className={cn("font-body antialiased", fontPoppins.variable, fontPTSans.variable)}>
        <FirebaseClientProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
