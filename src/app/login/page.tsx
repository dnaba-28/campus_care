'use client';
import React, { useState } from 'react';
import { User, Building, Briefcase, Calendar, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  
  // State to hold all 5 inputs
  const [formData, setFormData] = useState({
    name: '',
    enrollment: '',
    hostel: '',
    department: '',
    year: ''
  });

  const handleLogin = () => {
    // 1. SAVE to LocalStorage (The "Hackathon Database")
    localStorage.setItem('student_profile', JSON.stringify(formData));
    
    // 2. Redirect to Profile Page
    router.push('/profile');
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  return (
    <div className="min-h-screen bg-[#E6DBC9] flex flex-col items-center justify-center p-6">
      
      {/* Avatar Header */}
      <div className="w-32 h-32 bg-[#E27D7A] rounded-full flex items-center justify-center border-[6px] border-[#E6DBC9] z-20 -mb-16 shadow-lg">
         <User size={64} color="white" />
      </div>

      {/* The Blue Form Card */}
      <div className="bg-[#0B1E47] w-full max-w-md rounded-[2.5rem] pt-20 pb-10 px-8 shadow-2xl relative z-10">
        <h2 className="text-white text-center text-xl font-bold mb-6">Student Registration</h2>
        
        <div className="space-y-6">
          {/* 1. Name */}
          <InputRow 
            icon={<User size={20} />} color="bg-[#FF4757]" 
            placeholder="Enter Name" 
            onChange={(e: any) => handleInputChange('name', e.target.value)}
          />
          {/* 2. Enrollment */}
          <InputRow 
            icon={<User size={20} />} color="bg-[#535C68]" 
            placeholder="Enter Enrollment No." 
            onChange={(e: any) => handleInputChange('enrollment', e.target.value)}
          />
          {/* 3. Hostel */}
          <InputRow 
            icon={<Building size={20} className="text-black" />} color="bg-[#F1C40F]" 
            placeholder="Enter Hostel Name" 
            onChange={(e: any) => handleInputChange('hostel', e.target.value)}
          />
          {/* 4. Department */}
          <InputRow 
            icon={<Briefcase size={20} />} color="bg-[#74B9FF]" 
            placeholder="Enter Department" 
            onChange={(e: any) => handleInputChange('department', e.target.value)}
          />
          {/* 5. Year */}
          <InputRow 
            icon={<Calendar size={20} className="text-black" />} color="bg-white" 
            placeholder="Enter Year (e.g. 4th)" 
            onChange={(e: any) => handleInputChange('year', e.target.value)}
          />
        </div>

        {/* Login Button */}
        <button 
          onClick={handleLogin}
          className="w-full bg-white text-[#0B1E47] mt-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
        >
          Save & Login <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

// Helper Component for Inputs
function InputRow({ icon, color, placeholder, onChange }: any) {
  return (
    <div className="flex items-center space-x-4">
      <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center shrink-0 shadow-md`}>
        {/* Render icon with white color mostly, unless specified black above */}
        <span className="text-white">{icon}</span>
      </div>
      <input 
        type="text" 
        placeholder={placeholder}
        onChange={onChange}
        className="flex-1 bg-transparent border-b border-white/20 text-white text-lg placeholder-gray-400 focus:outline-none focus:border-white py-2"
      />
    </div>
  );
}
