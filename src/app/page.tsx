'use client';

import Navbar from '@/components/layout/navbar';
import SosCard from '@/components/dashboard/sos-card';
import HospitalCard from '@/components/dashboard/hospital-card';
import CafeteriaCard from '@/components/dashboard/cafeteria-card';
import GlobalAIChatbot from '@/components/dashboard/global-ai-chatbot';
import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[450px] w-full">
          <Image
            src="https://images.collegedunia.com/public/college_data/images/appImage/1503896434cover.jpg"
            alt="NIT Agartala Campus"
            layout="fill"
            objectFit="cover"
            className="z-0"
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
            <h1 className="text-6xl font-bold">CARE-CAMPUS</h1>
            <p className="mt-2 text-xl text-gray-200">NIT Agartala • Class of '28</p>
          </div>
        </div>

        {/* Floating Grid Container */}
        <div className="relative z-10 mx-auto -mt-32 w-full max-w-6xl px-4">
          <div className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-2">
            <SosCard isModalOpen={isSosModalOpen} onOpenChange={setIsSosModalOpen} />
            <CafeteriaCard />
            <HospitalCard />
            <GlobalAIChatbot />
          </div>
        </div>
      </main>
    </div>
  );
}
