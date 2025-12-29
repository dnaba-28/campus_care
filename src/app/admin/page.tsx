'use client';
import React, { useState, useEffect } from 'react';
import { Shield, Lock, AlertTriangle, MapPin, CheckCircle, Activity } from 'lucide-react';

export default function AdminPage() {
  // 🔒 STATE: Controls if the page is visible or locked
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 🛡️ THE MOCK DATABASE (Alerts)
  const [alerts, setAlerts] = useState<any[]>([]);

  // Load alerts when the dashboard unlocks
  useEffect(() => {
    if (isAuthenticated) {
      const savedAlerts = localStorage.getItem('admin_alerts');
      if (savedAlerts) {
        setAlerts(JSON.parse(savedAlerts));
      }
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

  // 🛑 SCENE 1: THE LOCK SCREEN (Visible to everyone else)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl max-w-md w-full shadow-2xl text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-900/30 p-4 rounded-full border border-red-500/50">
              <Lock size={48} className="text-red-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-widest">RESTRICTED AREA</h1>
          <p className="text-gray-400 mb-8">Authorized Personnel Only. <br/> All attempts are logged.</p>
          
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
      <header className="bg-black border-b border-gray-800 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-500" />
          <h1 className="text-xl font-bold tracking-tight">ADMIN COMMAND CENTER</h1>
        </div>
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-2 text-green-400"><Activity size={16}/> System Online</span>
          <span className="flex items-center gap-2 text-red-400"><AlertTriangle size={16}/> Active Threats: {alerts.length}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-[calc(100vh-64px)]">
        
        {/* LEFT: LIVE MAP (Simulation) */}
        <div className="lg:col-span-2 relative bg-gray-900 border-r border-gray-800 overflow-hidden">
          {/* Map Background */}
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/e/e6/NIT_Agartala_Admin_Block.jpg" 
            className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
            alt="Campus Map"
            data-ai-hint="university campus admin building"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <p className="text-gray-500 text-sm">[ LIVE SATELLITE FEED CONNECTED ]</p>
          </div>
          
          {/* Render Red Dots for Active Alerts */}
          {alerts.map((alert) => (
             <div key={alert.id} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping">
                <div className="w-32 h-32 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500">
                </div>
             </div>
          ))}
        </div>

        {/* RIGHT: ALERTS FEED */}
        <div className="bg-black p-6 overflow-y-auto">
          <h2 className="text-gray-400 mb-6 uppercase text-sm font-bold tracking-wider border-b border-gray-800 pb-2">
            Incoming Signals
          </h2>
          
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-10 opacity-50">
                <CheckCircle size={48} className="mx-auto mb-4 text-green-500"/>
                <p>No Active Emergencies</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="bg-red-950/20 border border-red-900/50 p-4 rounded-lg animate-in slide-in-from-right relative group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded font-bold uppercase animate-pulse">
                      {alert.type || 'EMERGENCY'}
                    </span>
                    <span className="text-xs text-gray-500">{new Date(alert.id).toLocaleTimeString()}</span>
                  </div>
                  
                  <h3 className="text-white font-bold text-lg mb-1">{alert.message || "Unknown Incident"}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <MapPin size={14} />
                    {alert.location || "Location Unknown"}
                  </div>

                  <button 
                    onClick={() => resolveAlert(alert.id)}
                    className="w-full bg-green-800/80 hover:bg-green-700 text-white text-sm py-2 rounded transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={16} /> Mark Resolved
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
