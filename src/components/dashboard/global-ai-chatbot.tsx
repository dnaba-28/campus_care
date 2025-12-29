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
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={aiImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <CardContent className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                    <h2 className="text-2xl font-bold font-headline">CARE-AI Assistant</h2>
                </div>
                <p className="text-white/90">
                    Need immediate first-aid advice or have a safety question? Get answers from our AI assistant.
                </p>
                <Button asChild className="w-full bg-white/20 border-white/30 backdrop-blur-sm hover:bg-white/30">
                    <Link href="/chat">
                        Start a Conversation <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </div>
        </CardContent>
    </Card>
    );
}
