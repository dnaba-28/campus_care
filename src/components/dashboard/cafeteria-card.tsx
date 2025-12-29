'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function CafeteriaCard() {
  const cafeteriaImage = PlaceHolderImages.find(p => p.id === 'cafeteria-food');
  return (
    <Card className="relative overflow-hidden rounded-2xl shadow-lg group h-full">
       {cafeteriaImage && (
        <Image
          src={cafeteriaImage.imageUrl}
          alt={cafeteriaImage.description}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={cafeteriaImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
      <CardContent className="relative z-10 flex flex-col justify-between h-full p-6 text-white">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Utensils className="w-8 h-8" />
            <h2 className="text-2xl font-bold font-headline">CAFETERIA</h2>
          </div>
          <p className="text-white/90">
            Had lunch today? Rate the meal and help improve the campus menu.
          </p>
        </div>
        <Button asChild className="w-full bg-white text-slate-800 hover:bg-slate-200">
            <Link href="/cafeteria">
              Leave a Review <ArrowRight className="ml-2" />
            </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
