'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function FeedbackCard() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        variant: 'destructive',
        title: 'Rating Required',
        description: 'Please select a star rating before submitting.',
      });
      return;
    }

    try {
      await addDoc(collection(db, 'feedback_logs'), {
        type: 'HOSPITAL',
        rating,
        comment,
        timestamp: serverTimestamp(),
        status: 'PENDING',
      });

      toast({
        title: 'Feedback Submitted!',
        description: 'Thank you for rating your visit.',
      });
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting feedback: ', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Could not submit your feedback. Please try again.',
      });
    }
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
        <Textarea 
          placeholder="Describe your experience (hygiene, doctor behavior)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button onClick={handleSubmit} className="w-full" style={{ backgroundColor: '#007bff' }}>
          Submit Feedback
        </Button>
      </CardContent>
    </Card>
  );
}
