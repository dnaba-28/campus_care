'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function GlobalAIChatbot() {
    const aiImage = PlaceHolderImages.find(p => p.id === 'ai-assistant');
    return (
    <Card className="relative overflow-hidden rounded-2xl shadow-lg group h-full">
        {aiImage && (
            <Image
              src={aiImage.imageUrl}
              alt={aiImage.description}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={aiImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
        <CardContent className="relative z-10 flex flex-col justify-between h-full p-6 text-white">
            <div className="space-y-2">
                <div className="flex items-center gap-4">
                    <Sparkles className="w-8 h-8" />
                    <h2 className="text-2xl font-bold font-headline">CARE-AI</h2>
                </div>
                <p className="text-white/90">
                    Need immediate first-aid advice or have a safety question?
                </p>
            </div>
            <Button asChild className="w-full bg-white text-slate-800 hover:bg-slate-200">
                <Link href="/chat" prefetch={true}>
                    Start a Conversation <ArrowRight className="ml-2" />
                </Link>
            </Button>
        </CardContent>
    </Card>
    );
}
