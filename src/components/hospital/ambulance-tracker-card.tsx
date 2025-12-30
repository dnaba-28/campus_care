'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Ambulance, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AmbulanceRequest } from '@/app/hospital/page';
import { useRouter } from 'next/navigation';

type Status = 'idle' | 'dispatched' | 'arrived';

const driver = {
  name: 'Rajesh Kumar',
  phone: '123-456-7890',
  imageUrl: 'https://picsum.photos/seed/driver/100/100',
};

type AmbulanceTrackerCardProps = {
  request: AmbulanceRequest | null;
  onAmbulanceArrived: () => void;
};

export default function AmbulanceTrackerCard({ request, onAmbulanceArrived }: AmbulanceTrackerCardProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  // Effect to handle incoming requests
  useEffect(() => {
    if (request) {
      setStatus('dispatched');
    } else {
      setStatus('idle');
      setProgress(0);
    }
  }, [request]);

  // Effect to simulate ETA and arrival. This now runs only on the client.
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'dispatched') {
      timer = setTimeout(() => {
        setStatus('arrived');
      }, 5000); // 5-second simulation
    }
    return () => clearTimeout(timer);
  }, [status]);
  
  // Effect to handle progress bar animation. This also now runs only on the client.
  useEffect(() => {
    let progressTimer: NodeJS.Timeout | undefined;
    if (status === 'dispatched') {
      setProgress(0); // Start progress
      const interval = 50; // Update every 50ms
      const totalDuration = 5000;
      const increment = (interval / totalDuration) * 100;
      
      progressTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressTimer);
            return 100;
          }
          return prev + increment;
        });
      }, interval);
    } else if (status === 'idle') {
      setProgress(0);
    } else if (status === 'arrived') {
        setProgress(100);
    }
    return () => clearInterval(progressTimer);
  }, [status]);


  const handleReset = () => {
    onAmbulanceArrived();
  };

  const getStatusInfo = () => {
    switch (status) {
      case 'dispatched':
        return { text: `On the way to ${request?.destination}`, color: 'bg-red-500 text-white', eta: 'ETA: 5 Minutes' };
      case 'arrived':
        return { text: 'Ambulance Arrived!', color: 'bg-blue-500 text-white', eta: `Reached ${request?.destination}` };
      case 'idle':
      default:
        return { text: 'Parked at Hospital', color: 'bg-green-100 text-green-800', eta: 'Available on Request' };
    }
  };

  const { text, color, eta } = getStatusInfo();
  const destination = request ? request.destination : "Hostel";

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2" style={{ color: '#007bff' }}>
          <Ambulance className="w-7 h-7" />
          Ambulance Live Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Driver Profile */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border">
          <Image
            src={driver.imageUrl}
            alt={driver.name}
            width={64}
            height={64}
            className="rounded-full border-2 border-primary"
            data-ai-hint="driver portrait"
          />
          <div className="flex-1">
            <p className="font-bold text-lg text-slate-800">{driver.name}</p>
            <p className="text-sm text-slate-500">{driver.phone}</p>
          </div>
          <Button asChild variant="outline" size="icon">
            <a href={`tel:${driver.phone}`}>
              <Phone />
            </a>
          </Button>
        </div>

        {/* Live Status and Tracking */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-slate-600">Live Status:</p>
            <Badge className={cn('text-sm', color)}>{text}</Badge>
          </div>
          <div className="space-y-3">
             <div className="relative h-10 w-full rounded-full bg-slate-200 border overflow-hidden">
                 <div 
                    className="absolute top-0 h-full transition-all duration-500 ease-linear flex items-center"
                    style={{ left: `calc(${progress}% - 20px)`}}
                 >
                    <Ambulance className="w-10 h-10 text-red-600"/>
                 </div>
             </div>
            <div className="flex justify-between text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Hospital</div>
              <div className="flex items-center gap-1">{destination} <MapPin className="w-3 h-3" /></div>
            </div>
          </div>
          <div className="text-center font-semibold text-primary">{status === 'dispatched' && eta}</div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t">
          {status === 'idle' ? (
            <Button disabled className="w-full text-lg bg-slate-300" size="lg">
              <Ambulance className="mr-2" /> Request via Form
            </Button>
          ) : (
            <Button onClick={handleReset} variant="outline" className="w-full text-lg" size="lg">
              {status === 'arrived' ? 'Acknowledge & Reset' : 'Cancel Request'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
