import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hospital, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HospitalCard() {
  const hospitalImage = PlaceHolderImages.find(img => img.id === 'hospital-building');

  return (
    <Card className="relative flex flex-col h-full overflow-hidden group">
       {hospitalImage && (
        <Image
          src={hospitalImage.imageUrl}
          alt={hospitalImage.description}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={hospitalImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      
      <CardContent className="relative flex-1 flex flex-col justify-between p-6 text-primary-foreground z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-foreground/20 rounded-full">
            <Hospital className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold font-headline">HOSPITAL</h3>
        </div>

        <div className="space-y-4">
          <p className="font-semibold text-lg drop-shadow-md">
            Check doctor availability, waiting times, and book appointments.
          </p>
          <Button asChild variant="secondary" className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <Link href="/hospital">
              View Live Status
              <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
