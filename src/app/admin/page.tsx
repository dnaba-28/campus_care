'use client';

import Navbar from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Admin Panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>This is the admin panel.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
