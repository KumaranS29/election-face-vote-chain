
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle, X, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FaceVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const FaceVerificationModal: React.FC<FaceVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'instructions' | 'camera' | 'verifying' | 'success'>('instructions');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStep('camera');
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const captureAndVerify = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      // Simulate face detection and verification
      setStep('verifying');
      
      // Stop camera stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }

      // Simulate verification process
      setTimeout(() => {
        const isVerified = Math.random() > 0.1; // 90% success rate for demo
        
        if (isVerified) {
          setStep('success');
          setTimeout(() => {
            onSuccess();
          }, 2000);
        } else {
          toast({
            title: "Verification Failed",
            description: "Face verification failed. Please try again.",
            variant: "destructive"
          });
          setStep('instructions');
        }
      }, 3000);
    }
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Face Verification Required</span>
          </DialogTitle>
          <DialogDescription>
            Verify your identity using facial recognition to cast your vote securely.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {step === 'instructions' && (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Facial Recognition Verification</h3>
                <div className="text-sm text-gray-600 space-y-2 text-left">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>Position your face clearly in front of the camera</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>Ensure good lighting and remove any obstructions</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>Look directly at the camera when prompted</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>This process ensures vote security and prevents fraud</span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={startCamera}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                Start Verification
              </Button>
            </div>
          )}

          {step === 'camera' && (
            <div className="text-center space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-60 bg-gray-100 rounded-lg object-cover"
                />
                <div className="absolute inset-0 border-2 border-green-400 rounded-lg pointer-events-none">
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-green-400"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-green-400"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-green-400"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-green-400"></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">Position your face within the frame</p>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={captureAndVerify}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700"
                >
                  Capture & Verify
                </Button>
              </div>
            </div>
          )}

          {step === 'verifying' && (
            <div className="text-center space-y-4 py-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <AlertCircle className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Verifying Identity...</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Please wait while we verify your facial biometrics
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4 py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-green-800">Verification Successful!</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Identity verified. Your vote is being processed securely.
                </p>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};

export default FaceVerificationModal;
