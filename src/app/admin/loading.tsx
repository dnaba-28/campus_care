'use client';
import { Activity, Shield, ShieldX, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      <header className="bg-black/50 backdrop-blur-sm border-b border-gray-800 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-500" />
          <h1 className="text-xl font-bold tracking-tight">🛡️ Campus Security Control</h1>
        </div>
        <div className="flex gap-4 text-sm items-center">
          <span className="flex items-center gap-2 text-green-400"><Activity size={16}/> System Online</span>
          <Skeleton className="h-4 w-24 bg-gray-800" />
          <span className="flex items-center gap-2 text-gray-500">
            <ShieldX size={16}/> Clear All
          </span>
        </div>
      </header>

      <main className="p-4 md:p-8">
        <div className="space-y-4">
          <div className="text-center py-12 text-gray-500">
            <Activity size={48} className="mx-auto mb-4 text-blue-500 animate-spin"/>
            Connecting to Secure Feed...
          </div>
          
          {/* Skeleton for an alert card */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-red-950/20 border border-red-900/50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <Skeleton className="h-5 w-20 bg-red-800" />
                <Skeleton className="h-3 w-16 bg-gray-800" />
              </div>
              <Skeleton className="h-6 w-32 bg-gray-800 mt-2 mb-2" />
              <Skeleton className="h-5 w-24 bg-gray-900 mb-4" />
              <Skeleton className="h-4 w-40 bg-gray-800 mb-4" />
              <Skeleton className="h-10 w-full bg-green-900/50" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
