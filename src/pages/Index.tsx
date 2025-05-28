
import React, { useState } from 'react';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import AdminDashboard from '../components/admin/AdminDashboard';
import VoterDashboard from '../components/voter/VoterDashboard';
import CandidateDashboard from '../components/candidate/CandidateDashboard';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ElectionProvider } from '../contexts/ElectionContext';
import Navbar from '../components/layout/Navbar';
import { Toaster } from '@/components/ui/toaster';

const AppContent = () => {
  const { user, isAuthenticated } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          {showRegister ? (
            <Register onToggle={() => setShowRegister(false)} />
          ) : (
            <Login onToggle={() => setShowRegister(true)} />
          )}
        </div>
      </div>
    );
  }

  return (
    <ElectionProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-16">
          {user?.role === 'admin' && <AdminDashboard />}
          {user?.role === 'voter' && <VoterDashboard />}
          {user?.role === 'candidate' && <CandidateDashboard />}
        </main>
      </div>
    </ElectionProvider>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
};

export default Index;
