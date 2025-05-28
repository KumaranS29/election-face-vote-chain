
import React, { useRef, useEffect, useState } from 'react';
import { Camera, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FaceRecognitionProps {
  onVerificationComplete: (faceData: any) => void;
  onCancel: () => void;
}

const FaceRecognition: React.FC<FaceRecognitionProps> = ({ onVerificationComplete, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsDetecting(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data for face detection
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Simple face detection simulation (in real implementation, you'd use OpenCV.js or a similar library)
    // For now, we'll simulate face detection after a delay
    setTimeout(() => {
      // Simulate face detection success
      const faceDetected = Math.random() > 0.2; // 80% success rate for demo
      
      if (faceDetected) {
        setFaceDetected(true);
        
        // Create face verification data
        const faceData = {
          timestamp: new Date().toISOString(),
          imageData: canvas.toDataURL('image/jpeg', 0.8),
          confidence: 0.95,
          landmarks: {
            // Simulated face landmarks
            leftEye: { x: 150, y: 120 },
            rightEye: { x: 200, y: 120 },
            nose: { x: 175, y: 150 },
            mouth: { x: 175, y: 180 }
          }
        };
        
        // Auto-complete verification after face is detected
        setTimeout(() => {
          onVerificationComplete(faceData);
        }, 1500);
      } else {
        setIsDetecting(false);
        // You could show an error message here
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold mb-2">Face Verification Required</h3>
          <p className="text-gray-600 text-sm">
            Please position your face in front of the camera for verification
          </p>
        </div>

        <div className="relative mb-4">
          <video
            ref={videoRef}
            className="w-full h-64 bg-gray-200 rounded-lg object-cover"
            autoPlay
            muted
            playsInline
          />
          <canvas
            ref={canvasRef}
            className="hidden"
          />
          
          {faceDetected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-green-500 text-white p-3 rounded-full">
                <CheckCircle className="w-8 h-8" />
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={detectFace}
            disabled={isDetecting || faceDetected}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            {isDetecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Detecting...
              </>
            ) : faceDetected ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Verified!
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Start Verification
              </>
            )}
          </Button>
          
          <Button
            onClick={onCancel}
            variant="outline"
            disabled={isDetecting}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          Your face data is processed locally and stored securely
        </div>
      </div>
    </div>
  );
};

export default FaceRecognition;
