'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Utensils, MessageSquareQuote } from 'lucide-react';
import Link from 'next/link';

export default function CafeteriaCard() {
  const cafeteriaImage = PlaceHolderImages.find(img => img.id === 'cafeteria-food');

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Campus Cafeteria</CardTitle>
        <Utensils className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-grow p-0">
        {cafeteriaImage && (
           <div className="relative w-full h-40">
              <Image
                  src={cafeteriaImage.imageUrl}
                  alt={cafeteriaImage.description}
                  fill
                  objectFit="cover"
                  data-ai-hint={cafeteriaImage.imageHint}
              />
           </div>
        )}
        <div className="p-6">
          <h3 className="text-lg font-bold font-headline">Had Lunch Today?</h3>
          <p className="text-sm text-muted-foreground">Your feedback helps improve the daily menu and service quality.</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href="/cafeteria">
            <MessageSquareQuote className="mr-2" />
            Leave a Review
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}