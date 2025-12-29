'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function GlobalAIChatbot() {
    return (
    <Card>
        <CardHeader>
        <div className="flex items-center gap-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <CardTitle className="text-2xl font-bold font-headline">CARE-AI Assistant</CardTitle>
        </div>
        </CardHeader>
        <CardContent>
        <p className="text-muted-foreground mb-4">
            Need immediate first-aid advice or have a safety question? Get answers from our AI assistant.
        </p>
        <Button asChild className="w-full">
            <Link href="/chat">
                Start a Conversation <ArrowRight className="ml-2" />
            </Link>
        </Button>
        </CardContent>
    </Card>
    );
}
