'use client';

import { useState, useEffect } from 'react';
import { useInterval } from '@/hooks/use-interval';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Ticket, Bell, Ambulance } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { AmbulanceRequest } from '@/app/hospital/page';

const LIVE_QUEUE_START_OFFSET = 5;
const NOTIFICATION_THRESHOLD = 2;
const QUEUE_UPDATE_INTERVAL = 3000; // 3 seconds

type BookAppointmentCardProps = {
  onAmbulanceRequest: (request: AmbulanceRequest) => void;
};

export default function BookAppointmentCard({ onAmbulanceRequest }: BookAppointmentCardProps) {
  const [view, setView] = useState<'form' | 'ticket'>('form');
  const [reason, setReason] = useState('');
  const [userToken, setUserToken] = useState<number | null>(null);
  const [servingToken, setServingToken] = useState<number | null>(null);
  const [notificationSent, setNotificationSent] = useState(false);
  const [needsAmbulance, setNeedsAmbulance] = useState(false);
  
  const [hostelName, setHostelName] = useState('');

  const { toast } = useToast();

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newToken = Math.floor(Math.random() * 50) + 10; // Random token
    const startToken = newToken - LIVE_QUEUE_START_OFFSET;

    setUserToken(newToken);
    setServingToken(startToken);
    setView('ticket');
    setNotificationSent(false);

    if (needsAmbulance) {
      onAmbulanceRequest({ destination: hostelName || 'hostel' });
      // 
      toast({
        title: "Ambulance Request Sent!",
        description: "Emergency services have been notified."
      })
    } else {
      toast({
        title: 'Appointment Confirmed!',
        description: `Your token is #${newToken}. Please monitor the live queue.`,
      });
    }
  };

  useInterval(() => {
    if (view === 'ticket' && servingToken !== null && userToken !== null && servingToken < userToken) {
        const newServingToken = servingToken + 1;
        setServingToken(newServingToken);

        if (userToken - newServingToken === NOTIFICATION_THRESHOLD && !notificationSent && !needsAmbulance) {
            toast({
                title: (
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        <span className="font-bold">Your Turn is Soon!</span>
                    </div>
                ),
                description: "It's almost your turn! Please start walking to the hospital.",
            });
            setNotificationSent(true);
        }
    }
  }, QUEUE_UPDATE_INTERVAL);
  
  const handleBookAnother = () => {
    setView('form');
    setUserToken(null);
    setServingToken(null);
    setReason('');
    setNeedsAmbulance(false);
    setHostelName('');
  }

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold" style={{ color: '#007bff' }}>
          {view === 'form' ? 'Get an Appointment' : 'Live Token Ticket'}
        </CardTitle>
        {view === 'form' ? <Calendar className="w-5 h-5 text-slate-400" /> : <Ticket className="w-5 h-5 text-slate-400" />}
      </CardHeader>
      <CardContent>
        {view === 'form' ? (
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
            
            {/* Ambulance Toggle */}
            <div className="mt-4 p-4 border rounded-lg bg-orange-50 border-orange-200">
                <div className="flex items-center justify-between">
                    <Label htmlFor="ambulance-needed" className="flex items-center gap-2 text-base font-semibold text-orange-800">
                        <Ambulance className="w-5 h-5"/>
                        I need an Ambulance Pickup
                    </Label>
                    <Switch
                        id="ambulance-needed"
                        checked={needsAmbulance}
                        onCheckedChange={setNeedsAmbulance}
                    />
                </div>
            </div>

            {/* Conditional Ambulance Fields */}
            <div className={cn(
                "grid gap-4 overflow-hidden transition-all duration-300 ease-in-out",
                needsAmbulance ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
            )}>
                 <h4 className="text-md font-semibold text-slate-700">Pickup Location Details</h4>
                 <div className="space-y-1">
                    <Label htmlFor="hostel">Hostel Name</Label>
                    <Input id="hostel" value={hostelName} onChange={(e) => setHostelName(e.target.value)} placeholder="e.g., Starlight Hall" required={needsAmbulance}/>
                 </div>
                 <div className="space-y-1">
                    <Label htmlFor="block">Block Number</Label>
                    <Input id="block" placeholder="e.g., B" />
                 </div>
                 <div className="space-y-1">
                    <Label htmlFor="room">Room Number</Label>
                    <Input id="room" placeholder="e.g., 205" />
                 </div>
            </div>

            <Button type="submit" className="w-full mt-2" style={{ backgroundColor: '#007bff' }}>
              {needsAmbulance ? 'Book & Request Ambulance' : 'Book Appointment'}
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center text-center gap-4 p-4">
            <div className="w-full p-6 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-slate-500 font-medium">Your Token Number</p>
                <p className="text-6xl font-bold text-slate-800">#{userToken}</p>
            </div>
             <div className="w-full p-4 bg-slate-100 rounded-lg">
                <p className="text-sm text-slate-500 font-medium">Currently Serving</p>
                <p className="text-4xl font-bold text-slate-700">#{servingToken}</p>
            </div>
            {servingToken !== null && userToken !== null && servingToken >= userToken && (
                <p className="font-semibold text-green-600">Your turn has arrived! Please proceed to the check-in counter.</p>
            )}
            <Button onClick={handleBookAnother} variant="outline" className="w-full mt-4">Book Another Slot</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
