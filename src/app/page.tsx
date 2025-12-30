'use client';

import { useState, Suspense } from 'react';
import Navbar from '@/components/layout/navbar';
import SosCard from '@/components/dashboard/sos-card';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import React from 'react';

// Dynamically import non-critical components
const HospitalCard = React.lazy(() => import('@/components/dashboard/hospital-card'));
const CafeteriaCard = React.lazy(() => import('@/components/dashboard/cafeteria-card'));
const GlobalAIChatbot = React.lazy(() => import('@/components/dashboard/global-ai-chatbot'));

const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full min-h-[200px] bg-slate-100 rounded-2xl">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
);


export default function Home() {
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-100 pb-12">
        {/* Hero Section */}
        <div className="relative h-[500px] w-full">
          <Image
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="NIT Agartala Campus"
            fill
            priority={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="z-0 object-cover"
            data-ai-hint="university campus"
          />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-t from-gray-900 to-transparent text-center text-white">
            <h1 className="text-6xl font-extrabold">CARE-CAMPUS</h1>
            <p className="mt-2 text-xl text-gray-300">NIT Agartala • Student Safety Hub</p>
          </div>
        </div>

        {/* Floating Grid Container */}
        <div className="relative z-10 -mt-32">
          <div className="mx-auto w-full max-w-6xl px-4">
             <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
              <SosCard isModalOpen={isSosModalOpen} onOpenChange={setIsSosModalOpen} />
              <Suspense fallback={<LoadingSpinner />}>
                  <HospitalCard />
              </Suspense>
              <Suspense fallback={<LoadingSpinner />}>
                  <CafeteriaCard />
              </Suspense>
               <Suspense fallback={<LoadingSpinner />}>
                  <GlobalAIChatbot />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
