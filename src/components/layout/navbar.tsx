
'use client';

import Link from 'next/link';
import { HeartPulse, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useEffect, useState } from 'react';

type UserProfile = {
  name?: string;
  // other fields are not needed for this logic
};

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // This code runs only on the client-side
    const savedData = localStorage.getItem('student_profile');
    if (savedData) {
      const profile: UserProfile = JSON.parse(savedData);
      // Simple check: if the user's name is "Admin", they are an admin.
      if (profile.name === 'Admin') {
        setIsAdmin(true);
      }
    }
  }, []);

  const baseNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/chat', label: 'AI Chat' },
  ];

  const adminLink = { href: '/admin', label: 'Admin' };

  const userLink = { href: '/profile', label: 'Profile' };
  
  const authLinks = [
      { href: '/login', label: 'Login' }
  ];

  const navLinks = isAdmin 
    ? [...baseNavLinks, adminLink, userLink] 
    : [...baseNavLinks, userLink];
    
  const allMobileLinks = isAdmin
    ? [...baseNavLinks, adminLink, userLink, ...authLinks]
    : [...baseNavLinks, userLink, ...authLinks];


  return (
    <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 z-50">
      {/* Left side of Navbar */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <HeartPulse className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold hidden sm:inline-block">CARE-CAMPUS</span>
        </Link>
        <nav className="hidden md:flex md:items-center md:gap-5 lg:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Menu & Centered Title for Small Screens */}
      <div className="flex items-center gap-4 md:hidden">
         <span className="font-headline text-xl font-bold">CARE-CAMPUS</span>
         <Sheet>
            <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
            </Button>
            </SheetTrigger>
            <SheetContent side="right">
            <nav className="grid gap-6 text-lg font-medium">
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                <HeartPulse className="h-6 w-6 text-primary" />
                <span className="sr-only">CARE-CAMPUS</span>
                </Link>
                {allMobileLinks.map((link) => (
                <Link
                    key={link.label}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground"
                >
                    {link.label}
                </Link>
                ))}
            </nav>
            </SheetContent>
        </Sheet>
      </div>


      {/* Right side of Navbar */}
      <div className="hidden md:flex items-center gap-4">
        {authLinks.map(link => (
             <Button asChild key={link.label} variant="outline">
                <Link href={link.href}>{link.label}</Link>
            </Button>
        ))}
      </div>
    </header>
  );
}
