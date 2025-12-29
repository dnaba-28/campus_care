'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function FeedbackCard() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        variant: 'destructive',
        title: 'Rating Required',
        description: 'Please select a star rating before submitting.',
      });
      return;
    }
    toast({
      title: 'Feedback Submitted!',
      description: 'Thank you for rating your visit.',
    });
    setRating(0);
  };

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold" style={{ color: '#007bff' }}>Rate Your Visit</CardTitle>
        <Star className="w-5 h-5 text-slate-400" />
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex justify-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                'w-8 h-8 cursor-pointer transition-colors',
                (hoverRating >= star || rating >= star)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-slate-300'
              )}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>
        <Textarea placeholder="Describe your experience (hygiene, doctor behavior)..." />
        <Button onClick={handleSubmit} className="w-full" style={{ backgroundColor: '#007bff' }}>
          Submit Feedback
        </Button>
      </CardContent>
    </Card>
  );
}
