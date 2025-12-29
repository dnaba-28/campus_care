import Navbar from '@/components/layout/navbar';
import LiveStatusCard from '@/components/hospital/live-status-card';
import BookAppointmentCard from '@/components/hospital/book-appointment-card';
import FeedbackCard from '@/components/hospital/feedback-card';

export default function HospitalPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto grid w-full max-w-7xl items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LiveStatusCard />
          </div>
          <div className="grid gap-6">
            <BookAppointmentCard />
            <FeedbackCard />
          </div>
        </div>
      </main>
    </div>
  );
}
