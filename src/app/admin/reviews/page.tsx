'use client';
import React, { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Check, Trash2, Utensils, Hospital, LineChart } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/navbar';

type FeedbackLog = {
  id: string;
  type: 'CAFETERIA' | 'HOSPITAL';
  rating: number;
  comment: string;
  timestamp: Timestamp;
  status: 'PENDING' | 'RESOLVED';
};

export default function AdminReviewsPage() {
  const [feedback, setFeedback] = useState<FeedbackLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const db = useFirestore(); // Correctly get Firestore instance via hook

  useEffect(() => {
    if (!db) {
        setIsLoading(false);
        return;
    }; // Wait for Firestore to be initialized

    const feedbackRef = collection(db, 'feedback_logs');
    const q = query(feedbackRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as FeedbackLog));
      setFeedback(logs);
      setIsLoading(false);
    }, (error) => {
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [db]); // Re-run effect if db instance changes

  const handleResolve = async (id: string) => {
    if (!db) return;
    const docRef = doc(db, 'feedback_logs', id);
    await updateDoc(docRef, { status: 'RESOLVED' });
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      const docRef = doc(db, 'feedback_logs', id);
      await deleteDoc(docRef);
    }
  };

  const cafeteriaRatings = feedback.filter(f => f.type === 'CAFETERIA' && f.rating > 0).map(f => f.rating);
  const averageCafeteriaRating = cafeteriaRatings.length > 0
    ? (cafeteriaRatings.reduce((a, b) => a + b, 0) / cafeteriaRatings.length).toFixed(1)
    : 'N/A';
  
  const totalIssues = feedback.length;

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={cn('w-4 h-4', i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300')} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-slate-50">
        <Navbar />
        <main className="p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold font-headline">Feedback Dashboard</h1>
                <p className="text-muted-foreground">Live feed of all user-submitted reviews and complaints.</p>
            </header>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Cafeteria Rating</CardTitle>
                        <Utensils className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{averageCafeteriaRating} / 5</div>
                        <p className="text-xs text-muted-foreground">
                            Based on {cafeteriaRatings.length} ratings
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Issues Reported</CardTitle>
                        <LineChart className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalIssues}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all categories
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Feedback Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Comment</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10">Loading feedback...</TableCell>
                                </TableRow>
                            ) : feedback.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10">No feedback submitted yet.</TableCell>
                                </TableRow>
                            ) : (
                                feedback.map(log => (
                                    <TableRow key={log.id} className={cn(log.status === 'RESOLVED' && 'bg-green-50/50')}>
                                        <TableCell>{log.timestamp ? format(log.timestamp.toDate(), 'dd MMM, HH:mm') : 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant={log.type === 'CAFETERIA' ? 'default' : 'secondary'} className="flex items-center gap-1 w-fit">
                                                {log.type === 'CAFETERIA' ? <Utensils className="w-3 h-3" /> : <Hospital className="w-3 h-3" />}
                                                {log.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{renderStars(log.rating)}</TableCell>
                                        <TableCell className="max-w-xs truncate">{log.comment || 'No comment'}</TableCell>
                                        <TableCell>
                                            <Badge variant={log.status === 'PENDING' ? 'destructive' : 'default'} className={cn(log.status === 'RESOLVED' && 'bg-green-600 hover:bg-green-700')}>
                                                {log.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            {log.status === 'PENDING' && (
                                                <Button variant="ghost" size="icon" onClick={() => handleResolve(log.id)}>
                                                    <Check className="w-4 h-4 text-green-600" />
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(log.id)}>
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
