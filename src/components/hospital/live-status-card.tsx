'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  status: 'Available' | 'On Break' | 'Busy';
};

export default function LiveStatusCard() {
  const firestore = useFirestore();

  const doctorsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'doctors') : null),
    [firestore]
  );
  
  const { data: doctors, isLoading } = useCollection<Doctor>(doctorsCollection);

  const getStatusBadge = (status: Doctor['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'On Break':
        return 'bg-yellow-100 text-yellow-800';
      case 'Busy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  }

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle
          className="text-2xl font-bold"
          style={{ color: '#007bff' }}
        >
          Live Hospital Status
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-around gap-4 p-6 bg-blue-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-slate-500 font-medium">
              Current Waiting Time
            </p>
            <p className="text-5xl font-bold text-slate-800">15 Mins</p>
          </div>
          <div className="w-px bg-slate-300 h-16 hidden sm:block"></div>
          <div className="text-center">
            <p className="text-sm text-slate-500 font-medium">
              Live Queue Token
            </p>
            <p className="text-5xl font-bold text-slate-800">#42</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-3">
            Doctor Availability
          </h3>
          <div className="space-y-3 min-h-[150px]">
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
            {!isLoading && doctors && doctors.map(doctor => (
              <div
                key={doctor.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border"
              >
                <div>
                  <p className="font-semibold text-slate-800">{doctor.name}</p>
                  <p className="text-sm text-slate-500">{doctor.specialty}</p>
                </div>
                <Badge
                  variant={
                    doctor.status === 'Available' ? 'default' : 'destructive'
                  }
                  className={getStatusBadge(doctor.status)}
                >
                  {doctor.status}
                </Badge>
              </div>
            ))}
            {!isLoading && (!doctors || doctors.length === 0) && (
                 <div className="text-center p-4 text-muted-foreground">No doctors available. Check admin panel to seed data.</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
