'use client';
import React, { useState, useEffect } from 'react';
import { Shield, Lock, AlertTriangle, MapPin, CheckCircle, Activity, Trash2, ShieldX } from 'lucide-react';

export default function AdminPage() {
  // 🔒 STATE: Controls if the page is visible or locked
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 🛡️ THE MOCK DATABASE (Alerts)
  const [alerts, setAlerts] = useState<any[]>([]);

  // Load alerts when the dashboard unlocks and set up a listener for real-time updates
  useEffect(() => {
    if (isAuthenticated) {
      const loadAlerts = () => {
        const savedAlerts = localStorage.getItem('admin_alerts');
        if (savedAlerts) {
          try {
            setAlerts(JSON.parse(savedAlerts));
          } catch(e) {
            console.error("Failed to parse alerts from localStorage", e);
            setAlerts([]);
          }
        } else {
          setAlerts([]);
        }
      };

      loadAlerts(); // Initial load

      // Listen for storage changes from other tabs/windows
      window.addEventListener('storage', loadAlerts);

      // Clean up the listener when the component unmounts
      return () => {
        window.removeEventListener('storage', loadAlerts);
      };
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 🔑 THE SECRET PASSWORD
    if (password === 'NITA2028') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('⛔ Access Denied: Invalid Security Clearance');
    }
  };

  const resolveAlert = (id: number) => {
    const updated = alerts.filter(a => a.id !== id);
    setAlerts(updated);
    localStorage.setItem('admin_alerts', JSON.stringify(updated));
  };
  
  const clearAllAlerts = () => {
    setAlerts([]);
    localStorage.removeItem('admin_alerts');
  };

  // 🛑 SCENE 1: THE LOCK SCREEN (Visible to everyone else)
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

  // ✅ SCENE 2: THE DASHBOARD (Visible only after PIN)
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      
      {/* Top Stats Bar */}
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
          {alerts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle size={48} className="mx-auto mb-4 text-green-500"/>
                No Active Emergencies. System is Clear.
              </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="bg-red-950/20 border border-red-900/50 p-4 rounded-lg relative group mb-4">
                
                {/* Header: Type and Time */}
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded font-bold uppercase animate-pulse">
                    {alert.type || 'EMERGENCY'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(alert.time).toLocaleTimeString()}
                  </span>
                </div>
            
                {/* The User Details */}
                <h3 className="text-white font-bold text-lg">{alert.senderName}</h3>
                
                {/* 🆔 THE DEVICE ID DISPLAY */}
                <div className="bg-gray-900 inline-block px-2 py-1 rounded border border-gray-700 mt-1 mb-2">
                  <p className="text-xs text-cyan-400 font-mono tracking-wider">
                    ID: {alert.senderID}
                  </p>
                </div>
            
                {/* Location */}
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                  <MapPin size={14} />
                  {alert.location || "GPS Signal Weak"}
                </div>
            
                {/* Resolve Button */}
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
