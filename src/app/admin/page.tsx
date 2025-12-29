'use client';
import React, { useState, useEffect } from 'react';
import { Shield, Lock, AlertTriangle, CheckCircle, Activity, Flame, Stethoscope, Car } from 'lucide-react';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useMemoFirebase } from '@/firebase/provider';

type SosReport = {
  id: string;
  userDetails: {
    name: string;
    enrollmentNo: string;
    hostelName: string;
    roomNo: string;
    blockNo: string;
  };
  emergencyType: 'FIRE' | 'HEALTH' | 'SAFETY' | 'ACCIDENT';
  timestamp: string;
};

const emergencyDetails = {
    FIRE: { icon: Flame, color: 'text-red-500', label: 'Fire' },
    HEALTH: { icon: Stethoscope, color: 'text-blue-500', label: 'Health' },
    SAFETY: { icon: Shield, color: 'text-yellow-500', label: 'Safety' },
    ACCIDENT: { icon: Car, color: 'text-gray-400', label: 'Accident' },
};

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // This effect will run when user loading is complete.
  useEffect(() => {
    // If loading is done and there is a user, they are authenticated.
    // In a real app, we'd check for an admin custom claim here.
    if (!isUserLoading && user) {
      setIsAuthenticated(true);
    }
    // If loading is done and there is no user, they remain unauthenticated.
    if (!isUserLoading && !user) {
        setIsAuthenticated(false);
    }
  }, [user, isUserLoading]);

  const sosReportsQuery = useMemoFirebase(() => {
    if (!isAuthenticated || !firestore) return null;
    return query(collection(firestore, 'sos-reports'), orderBy('timestamp', 'desc'));
  }, [isAuthenticated, firestore]);

  const { data: alerts, isLoading: isLoadingReports } = useCollection<SosReport>(sosReportsQuery);

  const resolveAlert = async (id: string) => {
    if (!firestore) return;
    const alertRef = doc(firestore, 'sos-reports', id);
    await deleteDoc(alertRef);
  };

  // SCENE 1: THE LOCK SCREEN
  if (isUserLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl max-w-md w-full shadow-2xl text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-900/30 p-4 rounded-full border border-red-500/50">
              <Lock size={48} className="text-red-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-widest">RESTRICTED AREA</h1>
          <p className="text-gray-400 mb-8">
            {isUserLoading ? 'Verifying Credentials...' : 'Please log in as an Admin to access this page.'}
          </p>
        </div>
      </div>
    );
  }

  // SCENE 2: THE DASHBOARD
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      
      <header className="bg-black border-b border-gray-800 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-500" />
          <h1 className="text-xl font-bold tracking-tight">ADMIN COMMAND CENTER</h1>
        </div>
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-2 text-green-400"><Activity size={16}/> System Online</span>
          <span className="flex items-center gap-2 text-red-400"><AlertTriangle size={16}/> Active Alerts: {alerts?.length || 0}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-[calc(100vh-65px)]">
        
        <div className="lg:col-span-2 relative bg-gray-900 border-r border-gray-800 overflow-hidden">
          <img 
            src="https://images.collegedunia.com/public/college_data/images/campusimage/14888803323.JPG" 
            className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
            alt="Campus Map"
            data-ai-hint="university campus aerial"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <p className="text-gray-500 text-sm">[ LIVE CAMPUS SATELLITE FEED ]</p>
          </div>
          
          {alerts && alerts.length > 0 && (
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-32 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500 animate-ping">
                </div>
             </div>
          )}
        </div>

        <div className="bg-black p-6 overflow-y-auto">
          <h2 className="text-gray-400 mb-6 uppercase text-sm font-bold tracking-wider border-b border-gray-800 pb-2">
            Incoming Signals
          </h2>
          
          <div className="space-y-4">
            {isLoadingReports && (
                 <div className="text-center py-10 opacity-50">
                    <p>Loading Incoming Signals...</p>
                </div>
            )}
            {!isLoadingReports && (!alerts || alerts.length === 0) ? (
              <div className="text-center py-10 opacity-50">
                <CheckCircle size={48} className="mx-auto mb-4 text-green-500"/>
                <p>No Active Emergencies</p>
              </div>
            ) : (
              alerts?.map((alert) => {
                const details = emergencyDetails[alert.emergencyType];
                return (
                    <div key={alert.id} className="bg-red-950/20 border border-red-900/50 p-4 rounded-lg animate-in slide-in-from-right relative group">
                        <div className="flex justify-between items-start mb-2">
                            {details && (
                                 <Badge variant="outline" className={`font-semibold ${details.color} border-current text-xs animate-pulse`}>
                                     <details.icon className="w-3 h-3 mr-1" />
                                     {details.label}
                                 </Badge>
                            )}
                            <span className="text-xs text-gray-500">{format(new Date(alert.timestamp), 'HH:mm:ss')}</span>
                        </div>
                        
                        <h3 className="text-white font-bold text-lg mb-1">{alert.userDetails.name}</h3>
                        <div className="text-gray-400 text-sm mb-4">
                           <p>{alert.userDetails.enrollmentNo}</p>
                           <p>{`${alert.userDetails.hostelName}, Block ${alert.userDetails.blockNo}, Room ${alert.userDetails.roomNo}`}</p>
                        </div>

                        <Button 
                            onClick={() => resolveAlert(alert.id)}
                            size="sm"
                            className="w-full bg-green-800/80 hover:bg-green-700 text-white text-sm py-1 h-auto transition-colors flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={16} /> Mark Resolved
                        </Button>
                    </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
