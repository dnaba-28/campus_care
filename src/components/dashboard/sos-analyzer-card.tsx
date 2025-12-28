'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2, AudioWaveform, AlertCircle } from 'lucide-react';
import { analyzeSosReport } from '@/ai/flows/realtime-sos-analyzer';
import { useToast } from '@/hooks/use-toast';

type Status = 'idle' | 'recording' | 'processing' | 'success' | 'error';

export default function SosAnalyzerCard() {
  const [status, setStatus] = useState<Status>('idle');
  const [analysis, setAnalysis] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStatus('recording');
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = handleStop;
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast({
        variant: 'destructive',
        title: 'Microphone Error',
        description: 'Could not access microphone. Please check permissions.',
      });
      setErrorMessage('Microphone access denied. Please enable it in your browser settings.');
      setStatus('error');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.stop();
      // onstop event will trigger the handleStop logic
    }
  };
  
  const handleStop = () => {
     // Stop all media tracks to turn off the mic indicator
    mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());

    setStatus('processing');
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      try {
        const result = await analyzeSosReport({ audioDataUri: base64Audio });
        setAnalysis(result.analysis);
        setStatus('success');
      } catch (e) {
        console.error('Analysis failed:', e);
        setErrorMessage('Failed to analyze the audio. Please try again.');
        setStatus('error');
      } finally {
        audioChunksRef.current = [];
      }
    };
  };

  const resetState = () => {
    setStatus('idle');
    setAnalysis('');
    setErrorMessage('');
  };

  const renderContent = () => {
    switch (status) {
      case 'recording':
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-destructive">
                <div className="w-3 h-3 rounded-full bg-destructive animate-pulse"></div>
                <span className="font-medium">Recording...</span>
            </div>
            <Button onClick={handleStopRecording} variant="destructive" size="lg">
              <Square className="mr-2 h-5 w-5" /> Stop Recording
            </Button>
          </div>
        );
      case 'processing':
        return (
          <div className="flex flex-col items-center gap-4 text-primary">
            <Loader2 className="h-10 w-10 animate-spin" />
            <p className="font-semibold">Analyzing report...</p>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center gap-4 text-left w-full">
            <h3 className="font-bold text-lg font-headline">Analysis Complete</h3>
            <p className="text-sm bg-muted p-3 rounded-md">{analysis}</p>
            <Button onClick={resetState} variant="outline">Record Another Report</Button>
          </div>
        );
      case 'error':
        return (
           <div className="flex flex-col items-center gap-4 text-destructive">
            <AlertCircle className="h-10 w-10" />
            <p className="font-semibold text-center">{errorMessage}</p>
            <Button onClick={resetState} variant="outline">Try Again</Button>
          </div>
        )
      case 'idle':
      default:
        return (
          <div className="flex flex-col items-center gap-4">
            <p className="text-center text-sm text-muted-foreground">
              Press the button to record an audio SOS report. The AI will analyze it and suggest actions.
            </p>
            <Button onClick={handleStartRecording} size="lg">
              <Mic className="mr-2 h-5 w-5" /> Start Recording
            </Button>
          </div>
        );
    }
  };

  return (
    <Card className="row-span-2">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-medium">Realtime SOS Analyzer</CardTitle>
            <CardDescription>AI-powered emergency response</CardDescription>
          </div>
          <AudioWaveform className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-center min-h-[150px]">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
