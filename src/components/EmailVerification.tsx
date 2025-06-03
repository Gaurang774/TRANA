
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const EmailVerification = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailVerification = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (token && type === 'signup') {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          });

          if (error) {
            setVerificationStatus('error');
            setMessage('The verification link is invalid or has expired. Please request a new verification email.');
          } else {
            setVerificationStatus('success');
            setMessage('Your email has been successfully verified! You can now access the application.');
            toast({
              title: "Email verified successfully",
              description: "Welcome! Your account is now active.",
            });
            
            // Redirect to main page after 3 seconds
            setTimeout(() => {
              navigate('/');
            }, 3000);
          }
        } catch (error: any) {
          setVerificationStatus('error');
          setMessage('An unexpected error occurred during verification.');
        }
      } else {
        setVerificationStatus('pending');
        setMessage('Please check your email for the verification link.');
      }
    };

    handleEmailVerification();
  }, [searchParams, navigate, toast]);

  const goToRegister = () => {
    navigate('/register');
  };

  const goToApp = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-6">
            <div className="h-12 w-12 bg-medical-blue rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">ER</span>
            </div>
            <h1 className="text-2xl font-bold ml-3 text-medical-blue">
              MediEmergency
            </h1>
          </div>
          <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
          <CardDescription className="text-center">
            Verify your email address to activate your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationStatus === 'loading' && (
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-medical-blue" />
              <p className="text-gray-600">Verifying your email...</p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <Alert className="mb-4 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  {message}
                </AlertDescription>
              </Alert>
              <p className="text-sm text-gray-600 mb-4">
                Redirecting to the application in a few seconds...
              </p>
              <Button
                onClick={goToApp}
                className="w-full bg-medical-blue hover:bg-medical-blue/90"
              >
                Continue to Application
              </Button>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <Alert variant="destructive" className="mb-4">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <Button
                onClick={goToRegister}
                className="w-full bg-medical-blue hover:bg-medical-blue/90"
              >
                <Mail className="h-4 w-4 mr-2" />
                Get New Verification Email
              </Button>
            </div>
          )}

          {verificationStatus === 'pending' && (
            <div className="text-center">
              <Mail className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <Alert className="mb-4 border-blue-200 bg-blue-50">
                <Mail className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  {message}
                </AlertDescription>
              </Alert>
              <Button
                onClick={goToRegister}
                className="w-full bg-medical-blue hover:bg-medical-blue/90"
              >
                Back to Registration
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
