import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hospital } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HospitalCard() {
  const hospitalImage = PlaceHolderImages.find(img => img.id === 'hospital-building');

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Campus Hospital</CardTitle>
        <Hospital className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-grow p-0">
        {hospitalImage && (
           <div className="relative w-full h-40">
              <Image
                  src={hospitalImage.imageUrl}
                  alt={hospitalImage.description}
                  fill
                  objectFit="cover"
                  data-ai-hint={hospitalImage.imageHint}
              />
           </div>
        )}
        <div className="p-6">
          <div className="text-2xl font-bold font-headline text-primary">Hospital Status</div>
          <CardDescription className="text-xs text-muted-foreground">
            Real-time updates from the health center
          </CardDescription>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href="/hospital">View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
