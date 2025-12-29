'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Send, Sparkles, AlertTriangle, Siren, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

type BotMessage = {
  text: string;
  isUser: false;
  isUrgent?: boolean;
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

  const processCommand = (command: string) => {
    let botResponse: BotMessage = {
      text: "I'm sorry, I don't understand that command. Try 'hospital', 'cafeteria', or 'sos'.",
      isUser: false,
    };
    let urgent = false;
    let action: (() => void) | null = null;
    let actionDelay = 0;

    // --- Triage Logic ---

    // Scenario 1: Fever / Sickness
    if (['fever', 'headache', 'vomiting', 'dizzy', 'sick'].some(k => command.includes(k))) {
      botResponse.text = `🤒 **Medical Advice:**
1. Stay hydrated (drink water/ORS).
2. Monitor your temperature.
3. If > 100°F, take Paracetamol.
      
I am redirecting you to the Hospital Page to book a doctor...`;
      action = () => router.push('/hospital');
      actionDelay = 3000;
    }
    // Scenario 2: Accident / Injury
    else if (['accident', 'bleeding', 'broken', 'fell', 'injury'].some(k => command.includes(k))) {
      botResponse.text = `🚨 **EMERGENCY FIRST AID:**
1. Apply direct pressure to stop bleeding.
2. Do NOT move the patient if neck/back pain.
3. Keep the patient warm.
      
I am activating the Ambulance Tracker immediately...`;
      botResponse.isUrgent = true;
      action = () => router.push('/hospital?mode=ambulance');
      actionDelay = 3000;
    }
    // Scenario 3: Fire / Smoke
    else if (['fire', 'smoke', 'smell'].some(k => command.includes(k))) {
      botResponse.text = `🔥 **FIRE SAFETY:**
1. Crawl low under smoke.
2. Do not use elevators.
3. Wet a cloth and cover your nose.
      
OPENING SOS BEACON NOW!`;
      botResponse.isUrgent = true;
      action = onTriggerSos;
      actionDelay = 500; // Almost immediate
    }

    // --- Simple Navigation (Fallback) ---
    else if (command.includes('hospital')) {
      botResponse.text = 'Navigating to the Hospital page...';
      action = () => router.push('/hospital');
    } else if (command.includes('cafeteria') || command.includes('mess')) {
      botResponse.text = 'Navigating to the Cafeteria Mess Hub...';
      action = () => router.push('/cafeteria');
    } else if (command.includes('sos') || command.includes('emergency')) {
      botResponse.text = 'Opening the SOS beacon...';
      action = onTriggerSos;
    }

    // Add bot response and execute action
    setMessages(prev => [...prev, botResponse]);

    if (action) {
      setTimeout(action, actionDelay);
    }
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
            <div key={index} className={cn('flex', msg.isUser ? 'justify-end' : 'justify-start')}>
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
