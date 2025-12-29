'use client';

import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Flame, Stethoscope, Shield, Car, CheckCircle } from 'lucide-react';

// Mock user data as per requirements
const currentUser = {
  name: 'John Doe',
  enrollmentNo: '12345XYZ',
  hostelName: 'Starlight Hall',
  roomNo: '205',
  blockNo: 'B',
};
// To test the empty form state, set currentUser to null:
// const currentUser = null;

type EmergencyType = 'FIRE' | 'HEALTH' | 'SAFETY' | 'ACCIDENT' | null;

const emergencyCategories = [
    { type: 'FIRE' as const, label: 'Fire', icon: Flame, color: 'bg-red-500 hover:bg-red-600', textColor: 'text-red-500' },
    { type: 'HEALTH' as const, label: 'Health', icon: Stethoscope, color: 'bg-blue-500 hover:bg-blue-600', textColor: 'text-blue-500' },
    { type: 'SAFETY' as const, label: 'Safety', icon: Shield, color: 'bg-yellow-500 hover:bg-yellow-600', textColor: 'text-yellow-500' },
    { type: 'ACCIDENT' as const, label: 'Accident', icon: Car, color: 'bg-gray-700 hover:bg-gray-800', textColor: 'text-gray-700' },
];

type SosCardProps = {
    isModalOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
}

export default function SosCard({ isModalOpen, onOpenChange }: SosCardProps) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedEmergency, setSelectedEmergency] = useState<EmergencyType>(null);
    const [userDetails, setUserDetails] = useState({
        name: '',
        enrollmentNo: '',
        hostelName: '',
        roomNo: '',
        blockNo: '',
    });
    const { toast } = useToast();
    
    useEffect(() => {
        if (currentUser) {
            setUserDetails(currentUser);
        }
    }, []);

    const handleCategoryClick = (emergencyType: EmergencyType) => {
        setSelectedEmergency(emergencyType);
        setShowConfirmation(true);
    };

    const handleSendSOS = () => {
        const payload = {
            userDetails,
            emergencyType: selectedEmergency,
            timestamp: new Date().toISOString(),
        };

        console.log('SOS Payload:', payload);

        setShowConfirmation(false);
        toast({
            title: (
                <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-bold">SOS Sent!</span>
                </div>
            ),
            description: `Your alert for ${selectedEmergency} has been sent. Security is notified.`,
        });

        setTimeout(() => {
            onOpenChange?.(false);
            setSelectedEmergency(null);
        }, 3000);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setUserDetails(prev => ({...prev, [id]: value}));
    };

    return (
        <>
            <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
                <Card className="flex flex-col h-full bg-white/90 backdrop-blur-md shadow-2xl border border-white/50 rounded-2xl">
                    <CardContent className="flex-1 flex flex-col justify-between p-6 z-10">
                        <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 text-red-500 rounded-full">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold font-headline text-slate-800">EMERGENCY SOS</h3>
                        </div>

                        <div className="space-y-4 mt-4">
                        <p className="font-semibold text-lg text-slate-600">
                            Press for immediate assistance. Your location will be shared with security.
                        </p>
                        <DialogTrigger asChild>
                            <Button variant="destructive" className="w-full text-lg font-bold">
                                TRIGGER SOS
                            </Button>
                        </DialogTrigger>
                        </div>
                    </CardContent>
                </Card>
                <DialogContent className="max-w-4xl w-full h-full sm:h-auto max-h-[90vh] flex flex-col p-0">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle className="text-2xl font-bold font-headline">Smart SOS System</DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-6 pb-6">
                        {/* User Details Form */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Your Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" value={userDetails.name} onChange={handleInputChange} placeholder="Your Name" />
                                </div>
                                <div>
                                    <Label htmlFor="enrollmentNo">Enrollment No</Label>
                                    <Input id="enrollmentNo" value={userDetails.enrollmentNo} onChange={handleInputChange} placeholder="Enrollment Number" />
                                </div>
                                <div>
                                    <Label htmlFor="hostelName">Hostel Name</Label>
                                    <Input id="hostelName" value={userDetails.hostelName} onChange={handleInputChange} placeholder="Hostel Name" />
                                </div>
                                <div>
                                    <Label htmlFor="roomNo">Room No</Label>
                                    <Input id="roomNo" value={userDetails.roomNo} onChange={handleInputChange} placeholder="Room Number"/>
                                </div>
                                <div>
                                    <Label htmlFor="blockNo">Block No</Label>
                                    <Input id="blockNo" value={userDetails.blockNo} onChange={handleInputChange} placeholder="Block Number"/>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Categories */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Select Emergency Type</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {emergencyCategories.map(({type, label, icon: Icon, color}) => (
                                     <Card 
                                        key={type}
                                        onClick={() => handleCategoryClick(type)}
                                        className={`flex flex-col items-center justify-center p-6 text-white text-xl font-bold cursor-pointer transition-transform transform hover:scale-105 ${color}`}
                                      >
                                        <Icon className="h-12 w-12 mb-2" />
                                        <span>{label}</span>
                                     </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog */}
            <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold text-center">CONFIRM SOS?</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-base">
                            Are you sure you want to send a <span className={`font-bold ${emergencyCategories.find(c => c.type === selectedEmergency)?.textColor}`}>{selectedEmergency}</span> alert?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center items-stretch gap-4 pt-4">
                        <AlertDialogCancel asChild>
                           <Button variant="outline" size="lg">Cancel</Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button onClick={handleSendSOS} variant="destructive" size="lg" className="text-lg">
                                YES, SEND HELP
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
