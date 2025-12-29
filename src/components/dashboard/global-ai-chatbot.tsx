'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function GlobalAIChatbot() {
  return (
    <Card className="flex flex-col h-full bg-white/90 backdrop-blur-md shadow-2xl border border-white/50 rounded-2xl">
      <CardContent className="flex-1 flex flex-col justify-between p-6 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-full">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold font-headline text-slate-800">CARE-AI</h3>
        </div>

        <div className="space-y-4 mt-4">
          <p className="font-semibold text-lg text-slate-600">
            Need immediate first-aid advice or have a safety question?
          </p>
          <Button asChild variant="secondary" className="w-full">
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
