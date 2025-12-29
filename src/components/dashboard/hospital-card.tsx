'use client';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hospital, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HospitalCard() {
  const hospitalImage = PlaceHolderImages.find(p => p.id === 'hospital-building');

  return (
    <Card className="relative overflow-hidden rounded-2xl shadow-lg group h-full">
      {hospitalImage && (
        <Image
          src={hospitalImage.imageUrl}
          alt={hospitalImage.description}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={hospitalImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
      <CardContent className="relative z-10 flex flex-col justify-between h-full p-6 text-white">
        <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Hospital className="w-8 h-8" />
              <h2 className="text-2xl font-bold font-headline">HOSPITAL</h2>
            </div>
            <p className="text-white/90">
              Check doctor availability, waiting times, and book appointments.
            </p>
        </div>
        <Button asChild variant="ghost" className="w-full justify-start p-0 h-auto hover:bg-transparent text-white/80 hover:text-white">
            <Link href="/hospital">
                View Live Status <ArrowRight className="ml-2" />
            </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
