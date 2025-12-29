'use client';
import React, { useEffect, useState } from 'react';
import { ArrowLeft, User, Building, Briefcase, Calendar, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();

  // Default State (Placeholder data if nothing is saved)
  const [profile, setProfile] = useState({
    name: "Guest User",
    enrollment: "N/A",
    hostel: "Not Assigned",
    department: "General",
    year: "1st Year"
  });

  // ✨ THE MAGIC: Load data from Login Page when component mounts
  useEffect(() => {
    const savedData = localStorage.getItem('student_profile');
    if (savedData) {
      setProfile(JSON.parse(savedData));
    } else {
      // If no data, maybe redirect to login
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('student_profile');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#E6DBC9] font-sans pb-10">
      
      {/* Header */}
      <header className="bg-[#582C42] h-16 flex items-center px-4 shadow-md sticky top-0 z-30">
        <Link href="/" className="text-white hover:bg-white/10 p-2 rounded-full transition">
            <ArrowLeft size={24} />
        </Link>
        <h1 className="text-white text-2xl font-bold flex-1 text-center pr-10">My Profile</h1>
      </header>

      <main className="flex flex-col items-center px-4 mt-8">
        
        {/* Avatar */}
        <div className="w-32 h-32 bg-[#E27D7A] rounded-full flex items-center justify-center border-[6px] border-[#E6DBC9] z-20 -mb-16 shadow-lg relative">
           {/* Generates a unique avatar based on the student's name! */}
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}&backgroundColor=E27D7A`} 
            alt="Profile Avatar" 
            className="w-24 h-24 rounded-full"
          />
        </div>

        {/* The Card Displaying Data */}
        <div className="bg-[#0B1E47] w-full max-w-sm rounded-[2.5rem] pt-24 pb-12 px-6 shadow-2xl relative z-10">
          <div className="space-y-8">
            <DisplayRow icon={<User size={20}/>} color="bg-[#FF4757]" label={profile.name} />
            <DisplayRow icon={<User size={20}/>} color="bg-[#535C68]" label={profile.enrollment} />
            <DisplayRow icon={<Building size={20} className="text-black"/>} color="bg-[#F1C40F]" label={profile.hostel} />
            <DisplayRow icon={<Briefcase size={20}/>} color="bg-[#74B9FF]" label={profile.department} />
            <DisplayRow icon={<Calendar size={20} className="text-black"/>} color="bg-white" label={profile.year} />
          </div>
        </div>

        {/* Logout Button */}
        <div className="w-full max-w-sm mt-8">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-4 rounded-full text-lg font-bold shadow-xl flex items-center justify-center gap-2 hover:bg-red-700 transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

      </main>
    </div>
  );
}

// Helper for displaying rows (Read-Only)
function DisplayRow({ icon, color, label }: any) {
  return (
    <div className="flex items-center space-x-4">
      <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center shrink-0 shadow-md`}>
        <span className="text-white">{icon}</span>
      </div>
      <h3 className="text-white text-xl font-bold tracking-wide">{label}</h3>
    </div>
  );
}
