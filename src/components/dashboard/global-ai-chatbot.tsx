'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, MessageSquare, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function GlobalAIChatbot() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="text-primary" />
              CARE-AI
            </CardTitle>
            <CardDescription>Your campus AI health assistant</CardDescription>
          </div>
          <Bot className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center text-center gap-4 p-6">
        <Bot className="w-16 h-16 text-primary/70" />
        <div className="space-y-1">
            <h3 className="font-semibold text-lg font-headline">Need Assistance?</h3>
            <p className="text-muted-foreground text-sm">Get immediate first-aid advice or ask any health or safety questions.</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
            <Link href="/chat">
                <MessageSquare className="mr-2" /> Start a Conversation
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
