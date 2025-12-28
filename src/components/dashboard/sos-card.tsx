'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function SosCard() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleClick = () => {
    if (status !== 'idle') return;

    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    }, 1500);
  };

  const cardContent = {
    idle: {
      icon: <AlertTriangle className="h-16 w-16 text-destructive" />,
      title: 'SOS EMERGENCY',
      style: 'border-destructive border-2 animate-pulse cursor-pointer hover:bg-destructive/10',
    },
    sending: {
      icon: <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-destructive"></div>,
      title: 'Sending...',
      style: 'border-destructive border-2',
    },
    sent: {
      icon: <CheckCircle className="h-16 w-16 text-green-500" />,
      title: 'Help Sent ✅',
      style: 'border-green-500 border-2',
    },
  };

  return (
    <Card
      className={`transition-all duration-300 ${cardContent[status].style}`}
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Emergency Services</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4 p-10">
        {cardContent[status].icon}
        <p className="text-2xl font-bold font-headline">{cardContent[status].title}</p>
      </CardContent>
    </Card>
  );
}
