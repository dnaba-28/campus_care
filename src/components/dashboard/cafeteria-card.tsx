'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Utensils, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CafeteriaCard() {
  const cafeteriaImage = PlaceHolderImages.find(img => img.id === 'cafeteria-food');

  return (
    <Card className="relative flex flex-col h-full overflow-hidden group">
      {cafeteriaImage && (
        <Image
          src={cafeteriaImage.imageUrl}
          alt={cafeteriaImage.description}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={cafeteriaImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      
      <CardContent className="relative flex-1 flex flex-col justify-between p-6 text-primary-foreground z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-foreground/20 rounded-full">
            <Utensils className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold font-headline">CAFETERIA</h3>
        </div>

        <div className="space-y-4">
          <p className="font-semibold text-lg drop-shadow-md">
            Had lunch today? Rate the meal and help improve the campus menu.
          </p>
          <Button asChild variant="secondary" className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <Link href="/cafeteria">
              Leave a Review
              <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
