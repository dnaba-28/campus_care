'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export default function ChatLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      {/* Skeleton for Navbar */}
      <div className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 z-50">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>

      {/* Skeleton for Chat Interface */}
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <Skeleton className="h-7 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Bot className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[50vh] min-h-[300px] overflow-y-auto p-3 bg-muted/50 rounded-md space-y-4">
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <Bot className="w-16 h-16 text-primary/70 animate-pulse" />
                  <p className="text-lg mt-4 font-semibold">Loading Chat...</p>
                </div>
              </div>
              <div className="flex w-full items-center space-x-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
