'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Ambulance, Phone } from 'lucide-react';

const doctors = [
  { name: 'Dr. Sharma', specialty: 'General', status: 'Available' as const },
  { name: 'Dr. Roy', specialty: 'Dentist', status: 'On Break' as const },
  { name: 'Dr. Patel', specialty: 'Ortho', status: 'Available' as const },
];

const ambulanceStatus = {
    status: 'Parked at Hospital' as const,
    driver: 'Mr. Singh'
}

export default function LiveStatusCard() {
  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold" style={{ color: '#007bff' }}>Live Hospital Status</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-around gap-4 p-6 bg-blue-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-slate-500 font-medium">Current Waiting Time</p>
            <p className="text-5xl font-bold text-slate-800">15 Mins</p>
          </div>
          <div className="w-px bg-slate-300 h-16 hidden sm:block"></div>
          <div className="text-center">
            <p className="text-sm text-slate-500 font-medium">Live Queue Token</p>
            <p className="text-5xl font-bold text-slate-800">#42</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-3">Doctor Availability</h3>
              <div className="space-y-3">
                {doctors.map((doctor) => (
                  <div key={doctor.name} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div>
                      <p className="font-semibold text-slate-800">{doctor.name}</p>
                      <p className="text-sm text-slate-500">{doctor.specialty}</p>
                    </div>
                    <Badge variant={doctor.status === 'Available' ? 'default' : 'destructive'}
                      className={doctor.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    >
                      {doctor.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
                 <h3 className="text-lg font-semibold text-slate-700 mb-3">Ambulance Tracker</h3>
                 <div className="p-4 bg-white rounded-lg border flex flex-col items-center justify-center text-center h-full">
                    <Ambulance className="w-12 h-12 text-blue-500 mb-2"/>
                    <p className="font-semibold text-slate-800">Ambulance Status</p>
                    <Badge className={ambulanceStatus.status === 'Parked at Hospital' ? 'bg-green-100 text-green-800 my-2' : 'bg-red-100 text-red-800 my-2'}>
                        {ambulanceStatus.status}
                    </Badge>
                     <Button className="mt-4 w-full" variant="outline">
                        <Phone className="mr-2 h-4 w-4" />
                        Call Driver
                    </Button>
                </div>
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
