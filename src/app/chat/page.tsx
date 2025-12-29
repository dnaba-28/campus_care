'use client';

import Navbar from '@/components/layout/navbar';
import ChatInterface from '@/components/chat/chat-interface';

export default function ChatPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-2xl">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}
