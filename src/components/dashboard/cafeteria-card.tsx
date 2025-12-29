'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CafeteriaCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Utensils className="w-8 h-8 text-primary" />
          <CardTitle className="text-2xl font-bold font-headline">Cafeteria Hub</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Had lunch today? Rate the meal and help improve the campus menu.
        </p>
        <Button asChild className="w-full">
          <Link href="/cafeteria">
            Leave a Review <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
