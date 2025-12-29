'use client';

import { useMemo } from 'react';
import Navbar from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { AlertTriangle, Flame, Stethoscope, Shield, Car, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';

type SosReport = {
  id: string;
  userDetails: {
    name: string;
    enrollmentNo: string;
    hostelName: string;
    roomNo: string;
    blockNo: string;
  };
  emergencyType: 'FIRE' | 'HEALTH' | 'SAFETY' | 'ACCIDENT';
  timestamp: string;
};

const emergencyDetails = {
    FIRE: { icon: Flame, color: 'text-red-500', label: 'Fire' },
    HEALTH: { icon: Stethoscope, color: 'text-blue-500', label: 'Health' },
    SAFETY: { icon: Shield, color: 'text-yellow-500', label: 'Safety' },
    ACCIDENT: { icon: Car, color: 'text-gray-700', label: 'Accident' },
};

export default function AdminPage() {
  const firestore = useFirestore();
  
  const sosReportsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'sos-reports'), orderBy('timestamp', 'desc'));
  }, [firestore]);

  const { data: sosReports, isLoading } = useCollection<SosReport>(sosReportsQuery);

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-100">
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-6xl">
          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <AlertTriangle className="text-destructive" />
                Live SOS Alerts
              </CardTitle>
              <CardDescription>Real-time emergency reports from across campus.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="ml-4 text-lg text-muted-foreground">Loading Live Reports...</p>
                    </div>
                )}
                {!isLoading && (!sosReports || sosReports.length === 0) && (
                     <div className="text-center py-10">
                        <p className="text-lg text-muted-foreground">No SOS reports found.</p>
                    </div>
                )}
               {!isLoading && sosReports && sosReports.length > 0 && (
                 <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Enrollment No.</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sosReports.map((report) => {
                         const details = emergencyDetails[report.emergencyType];
                         const Icon = details.icon;
                        return (
                            <TableRow key={report.id}>
                                <TableCell>
                                    <Badge variant="outline" className={`font-semibold ${details.color} border-current`}>
                                        <Icon className="w-4 h-4 mr-2" />
                                        {details.label}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-medium">{report.userDetails.name}</TableCell>
                                <TableCell>{report.userDetails.enrollmentNo}</TableCell>
                                <TableCell>{`${report.userDetails.hostelName}, Block ${report.userDetails.blockNo}, Room ${report.userDetails.roomNo}`}</TableCell>
                                <TableCell className="text-right">{format(new Date(report.timestamp), 'PPpp')}</TableCell>
                            </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
               )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
