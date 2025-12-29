'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LostAndFoundCard() {
    const lostAndFoundImage = PlaceHolderImages.find(p => p.id === 'lost-and-found');
    return (
    <Card className="relative overflow-hidden rounded-2xl shadow-lg group h-full">
        {lostAndFoundImage && (
            <Image
              src={lostAndFoundImage.imageUrl}
              alt={lostAndFoundImage.description}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={lostAndFoundImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
        <CardContent className="relative z-10 flex flex-col justify-between h-full p-6 text-white">
            <div className="space-y-2">
                <div className="flex items-center gap-4">
                    <Search className="w-8 h-8" />
                    <h2 className="text-2xl font-bold font-headline">LOST &amp; FOUND</h2>
                </div>
                <p className="text-white/90">
                    Misplaced an item? Report it here or browse things that others have found.
                </p>
            </div>
            <Button asChild className="w-full bg-white text-slate-800 hover:bg-slate-200">
                <Link href="/lost-and-found">
                    View Items <ArrowRight className="ml-2" />
                </Link>
            </Button>
        </CardContent>
    </Card>
    );
}
