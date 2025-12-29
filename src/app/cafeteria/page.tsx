'use client';

import Navbar from '@/components/layout/navbar';
import FeedbackCard from '@/components/cafeteria/feedback-card';

export default function CafeteriaPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto grid w-full max-w-2xl items-start gap-6">
          <FeedbackCard />
        </div>
      </main>
    </div>
  );
}