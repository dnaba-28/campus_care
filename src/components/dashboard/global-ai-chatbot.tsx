'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

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

type GlobalAIChatbotProps = {
  onTriggerSos: () => void;
};

export default function GlobalAIChatbot({ onTriggerSos }: GlobalAIChatbotProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: UserMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);

    processCommand(input.toLowerCase());
    setInput('');
  };

  const handleActionClick = (path: string) => {
    router.push(path);
  };

  const processCommand = (command: string) => {
    let botResponse: BotMessage = {
      text: "I'm sorry, I don't understand that command. Try 'hospital', 'cafeteria', or 'sos'.",
      isUser: false,
    };

    // --- Triage Logic ---

    // Scenario 1: Fever / Sickness
    if (['fever', 'headache', 'vomiting', 'dizzy', 'sick'].some(k => command.includes(k))) {
      botResponse.text = `🤒 **First Aid:**\n1. Drink water/ORS.\n2. Rest in a cool room.\n3. Monitor temperature.`;
      botResponse.action = { label: "🏥 Book a Doctor Now", path: "/hospital" };
    }
    // Scenario 2: Accident / Injury
    else if (['accident', 'bleeding', 'broken', 'fell', 'injury'].some(k => command.includes(k))) {
      botResponse.text = `🚨 **CRITICAL ADVICE:**\n1. Stop bleeding with direct pressure.\n2. Do NOT move the patient.\n3. Keep them warm.`;
      botResponse.isUrgent = true;
      botResponse.action = { label: "🚑 Open Ambulance Tracker", path: "/hospital?mode=ambulance" };
    }
    // Scenario 3: Fire / Smoke
    else if (['fire', 'smoke', 'smell'].some(k => command.includes(k))) {
      botResponse.text = `🔥 **FIRE SAFETY:**\n1. Crawl low under smoke.\n2. Do not use elevators.\n3. Wet a cloth and cover your nose.`;
      botResponse.isUrgent = true;
      botResponse.action = { label: "🔥 Trigger SOS Beacon", path: "#" }; // Path is # for onTriggerSos
    }
    
    // --- Simple Navigation (Fallback) ---
    
    else if (command.includes('hospital')) {
        botResponse.text = "Here's the link to the hospital page.";
        botResponse.action = { label: '🏥 Go to Hospital', path: '/hospital' };
    } else if (command.includes('cafeteria') || command.includes('mess')) {
        botResponse.text = "The Cafeteria is currently 65% full.";
        botResponse.action = { label: '🍔 View Menu & Crowds', path: '/cafeteria' };
    } else if (command.includes('sos') || command.includes('emergency')) {
        botResponse.text = 'Click here to open the SOS beacon for any emergency.';
        botResponse.action = { label: '🚨 Trigger SOS', path: '#' }; // Path is # for onTriggerSos
    }

    setMessages(prev => [...prev, botResponse]);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="text-primary" />
              AI Assistant
            </CardTitle>
            <CardDescription>Your campus AI command center</CardDescription>
          </div>
          <Bot className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-48 overflow-y-auto p-3 bg-muted/50 rounded-md space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <p className="text-sm">Ask me for help!</p>
              <p className="text-xs">e.g., "I have a fever", "Show me the hospital", "Fire in Block B"</p>
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
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside" {...props} />,
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
                  onClick={() => msg.action.path === '#' ? onTriggerSos() : handleActionClick(msg.action.path)}
                >
                  {msg.action.label}
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Type a command or emergency..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button type="submit" size="icon" onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
