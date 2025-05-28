
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Vote, Shield, Users, CheckCircle, Lock, Clock } from 'lucide-react';

interface HomePageProps {
  onShowLogin: () => void;
  onShowRegister: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onShowLogin, onShowRegister }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                VoteSecure
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onShowLogin}>
                Sign In
              </Button>
              <Button 
                onClick={onShowRegister}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Secure Digital Voting
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience the future of democracy with our blockchain-secured voting platform. 
              Featuring advanced face recognition, real-time results, and tamper-proof security.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button 
                size="lg"
                onClick={onShowRegister}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-3"
              >
                Start Voting Now
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={onShowLogin}
                className="text-lg px-8 py-3"
              >
                Sign In
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold">Secure & Verified</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600">
                  Advanced face recognition and blockchain technology ensure every vote is secure and verified.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold">Real-time Results</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600">
                  Watch election results update in real-time with complete transparency and accuracy.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-semibold">Easy to Use</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600">
                  Intuitive interface designed for voters, candidates, and administrators alike.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* How it Works */}
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-12">How VoteSecure Works</h3>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  1
                </div>
                <h4 className="font-semibold mb-2">Register</h4>
                <p className="text-gray-600 text-sm">Create your secure voting account</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  2
                </div>
                <h4 className="font-semibold mb-2">Verify</h4>
                <p className="text-gray-600 text-sm">Complete face verification for security</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  3
                </div>
                <h4 className="font-semibold mb-2">Vote</h4>
                <p className="text-gray-600 text-sm">Cast your vote in active elections</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  4
                </div>
                <h4 className="font-semibold mb-2">Results</h4>
                <p className="text-gray-600 text-sm">View real-time election results</p>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-12 text-center">
              <Lock className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h3 className="text-3xl font-bold mb-4">Bank-Level Security</h3>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Your vote is protected by advanced encryption, face recognition technology, 
                and blockchain verification to ensure complete security and privacy.
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm opacity-75">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>End-to-End Encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Face Recognition</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Blockchain Verified</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Demo Admin Info */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <Shield className="w-5 h-5 text-red-600" />
                <span>Demo Admin Access</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                For demonstration purposes, use the admin account:
              </p>
              <div className="bg-gray-100 p-3 rounded-lg text-sm">
                <div><strong>Email:</strong> kumaransenthilarasu@gmail.com</div>
                <div><strong>Password:</strong> SK29@2006</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Admin login bypasses 2FA verification
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Vote className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-gray-900">VoteSecure</span>
          </div>
          <p className="text-gray-600 text-sm">
            Empowering democracy through secure digital voting technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
