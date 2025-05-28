
import React from 'react';
import FaceRecognition from './FaceRecognition';

interface FaceVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (faceData?: any) => void;
}

const FaceVerificationModal: React.FC<FaceVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  if (!isOpen) return null;

  const handleVerificationComplete = (faceData: any) => {
    onSuccess(faceData);
  };

  return (
    <FaceRecognition
      onVerificationComplete={handleVerificationComplete}
      onCancel={onClose}
    />
  );
};

export default FaceVerificationModal;
