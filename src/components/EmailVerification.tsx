
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
            setMessage(error.message);
          } else {
            setVerificationStatus('success');
            setMessage('Your email has been successfully verified! You can now log in.');
            toast({
              title: "Email verified successfully",
              description: "Welcome! Your account is now active.",
            });
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
              navigate('/login');
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

  const resendVerification = async () => {
    // This would need the user's email, which we don't have in this context
    toast({
      title: "Resend verification",
      description: "Please go back to the registration page to resend verification email.",
    });
    navigate('/register');
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
            Verifying your email address
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
              <Alert className="mb-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-700">
                  {message}
                </AlertDescription>
              </Alert>
              <p className="text-sm text-gray-600">
                Redirecting to login page in a few seconds...
              </p>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <Alert variant="destructive" className="mb-4">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Button
                  onClick={resendVerification}
                  className="w-full bg-medical-blue hover:bg-medical-blue/90"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Resend Verification Email
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  Go to Login
                </Button>
              </div>
            </div>
          )}

          {verificationStatus === 'pending' && (
            <div className="text-center">
              <Mail className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <Alert className="mb-4">
                <Mail className="h-4 w-4" />
                <AlertDescription className="text-blue-700">
                  {message}
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Button
                  onClick={resendVerification}
                  className="w-full bg-medical-blue hover:bg-medical-blue/90"
                >
                  Resend Verification Email
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/register')}
                  className="w-full"
                >
                  Back to Registration
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
