import Navbar from '@/components/layout/navbar';
import SosCard from '@/components/dashboard/sos-card';
import HospitalCard from '@/components/dashboard/hospital-card';
import CafeteriaCard from '@/components/dashboard/cafeteria-card';
import SosAnalyzerCard from '@/components/dashboard/sos-analyzer-card';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid gap-6">
            <SosCard />
            <HospitalCard />
          </div>
          <div className="grid gap-6">
            <CafeteriaCard />
          </div>
          <div className="grid gap-6">
            <SosAnalyzerCard />
          </div>
        </div>
      </main>
    </div>
  );
}
