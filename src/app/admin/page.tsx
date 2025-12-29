'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/navbar';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
} from '@/firebase';
import { collection, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type DoctorStatus = 'Available' | 'On Break' | 'Busy';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  status: DoctorStatus;
};

const initialDoctors: Omit<Doctor, 'id'>[] = [
    { name: 'Dr. Sharma', specialty: 'General', status: 'Available' },
    { name: 'Dr. Roy', specialty: 'Dentist', status: 'On Break' },
    { name: 'Dr. Patel', specialty: 'Ortho', status: 'Available' },
];

export default function AdminPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const doctorsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'doctors') : null),
    [firestore]
  );

  const { data: doctors, isLoading } = useCollection<Doctor>(doctorsCollection);

  const handleToggleStatus = async (doctor: Doctor) => {
    if (!firestore) return;
    setIsToggling(doctor.id);

    const newStatus: DoctorStatus =
      doctor.status === 'Available' ? 'Busy' : 'Available';
    const doctorRef = doc(firestore, 'doctors', doctor.id);

    try {
      await updateDoc(doctorRef, { status: newStatus });
      toast({
        title: 'Status Updated',
        description: `${doctor.name} is now ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update doctor status.',
      });
    } finally {
      setIsToggling(null);
    }
  };

  const handleSeedData = async () => {
    if (!firestore || !doctorsCollection) return;
    setIsSeeding(true);
    try {
        const batch = writeBatch(firestore);
        initialDoctors.forEach(doctorData => {
            const docRef = doc(doctorsCollection); // Creates a new doc with a unique ID
            batch.set(docRef, doctorData);
        });
        await batch.commit();
        toast({
            title: "Data Seeded",
            description: "Initial doctor data has been added to Firestore."
        })
    } catch (error) {
        console.error("Error seeding data:", error);
        toast({
            variant: "destructive",
            title: "Seeding Failed",
            description: "Could not seed initial doctor data."
        })
    } finally {
        setIsSeeding(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Admin Panel: Doctor Status Control</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
                {isLoading && <div className="flex justify-center items-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary"/></div>}
                
                {(!doctors || doctors.length === 0) && !isLoading && (
                    <div className="text-center p-8 border-dashed border-2 rounded-lg">
                        <p className="text-muted-foreground mb-4">No doctors found in the database.</p>
                        <Button onClick={handleSeedData} disabled={isSeeding}>
                            {isSeeding ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <RefreshCw className="w-4 h-4 mr-2"/>}
                            Seed Initial Doctor Data
                        </Button>
                    </div>
                )}

              {doctors && doctors.map(doctor => (
                <div
                  key={doctor.id}
                  className="flex items-center justify-between rounded-lg border bg-background p-4"
                >
                  <div>
                    <p className="font-bold">{doctor.name}</p>
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        doctor.status === 'Available'
                          ? 'text-green-600'
                          : 'text-red-600'
                      )}
                    >
                      {doctor.status}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleToggleStatus(doctor)}
                    disabled={isToggling === doctor.id}
                  >
                    {isToggling === doctor.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Toggle Status'
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
