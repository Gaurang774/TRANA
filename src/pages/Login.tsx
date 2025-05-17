
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { User, Key, User as UserIcon, AlertTriangle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [doctorEmail, setDoctorEmail] = useState('');
  const [doctorPassword, setDoctorPassword] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPassword, setPatientPassword] = useState('');

  const handleDoctorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      // Demo login - in a real app, you'd verify credentials with a backend
      if (doctorEmail && doctorPassword) {
        localStorage.setItem('userType', 'doctor');
        localStorage.setItem('userEmail', doctorEmail);
        toast({
          title: "Login successful",
          description: "Welcome back, Doctor!",
        });
        navigate('/');
      } else {
        setError('Please enter both email and password');
      }
    }, 1000);
  };

  const handlePatientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      // Demo login - in a real app, you'd verify credentials with a backend
      if (patientEmail && patientPassword) {
        localStorage.setItem('userType', 'patient');
        localStorage.setItem('userEmail', patientEmail);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate('/');
      } else {
        setError('Please enter both email and password');
      }
    }, 1000);
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
          <CardTitle className="text-2xl text-center">Log in to your account</CardTitle>
          <CardDescription className="text-center">
            Select your account type and enter your credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="doctor" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="doctor">
                <UserIcon className="h-4 w-4 mr-2" />
                Doctor
              </TabsTrigger>
              <TabsTrigger value="patient">
                <User className="h-4 w-4 mr-2" />
                Patient
              </TabsTrigger>
            </TabsList>

            <TabsContent value="doctor">
              <form onSubmit={handleDoctorLogin}>
                <div className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="doctor-email">Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="doctor-email"
                        placeholder="doctor@hospital.com"
                        className="pl-10"
                        value={doctorEmail}
                        onChange={(e) => setDoctorEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="doctor-password">Password</Label>
                      <a href="#" className="text-sm text-medical-blue hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="doctor-password"
                        type="password"
                        className="pl-10"
                        value={doctorPassword}
                        onChange={(e) => setDoctorPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full mt-6 bg-medical-blue hover:bg-medical-blue/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Log in as Doctor"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="patient">
              <form onSubmit={handlePatientLogin}>
                <div className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="patient-email">Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="patient-email" 
                        placeholder="patient@example.com"
                        className="pl-10"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="patient-password">Password</Label>
                      <a href="#" className="text-sm text-medical-blue hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="patient-password"
                        type="password"
                        className="pl-10"
                        value={patientPassword}
                        onChange={(e) => setPatientPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full mt-6 bg-medical-green hover:bg-medical-green/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Log in as Patient"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <a href="#" className="text-medical-blue hover:underline">
                Register here
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
