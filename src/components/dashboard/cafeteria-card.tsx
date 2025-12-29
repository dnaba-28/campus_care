'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Star, Camera, Upload, Loader2, CheckCircle, Utensils, MessageSquareQuote } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';


const CLOUDINARY_CLOUD_NAME = "dkyy0fpoz"; // <--- REPLACE THIS WITH YOUR CLOUDINARY CLOUD NAME
const CLOUDINARY_UPLOAD_PRESET = "care_campus"; // The preset you created in Cloudinary

export default function CafeteriaCard() {
  const [view, setView] = useState<'initial' | 'form'>('initial');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const cafeteriaImage = PlaceHolderImages.find(img => img.id === 'cafeteria-food');


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
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Upload failed');
      }

      setUploadedImageUrl(data.secure_url);
      toast({
        title: 'Image Uploaded!',
        description: 'Your photo is ready for submission.',
      });
    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message || 'Could not upload image. Please try again.',
      });
      setImagePreview(null);
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

    toast({
        title: (
            <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-bold">Feedback Sent!</span>
            </div>
        ),
        description: 'Thank you! Admin will review your feedback.',
    });

    // Reset form and view
    setRating(0);
    setReviewText('');
    setImagePreview(null);
    setUploadedImageUrl(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    setView('initial');
  };

  if (view === 'initial') {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Campus Cafeteria</CardTitle>
          <Utensils className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex-grow p-0">
          {cafeteriaImage && (
             <div className="relative w-full h-40">
                <Image
                    src={cafeteriaImage.imageUrl}
                    alt={cafeteriaImage.description}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={cafeteriaImage.imageHint}
                />
             </div>
          )}
          <div className="p-6">
            <h3 className="text-lg font-bold font-headline">Had Lunch Today?</h3>
            <p className="text-sm text-muted-foreground">Your feedback helps improve the daily menu and service quality.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => setView('form')}>
            <MessageSquareQuote className="mr-2" />
            Leave a Review
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">Rate Today's Meal</CardTitle>
        <CardDescription>Your feedback helps improve the mess.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {/* Photo Upload Section */}
        <div className="p-4 border-2 border-dashed rounded-lg text-center">
          {imagePreview ? (
            <div className="relative w-full h-40">
              <Image
                src={imagePreview}
                alt="Food preview"
                layout="fill"
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
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Camera className="w-10 h-10" />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" /> Snap/Upload Food Photo
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
          <label className="text-sm font-medium">Your Rating</label>
          <div className="flex justify-center space-x-1 mt-2">
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
        </div>

        {/* Review Section */}
        <div>
          <label htmlFor="review-text" className="text-sm font-medium">Review</label>
          <Textarea
            id="review-text"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="What was good or bad? (Hygiene, Taste, etc.)"
            className="mt-1"
          />
        </div>
      </CardContent>
      <CardFooter className="flex-col sm:flex-row gap-2">
        <Button
            onClick={() => setView('initial')}
            variant="outline"
            className="w-full sm:w-auto"
        >
            Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
            </>
          ) : (
            'Submit Feedback'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

    