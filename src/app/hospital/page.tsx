'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/navbar';
import LiveStatusCard from '@/components/hospital/live-status-card';
import BookAppointmentCard from '@/components/hospital/book-appointment-card';
import FeedbackCard from '@/components/hospital/feedback-card';
import AmbulanceTrackerCard from '@/components/hospital/ambulance-tracker-card';
import AdminLoading from '../admin/loading';

export type AmbulanceRequest = {
  destination: string;
};

export default function HospitalPage() {
  const [ambulanceRequest, setAmbulanceRequest] = useState<AmbulanceRequest | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const mode = searchParams.get('mode');
      if (mode === 'ambulance') {
        setAmbulanceRequest({ destination: 'Emergency Location' });
      }
    }
  }, [isMounted, searchParams]);

  const handleAmbulanceArrived = () => {
    setAmbulanceRequest(null);
    router.replace('/hospital');
  };

  if (!isMounted) {
    return <AdminLoading />; // Or a custom loading component for the hospital
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto grid w-full max-w-7xl items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LiveStatusCard />
            <div className="mt-6">
              <AmbulanceTrackerCard
                request={ambulanceRequest}
                onAmbulanceArrived={handleAmbulanceArrived}
              />
            </div>
          </div>
          <div className="grid gap-6">
            <BookAppointmentCard onAmbulanceRequest={setAmbulanceRequest} />
            <FeedbackCard />
          </div>
        </div>
      </main>
    </div>
  );
}
