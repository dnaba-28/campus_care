'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function BookAppointmentCard() {
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
  const [reason, setReason] = useState('');
  const { toast } = useToast();

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to handle form submission would go here
    const newToken = Math.floor(Math.random() * 50) + 50; // Random token > 50
    toast({
      title: 'Appointment Confirmed!',
      description: `Your token is #${newToken}. Please be on time.`,
    });
    setAppointmentConfirmed(true);
  };

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold" style={{ color: '#007bff' }}>Get an Appointment</CardTitle>
        <Calendar className="w-5 h-5 text-slate-400" />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBooking} className="grid gap-4">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="John Doe" placeholder="Your Name" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="enrollment">Enrollment No.</Label>
            <Input id="enrollment" placeholder="e.g., 21BCE1234" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="hostel">Hostel Name</Label>
            <Input id="hostel" placeholder="e.g., Starlight Hall" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="reason">Reason for Visit</Label>
            <Select onValueChange={setReason} value={reason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fever">Fever</SelectItem>
                <SelectItem value="injury">Injury</SelectItem>
                <SelectItem value="dental">Dental</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {reason === 'other' && (
            <div className="space-y-1">
              <Label htmlFor="other-reason">Please specify your problem</Label>
              <Textarea id="other-reason" placeholder="Describe your symptoms or issue" />
            </div>
          )}
          <Button type="submit" className="w-full mt-2" style={{ backgroundColor: '#007bff' }}>
            Book Slot
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
