'use client';

import { useState }from 'react';
import Navbar from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const initialDoctors = [
    { name: 'Dr. Anya Sharma', specialty: 'General Physician', status: 'Available' },
    { name: 'Dr. Vikram Roy', specialty: 'Dentist', status: 'On Break' },
    { name: 'Dr. Priya Patel', specialty: 'Cardiologist', status: 'Busy' },
    { name: 'Dr. Rohan Joshi', specialty: 'Orthopedics', status: 'Available' },
    { name: 'Dr. Meera Desai', specialty: 'Pediatrician', status: 'Busy' },
];

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSeedData = async () => {
    if (!firestore) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Firestore is not available.",
        });
        return;
    }
    setIsLoading(true);
    try {
        const batch = writeBatch(firestore);
        const doctorsCollection = collection(firestore, 'doctors');

        initialDoctors.forEach(doctor => {
            const docRef = doc(doctorsCollection);
            batch.set(docRef, doctor);
        });

        await batch.commit();

        toast({
            title: "Success!",
            description: "Initial doctor data has been seeded.",
        });
    } catch (error) {
        console.error("Error seeding data:", error);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Could not seed doctor data.",
        });
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Admin Panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Use this panel to manage application data.</p>
              <div>
                <h3 className="font-semibold text-lg mb-2">Seed Initial Data</h3>
                <p className="text-sm text-muted-foreground mb-4">Click the button below to populate the 'doctors' collection in Firestore with initial data. This is useful for development and testing.</p>
                <Button onClick={handleSeedData} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Seeding...
                        </>
                    ) : (
                        "Seed Doctor Data"
                    )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
