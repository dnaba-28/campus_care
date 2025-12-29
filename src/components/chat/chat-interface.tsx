'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Send, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { campusCareChat } from '@/ai/flows/campus-care-chat';

type Action = {
  label: string;
  path: string;
};

type BotMessage = {
  text: string;
  isUser: false;
  isUrgent?: boolean;
  action?: Action;
};

type UserMessage = {
  text: string;
  isUser: true;
};

type Message = BotMessage | UserMessage;

// This is a placeholder for the function that will be passed down from the page
// to allow the chat component to trigger the SOS modal.
const triggerSos = () => {
    // In a real app, this might be a prop passed from a layout component
    // that has access to the SOS modal state. For now, we find it in the DOM.
    const trigger = document.querySelector('[aria-haspopup="dialog"]') as HTMLElement | null;
    if (trigger && trigger.textContent?.includes('Trigger SOS')) {
        trigger.click();
    }
};

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: UserMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    try {
      const response = await campusCareChat({ query: input });
      const botMessage: BotMessage = {
        text: response.answer,
        isUser: false,
        isUrgent: response.answer.startsWith('🚨 EMERGENCY:'),
      };

      if (response.answer.toLowerCase().includes('hospital')) {
        botMessage.action = { label: '🏥 Book a Doctor', path: '/hospital' };
      } else if (response.answer.toLowerCase().includes('ambulance')) {
         botMessage.action = { label: '🚑 Open Ambulance Tracker', path: '/hospital?mode=ambulance' };
      } else if (response.answer.toLowerCase().includes('cafeteria')) {
        botMessage.action = { label: '🍔 View Menu & Crowds', path: '/cafeteria' };
      } else if (response.answer.includes('SOS')) {
        botMessage.action = { label: '🚨 Trigger SOS', path: '#' };
      }
      
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("AI chat failed:", error);
      const errorMessage: BotMessage = {
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        isUrgent: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (path: string) => {
    if (path === '#') {
        triggerSos();
    } else {
        router.push(path);
    }
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold font-headline flex items-center gap-2">
              <Sparkles className="text-primary" />
              CARE-AI Assistant
            </CardTitle>
            <CardDescription>Your campus AI health and safety expert</CardDescription>
          </div>
          <Bot className="h-6 w-6 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div ref={chatContainerRef} className="h-[50vh] min-h-[300px] overflow-y-auto p-3 bg-muted/50 rounded-md space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Bot className="w-16 h-16 text-primary/70" />
                <p className="text-lg mt-4 font-semibold">How can I help you today?</p>
                <p className="text-sm mt-1">e.g., "I have a fever", "Show me the hospital", "Fire in Block B"</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div key={index} className={cn('flex flex-col', msg.isUser ? 'items-end' : 'items-start')}>
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                  msg.isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border',
                  !msg.isUser && msg.isUrgent ? 'bg-red-50 border-red-200 text-red-900' : ''
                )}
              >
                <ReactMarkdown
                  className="prose prose-sm"
                  components={{
                    p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside my-2" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
              {!msg.isUser && msg.action && (
                <Button
                  size="sm"
                  className="mt-2 text-sm h-auto px-3 py-1"
                  onClick={() => handleActionClick(msg.action!.path)}
                >
                  {msg.action.label}
                </Button>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start space-x-2">
                <Bot className="w-5 h-5 text-primary flex-shrink-0"/>
                <div className="bg-background border rounded-lg px-3 py-2 text-sm flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2"/>
                    Thinking...
                </div>
            </div>
          )}
        </div>
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Type a command or emergency..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" onClick={handleSend} disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
