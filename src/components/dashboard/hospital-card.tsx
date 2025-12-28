import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Hospital, Clock } from 'lucide-react';

export default function HospitalCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Campus Hospital</CardTitle>
        <Hospital className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-headline text-primary">Hospital Status</div>
        <CardDescription className="text-xs text-muted-foreground">
          Real-time updates from the health center
        </CardDescription>
        <div className="mt-4 space-y-2">
            <div className="flex items-center">
                <p className="text-sm font-medium">Doctor Availability:</p>
                <p className="text-sm text-green-600 font-semibold ml-2">Available</p>
            </div>
            <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <p className="text-sm font-medium">Waiting Time:</p>
                <p className="text-sm text-muted-foreground ml-2">10 min</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
