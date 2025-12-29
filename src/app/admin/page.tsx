'use client';
import React, { useState, useEffect } from 'react';
import { Shield, Lock, AlertTriangle, MapPin, CheckCircle, Activity, ShieldX } from 'lucide-react';
import { db } from '@/lib/firebase';
import { ref, onValue, remove } from 'firebase/database';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to listen for real-time Firebase updates
  useEffect(() => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    const alertsRef = ref(db, 'alerts/');
    const unsubscribe = onValue(alertsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([key, value]: any) => ({ id: key, ...value })).reverse();
        setAlerts(list);
      } else {
        setAlerts([]);
      }
      setIsLoading(false);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'NITA2028') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('⛔ Access Denied: Invalid Security Clearance');
    }
  };

  const resolveAlert = (id: string) => {
    const alertRef = ref(db, `alerts/${id}`);
    remove(alertRef);
  };
  
  const clearAllAlerts = () => {
    const alertsRef = ref(db, 'alerts/');
    remove(alertsRef);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl max-w-md w-full shadow-2xl text-center backdrop-blur-sm bg-opacity-70">
          <div className="flex justify-center mb-6">
            <div className="bg-red-900/30 p-4 rounded-full border border-red-500/50">
              <Lock size={48} className="text-red-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-widest">RESTRICTED AREA</h1>
          <p className="text-gray-400 mb-8">Authorized Personnel Only. <br/> Enter PIN to access the Security Control Panel.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter Admin PIN" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-700 text-white text-center text-2xl tracking-widest py-3 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
            />
            {error && <p className="text-red-500 text-sm font-bold animate-pulse">{error}</p>}
            
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)]">
              UNLOCK SYSTEM
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      
      <header className="bg-black/50 backdrop-blur-sm border-b border-gray-800 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-500" />
          <h1 className="text-xl font-bold tracking-tight">🛡️ Campus Security Control</h1>
        </div>
        <div className="flex gap-4 text-sm items-center">
          <span className="flex items-center gap-2 text-green-400"><Activity size={16}/> System Online</span>
          <span className="flex items-center gap-2 text-red-400"><AlertTriangle size={16}/> Active Threats: {alerts.length}</span>
          <button onClick={clearAllAlerts} className="flex items-center gap-2 text-gray-500 hover:text-red-400 transition-colors">
            <ShieldX size={16}/> Clear All
          </button>
        </div>
      </header>

      <main className="p-4 md:p-8">
        <div className="space-y-4">
          {isLoading ? (
             <div className="text-center py-12 text-gray-500">
                <Activity size={48} className="mx-auto mb-4 text-blue-500 animate-spin"/>
                Connecting to Secure Feed...
              </div>
          ) : alerts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle size={48} className="mx-auto mb-4 text-green-500"/>
                No Active Emergencies. System is Clear.
              </div>
          ) : (
            alerts.map((alert: any) => (
              <div key={alert.id} className="bg-red-950/20 border border-red-900/50 p-4 rounded-lg relative group mb-4">
                
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded font-bold uppercase animate-pulse">
                    {alert.emergencyType || 'EMERGENCY'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(alert.time).toLocaleTimeString()}
                  </span>
                </div>
            
                <h3 className="text-white font-bold text-lg">{alert.userDetails?.name || 'Unknown User'}</h3>
                
                <div className="bg-gray-900 inline-block px-2 py-1 rounded border border-gray-700 mt-1 mb-2">
                  <p className="text-xs text-cyan-400 font-mono tracking-wider">
                    ID: {alert.userDetails?.enrollmentNo || 'N/A'}
                  </p>
                </div>
            
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                  <MapPin size={14} />
                  {alert.location || "GPS Signal Weak"}
                </div>
            
                <button 
                  onClick={() => resolveAlert(alert.id)}
                  className="w-full bg-green-800/80 hover:bg-green-700 text-white text-sm py-2 rounded transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} /> Resolve Incident
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
