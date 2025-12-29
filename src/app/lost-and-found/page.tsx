'use client';

import Navbar from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Search } from 'lucide-react';
import Image from 'next/image';

const mockFoundItems = [
  { id: 1, name: 'iPhone 13', description: 'Found near the library. Black color, has a small crack on the top left.', location: 'Library', date: '2024-07-20', imageUrl: 'https://picsum.photos/seed/iphone/300/200', user: 'Priya S.' },
  { id: 2, name: 'Student ID Card', description: 'Enrollment No: 22BCE1054. Found in the cafeteria.', location: 'Cafeteria', date: '2024-07-19', imageUrl: 'https://placehold.co/300x200/E2E8F0/475569?text=Student+ID', user: 'Admin' },
  { id: 3, name: 'Black Umbrella', description: 'Standard black umbrella, left in Lecture Hall 5.', location: 'Lecture Hall 5', date: '2024-07-18', imageUrl: 'https://picsum.photos/seed/umbrella/300/200', user: 'Raj K.' },
  { id: 4, name: 'Calculator (Casio)', description: 'Scientific calculator found in the math department.', location: 'Math Department', date: '2024-07-18', imageUrl: 'https://picsum.photos/seed/calculator/300/200', user: 'Amit G.' },
];

const mockLostItems = [
  { id: 1, name: 'Airpods Pro Case', description: 'Lost my Airpods Pro charging case, likely in the gym or sports complex.', location: 'Gym/Sports Complex', date: '2024-07-21', user: 'Sneha M.' },
  { id: 2, name: 'Library Book - "Data Structures"', description: 'Issued under my name, might have left it in the common room.', location: 'Hostel Common Room', date: '2024-07-20', user: 'Vikram R.' },
];

function ItemCard({ item }: { item: any }) {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <div className="grid grid-cols-3">
                    <div className="relative col-span-1 h-full">
                        <Image src={item.imageUrl} alt={item.name} fill objectFit="cover" data-ai-hint="lost item" />
                    </div>
                    <div className="col-span-2 p-4">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        <div className="text-xs text-muted-foreground mt-4 space-y-1">
                            <p><strong>Found at:</strong> {item.location}</p>
                            <p><strong>Found on:</strong> {item.date}</p>
                            <p><strong>Reported by:</strong> {item.user}</p>
                        </div>
                        <Button className="w-full mt-4">Claim Item</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function LostAndFoundPage() {
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
                    <Button><PlusCircle className="mr-2"/> Report Item</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="found">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="found">Found Items ({mockFoundItems.length})</TabsTrigger>
                        <TabsTrigger value="lost">Lost Items ({mockLostItems.length})</TabsTrigger>
                    </TabsList>
                    <TabsContent value="found" className="mt-6">
                        <div className="grid gap-6">
                           {mockFoundItems.map(item => <ItemCard key={item.id} item={item} />)}
                        </div>
                    </TabsContent>
                    <TabsContent value="lost" className="mt-6">
                         <div className="grid gap-6">
                           {mockLostItems.map(item => (
                               <Card key={item.id} className="p-4">
                                   <h3 className="font-bold text-lg">{item.name}</h3>
                                   <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                    <div className="text-xs text-muted-foreground mt-4 space-y-1">
                                        <p><strong>Last Seen:</strong> {item.location}</p>
                                        <p><strong>Lost on:</strong> {item.date}</p>
                                        <p><strong>Reported by:</strong> {item.user}</p>
                                    </div>
                                    <Button variant="outline" className="w-full mt-4">I have found this!</Button>
                               </Card>
                           ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
