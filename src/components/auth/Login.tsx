
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, Shield } from 'lucide-react';

interface LoginProps {
  onToggle: () => void;
}

const Login: React.FC<LoginProps> = ({ onToggle }) => {
  const { login, send2FACode } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password, twoFactorCode);
      
      if (result.success) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
          variant: "default"
        });
      } else if (result.requires2FA) {
        setShowTwoFactor(true);
        toast({
          title: "2FA Required",
          description: "Please enter the verification code sent to your email.",
          variant: "default"
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials or 2FA code.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend2FA = async () => {
    if (email) {
      await send2FACode(email);
      toast({
        title: "Code Sent",
        description: "A new verification code has been sent to your email.",
        variant: "default"
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your voting account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="Enter your email"
                  required
                  disabled={showTwoFactor}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="Enter your password"
                  required
                  disabled={showTwoFactor}
                />
              </div>
            </div>

            {showTwoFactor && (
              <div className="space-y-2">
                <Label htmlFor="twoFactorCode">Verification Code</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="twoFactorCode"
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    className="pl-10"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResend2FA}
                  className="text-sm p-0 h-auto"
                >
                  Resend Code
                </Button>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : showTwoFactor ? 'Verify & Sign In' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onToggle}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              Demo Admin: kumaransenthilarasu@gmail.com / SK29@2006 (No 2FA)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
