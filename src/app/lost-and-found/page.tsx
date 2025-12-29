'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Navbar from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Search, Upload, Loader2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { fbStorage } from '@/firebase';
import { addDoc, collection, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const itemSchema = z.object({
  description: z.string().min(10, 'Please provide a detailed description.'),
  phone: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit phone number.'),
  category: z.enum(['lost', 'found']),
  image: z.instanceof(File).refine(file => file.size > 0, 'An image is required.'),
});

type ItemFormData = z.infer<typeof itemSchema>;

function ReportItemForm({ onFormSubmit }: { onFormSubmit: () => void }) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const firestore = useFirestore();

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      category: 'found',
    },
  });

  const selectedCategory = watch('category');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('image', file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ItemFormData) => {
    setIsSubmitting(true);
    if (!firestore) {
        toast({ variant: 'destructive', title: 'Error', description: 'Database not connected.' });
        setIsSubmitting(false);
        return;
    }
    try {
      // 1. Upload image to Firebase Storage
      const storageRef = ref(fbStorage, `lost-found/${Date.now()}-${data.image.name}`);
      const snapshot = await uploadBytes(storageRef, data.image);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // 2. Save data to Firestore
      const docData = {
        description: data.description,
        phone: data.phone,
        category: data.category,
        imageUrl: imageUrl,
        timestamp: new Date(),
      };
      await addDoc(collection(firestore, 'lost-and-found'), docData);

      toast({
        title: 'Success!',
        description: 'Your item has been reported.',
      });
      onFormSubmit(); // Close dialog on success

    } catch (error) {
      console.error('Error reporting item:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh!',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div
        className="p-4 border-2 border-dashed rounded-lg text-center cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        {imagePreview ? (
          <div className="relative w-full h-48">
            <Image src={imagePreview} alt="Item preview" fill objectFit="cover" className="rounded-md" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground py-6">
            <Upload className="w-12 h-12" />
            <p className="font-semibold mt-2">Click to Upload an Image</p>
            <p className="text-sm">This is required</p>
          </div>
        )}
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        {errors.image && <p className="text-sm text-destructive mt-2">{errors.image.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="e.g., Black wallet with a driver's license found near..." {...register('description')} />
        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <Label htmlFor="phone">Contact Phone Number</Label>
        <Input id="phone" type="tel" placeholder="1234567890" {...register('phone')} />
        {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
      </div>
      
      <div>
        <Label>Category</Label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
             <div className="grid grid-cols-2 gap-2 mt-1">
                <Button type="button" variant={field.value === 'found' ? 'default' : 'outline'} onClick={() => field.onChange('found')}>Found Item</Button>
                <Button type="button" variant={field.value === 'lost' ? 'default' : 'outline'} onClick={() => field.onChange('lost')}>Lost Item</Button>
            </div>
          )}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSubmitting ? `Submitting ${selectedCategory}...` : `Report as ${selectedCategory}`}
      </Button>
    </form>
  );
}

function ItemListError() {
    return (
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="mx-auto h-8 w-8 text-red-500 mb-4" />
            <h3 className="font-semibold text-red-800">Feature Currently Unavailable</h3>
            <p className="text-sm text-red-700 mt-1">
                We are experiencing issues fetching the list of items. Please check back later.
            </p>
        </div>
    );
}


export default function LostAndFoundPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-4xl">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold font-headline flex items-center gap-2">
                    <Search />
                    Lost &amp; Found Center
                  </CardTitle>
                  <CardDescription>Browse reported items or report a new one.</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2" /> Report Item</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Report a Lost or Found Item</DialogTitle>
                        </DialogHeader>
                        <ReportItemForm onFormSubmit={() => setIsDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="found">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="found">Found Items</TabsTrigger>

                  <TabsTrigger value="lost">Lost Items</TabsTrigger>
                </TabsList>
                <TabsContent value="found" className="mt-6">
                  <ItemListError />
                </TabsContent>
                <TabsContent value="lost" className="mt-6">
                  <ItemListError />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
