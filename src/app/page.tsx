'use client';

import Navbar from '@/components/layout/navbar';
import SosCard from '@/components/dashboard/sos-card';
import HospitalCard from '@/components/dashboard/hospital-card';
import CafeteriaCard from '@/components/dashboard/cafeteria-card';
import GlobalAIChatbot from '@/components/dashboard/global-ai-chatbot';
import { useState } from 'react';

export default function Home() {
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-6xl">
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
