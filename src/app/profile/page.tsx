'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit2, Check, User, Building, Briefcase, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


// Sub-Component for a single Row to keep code clean
function ProfileRow({ icon, bgColor, value, isEditing, onChange }: any) {
  return (
    <div className="flex items-center space-x-4">
      {/* The Icon Circle */}
      <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center shrink-0 shadow-md`}>
        {icon}
      </div>
      
      {/* The Text/Input Area */}
      <div className="flex-1">
        {isEditing ? (
          <input 
            type="text" 
            value={value} 
            onChange={onChange}
            className="w-full bg-white/10 text-white text-lg font-bold px-2 py-1 rounded border border-white/30 focus:outline-none focus:border-white"
          />
        ) : (
          <h3 className="text-white text-lg font-bold tracking-wide">{value || 'Not set'}</h3>
        )}
      </div>
    </div>
  );
}


export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    enrollment: "",
    hostel: "",
    department: "",
    year: ""
  });
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('student_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('student_profile', JSON.stringify(profile));
    setIsEditing(false);
    toast({
        title: "Profile Saved!",
        description: "Your details have been updated successfully."
    });
  }

  return (
    <div className="min-h-screen bg-[#E6DBC9] font-sans pb-10">
      
      {/* 1. HEADER (Dark Maroon) */}
      <header className="bg-[#582C42] h-16 flex items-center px-4 shadow-md sticky top-0 z-30">
        <Link href="/" className="text-white hover:bg-white/10 p-2 rounded-full transition">
            <ArrowLeft size={24} />
        </Link>
        <h1 className="text-white text-2xl font-bold flex-1 text-center pr-10">Profile</h1>
      </header>

      <main className="flex flex-col items-center px-4 mt-8">
        
        {/* 2. AVATAR (The Overlapping Badge) */}
        {/* z-20 and -mb-16 pull it down into the card */}
        <div className="w-32 h-32 bg-[#E27D7A] rounded-full flex items-center justify-center border-[6px] border-[#E6DBC9] z-20 -mb-16 shadow-lg relative">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name || 'default'}&backgroundColor=E27D7A`} 
            alt="Profile Avatar" 
            className="w-24 h-24 rounded-full"
          />
        </div>

        {/* 3. THE BLUE CARD (Main Container) */}
        <div className="bg-[#0B1E47] w-full max-w-sm rounded-[2.5rem] pt-24 pb-12 px-6 shadow-2xl relative z-10">
          
          <div className="space-y-8">
            
            {/* ROW 1: Name */}
            <ProfileRow 
              icon={<User size={20} className="text-white" />} 
              bgColor="bg-[#FF4757]" // Red Circle
              value={profile.name}
              isEditing={isEditing}
              onChange={(e:any) => setProfile({...profile, name: e.target.value})}
            />

            {/* ROW 2: Enrollment */}
            <ProfileRow 
              icon={<User size={20} className="text-white" />} 
              bgColor="bg-[#535C68]" // Gray/Blue Circle
              value={profile.enrollment}
              isEditing={isEditing}
              onChange={(e:any) => setProfile({...profile, enrollment: e.target.value})}
            />

            {/* ROW 3: Hostel */}
            <ProfileRow 
              icon={<Building size={20} className="text-black" />} 
              bgColor="bg-[#F1C40F]" // Yellow Circle
              value={profile.hostel}
              isEditing={isEditing}
              onChange={(e:any) => setProfile({...profile, hostel: e.target.value})}
            />

            {/* ROW 4: Department */}
            <ProfileRow 
              icon={<Briefcase size={20} className="text-white" />} 
              bgColor="bg-[#74B9FF]" // Light Blue Circle
              value={profile.department}
              isEditing={isEditing}
              onChange={(e:any) => setProfile({...profile, department: e.target.value})}
            />

            {/* ROW 5: Year */}
            <ProfileRow 
              icon={<Calendar size={18} className="text-black" />} 
              bgColor="bg-white" // White "Calendar" Icon
              value={profile.year}
              isEditing={isEditing}
              onChange={(e:any) => setProfile({...profile, year: e.target.value})}
            />

          </div>
        </div>

        {/* 4. ACTION BUTTONS */}
        <div className="flex gap-4 mt-8 w-full max-w-sm">
          
          {/* Edit Button */}
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="flex-1 bg-[#0B1E47] text-white py-4 rounded-full text-lg font-bold shadow-xl flex items-center justify-center gap-2 hover:bg-[#192a56] transition"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
            {isEditing ? <Check size={20} /> : <Edit2 size={18} />}
          </button>
          
          {/* Save Button */}
          {isEditing && (
             <button 
                onClick={handleSave}
                className="flex-1 bg-[#4cd137] text-white py-4 rounded-full text-lg font-bold shadow-xl flex items-center justify-center gap-2 hover:bg-[#44bd32] transition"
            >
                Save <Check size={20} />
            </button>
          )}
        
        </div>

      </main>
    </div>
  );
}
