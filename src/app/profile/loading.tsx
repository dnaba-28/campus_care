'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, User } from 'lucide-react';

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-[#E6DBC9] font-sans pb-10">
      {/* Header Skeleton */}
      <header className="bg-[#582C42] h-16 flex items-center px-4 shadow-md sticky top-0 z-30">
        <ArrowLeft size={24} className="text-white/50" />
        <Skeleton className="h-7 w-32 bg-white/20 mx-auto" />
      </header>

      <main className="flex flex-col items-center px-4 mt-8">
        {/* Avatar Skeleton */}
        <div className="w-32 h-32 bg-[#E27D7A] rounded-full flex items-center justify-center border-[6px] border-[#E6DBC9] z-20 -mb-16 shadow-lg relative">
          <User size={64} color="white" className="opacity-50"/>
        </div>

        {/* Card Skeleton */}
        <div className="bg-[#0B1E47] w-full max-w-sm rounded-[2.5rem] pt-24 pb-12 px-6 shadow-2xl relative z-10">
          <div className="space-y-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="w-12 h-12 rounded-full bg-white/20" />
                <Skeleton className="h-6 flex-1 bg-white/20" />
              </div>
            ))}
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="w-full max-w-sm mt-8">
            <Skeleton className="w-full h-14 rounded-full bg-red-600/50" />
        </div>
      </main>
    </div>
  );
}
