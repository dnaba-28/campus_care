'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function GlobalAIChatbot() {
  return (
    <Card className="relative flex flex-col h-full overflow-hidden">
      <CardContent className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-foreground/20 rounded-full">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold font-headline">CARE-AI</h3>
        </div>

        <div className="space-y-4">
          <p className="font-semibold text-lg">
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
