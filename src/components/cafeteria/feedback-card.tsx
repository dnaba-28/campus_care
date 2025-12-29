'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Star, Camera, Upload, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const CLOUDINARY_CLOUD_NAME = "diw7x4ii3";
const CLOUDINARY_UPLOAD_PRESET = "care_campus";

export default function FeedbackCard() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      uploadToCloudinary(file);
    }
  };

  const uploadToCloudinary = async (file: File) => {
    setIsUploading(true);
    setUploadedImageUrl(null);
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'care_campus');
  
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/diw7x4ii3/image/upload', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      
      setUploadedImageUrl(data.secure_url);
      toast({ title: "Success", description: "Image uploaded!" });
  
    } catch (error: any) {
      console.error(error);
      toast({ variant: "destructive", title: "Upload Failed", description: error.message || 'Please check your upload preset configuration in Cloudinary.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        variant: 'destructive',
        title: 'Rating Required',
        description: 'Please select a star rating before submitting.',
      });
      return;
    }

    const feedbackData = {
      photoUrl: uploadedImageUrl,
      rating,
      reviewText,
      timestamp: new Date().toISOString(),
    };

    console.log('Final Feedback Payload:', feedbackData);

    setIsSubmitted(true);
  };
  
  const handleReset = () => {
    setRating(0);
    setReviewText('');
    setImagePreview(null);
    setUploadedImageUrl(null);
    setIsSubmitted(false);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  if (isSubmitted) {
    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center text-center p-10 gap-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
                <h2 className="text-2xl font-bold font-headline">Feedback Sent!</h2>
                <p className="text-muted-foreground">Thank you for your valuable feedback. The admin team will review it shortly.</p>
                <Button onClick={handleReset} className="mt-4">Submit Another Review</Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Rate Your Meal</CardTitle>
        <CardDescription>Your feedback helps us improve the campus cafeteria experience for everyone.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Photo Upload Section */}
        <div className="p-4 border-2 border-dashed rounded-lg text-center">
          {imagePreview ? (
            <div className="relative w-full h-48">
              <Image
                src={imagePreview}
                alt="Food preview"
                fill
                objectFit="cover"
                className="rounded-md"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground py-6">
              <Camera className="w-12 h-12" />
              <p className="font-semibold mt-2">Add a Photo</p>
              <p className="text-sm">Show us what you had today!</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" /> Snap/Upload
              </Button>
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          )}
        </div>

        {/* Rating Section */}
        <div>
          <Label className="text-base font-semibold">Your Rating</Label>
          <div className="flex justify-center space-x-2 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'w-10 h-10 cursor-pointer transition-colors',
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
        </div>

        {/* Review Section */}
        <div>
          <Label htmlFor="review-text" className="text-base font-semibold">Your Review</Label>
          <Textarea
            id="review-text"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="What was good or bad? Consider hygiene, taste, portion size, and service."
            className="mt-1"
            rows={4}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          className="w-full text-lg"
          size="lg"
          disabled={isUploading || !uploadedImageUrl}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading Image...
            </>
          ) : (
            'Submit Feedback'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
