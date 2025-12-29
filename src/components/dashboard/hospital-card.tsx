import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hospital, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HospitalCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Hospital className="w-8 h-8 text-primary" />
          <CardTitle className="text-2xl font-bold font-headline">Hospital Dashboard</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Check doctor availability, current wait times, and book appointments instantly.
        </p>
        <Button asChild className="w-full">
          <Link href="/hospital">
            View Live Status <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
