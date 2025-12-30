'use client';

import { usePathname, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function GlobalExitButton() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render on the server or during initial client hydration
  if (!isMounted) {
    return null;
  }

  // Once mounted, check the pathname to decide if the button should be visible
  if (pathname === '/') {
    return null;
  }

  return (
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
  );
}
