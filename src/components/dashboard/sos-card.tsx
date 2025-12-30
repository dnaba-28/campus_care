'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
import { AlertTriangle, Flame, Stethoscope, Shield, Car, CheckCircle, ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { db } from '@/firebase';
import { ref, push } from 'firebase/database';


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
    const sosImage = PlaceHolderImages.find(p => p.id === 'sos-map');
    
    useEffect(() => {
        const savedProfile = localStorage.getItem('student_profile');
        if (savedProfile) {
            try {
                const parsedProfile = JSON.parse(savedProfile);
                setUserDetails(prevDetails => ({ ...prevDetails, ...parsedProfile }));
            } catch (e) {
                console.error("Failed to parse student profile from localStorage", e);
            }
        }
    }, [isModalOpen]);

    const handleCategoryClick = (emergencyType: EmergencyType) => {
        setSelectedEmergency(emergencyType);
        setShowConfirmation(true);
    };

    const handleSendSOS = () => {
        // 1. Validate that all userDetails are filled
        for (const key of ['name', 'enrollmentNo', 'hostelName', 'roomNo', 'blockNo']) {
            if (!userDetails[key as keyof typeof userDetails]) {
                toast({
                    variant: "destructive",
                    title: "Missing Information",
                    description: "Please fill out all your details in the SOS form before sending an alert.",
                });
                onOpenChange?.(true); // Re-open the modal if it was closed
                return; // Stop the function
            }
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`;
                saveAlert(location);
            },
            () => {
                saveAlert("Unknown Location (GPS denied)");
            }
        );
    };

    const saveAlert = (location: string) => {
        if (!db) {
            toast({
                variant: "destructive",
                title: "Database Error",
                description: "Could not connect to the database. Please try again later.",
            });
            return;
        }

        const newAlert = {
          emergencyType: selectedEmergency,
          userDetails: userDetails,
          location: location,
          time: new Date().toISOString(),
        };
        
        try {
            push(ref(db, 'alerts/'), newAlert);

            setShowConfirmation(false);
            // toast({
            //     title: (
            //         <div className="flex items-center gap-2">
            //             <CheckCircle className="h-5 w-5 text-green-500" />
            //             <span className="font-bold">SOS Sent to Security Cloud!</span>
            //         </div>
            //     ),
            //     description: `Your ${selectedEmergency} alert has been received.`,
            // });
            toast({
                title: "SOS Alert Sent Successfully!",
                description: "Help is on the way."
              })

            setTimeout(() => {
                onOpenChange?.(false);
                setSelectedEmergency(null); 
            }, 1500);

        } catch (error) {
            console.error("Error sending SOS to Firebase:", error);
            toast({
                variant: "destructive",
                title: "SOS Failed",
                description: "Could not send the alert. Please check your connection or try again.",
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setUserDetails(prev => ({...prev, [id]: value}));
    };

    return (
        <>
            <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
                <DialogTrigger asChild>
                     <Card className="relative overflow-hidden rounded-2xl shadow-lg group h-full cursor-pointer">
                         {sosImage && (
                            <Image
                            src={sosImage.imageUrl}
                            alt={sosImage.description}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={true}
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={sosImage.imageHint}
                            />
                        )}
                         <div className="absolute inset-0 bg-gradient-to-t from-red-800/80 to-red-600/40"></div>
                        <CardContent className="relative z-10 flex flex-col justify-between h-full p-6 text-white">
                            <div className='space-y-2'>
                                <div className="flex items-center gap-4">
                                    <AlertTriangle className="w-8 h-8" />
                                    <h2 className="text-2xl font-bold font-headline">EMERGENCY SOS</h2>
                                </div>
                                <p className="text-white/90">
                                    In a critical situation? Press for immediate assistance.
                                </p>
                            </div>
                            <Button className="w-full bg-white text-slate-800 hover:bg-slate-200 pointer-events-none">
                                Send Alert <ArrowRight className="ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-full h-full sm:h-auto max-h-[90vh] flex flex-col p-0">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle className="text-2xl font-bold font-headline">Smart SOS System</DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-6 pb-6">
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
