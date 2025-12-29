'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function GlobalAIChatbot() {
  const aiImage = PlaceHolderImages.find(img => img.id === 'ai-assistant');
  
  return (
    <Card className="relative flex flex-col h-full overflow-hidden group">
      {aiImage && (
        <Image
          src={aiImage.imageUrl}
          alt={aiImage.description}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={aiImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      
      <CardContent className="relative flex-1 flex flex-col justify-between p-6 text-primary-foreground z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-foreground/20 rounded-full">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold font-headline">CARE-AI</h3>
        </div>

        <div className="space-y-4">
          <p className="font-semibold text-lg drop-shadow-md">
            Need immediate first-aid advice or have a safety question?
          </p>
          <Button asChild variant="secondary" className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <Link href="/chat">
              Start a Conversation
              <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
