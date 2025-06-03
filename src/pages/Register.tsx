
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { User, Key, UserIcon, AlertTriangle, Stethoscope, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states for different user types
  const [doctorData, setDoctorData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    department: '',
    specialty: ''
  });

  const [patientData, setPatientData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const [adminData, setAdminData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    department: ''
  });

  const handleDoctorRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!doctorData.email || !doctorData.password || !doctorData.firstName || !doctorData.lastName) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(
      doctorData.email, 
      doctorData.password, 
      'doctor',
      doctorData.firstName,
      doctorData.lastName
    );

    setIsLoading(false);
    
    if (error) {
      setError(error.message);
    } else {
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
      });
      navigate('/login');
    }
  };

  const handlePatientRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!patientData.email || !patientData.password || !patientData.firstName || !patientData.lastName) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(
      patientData.email, 
      patientData.password, 
      'patient',
      patientData.firstName,
      patientData.lastName
    );

    setIsLoading(false);
    
    if (error) {
      setError(error.message);
    } else {
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
      });
      navigate('/login');
    }
  };

  const handleAdminRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!adminData.email || !adminData.password || !adminData.firstName || !adminData.lastName) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(
      adminData.email, 
      adminData.password, 
      'admin',
      adminData.firstName,
      adminData.lastName
    );

    setIsLoading(false);
    
    if (error) {
      setError(error.message);
    } else {
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
      });
      navigate('/login');
    }
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
          <CardTitle className="text-2xl text-center">Create your account</CardTitle>
          <CardDescription className="text-center">
            Select your account type and fill in your details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="patient" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="patient">
                <User className="h-4 w-4 mr-2" />
                Patient
              </TabsTrigger>
              <TabsTrigger value="doctor">
                <Stethoscope className="h-4 w-4 mr-2" />
                Doctor
              </TabsTrigger>
              <TabsTrigger value="admin">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="patient">
              <form onSubmit={handlePatientRegister}>
                <div className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-firstName">First Name</Label>
                      <Input
                        id="patient-firstName"
                        placeholder="John"
                        value={patientData.firstName}
                        onChange={(e) => setPatientData({ ...patientData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patient-lastName">Last Name</Label>
                      <Input
                        id="patient-lastName"
                        placeholder="Doe"
                        value={patientData.lastName}
                        onChange={(e) => setPatientData({ ...patientData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-email">Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="patient-email"
                        type="email"
                        placeholder="patient@example.com"
                        className="pl-10"
                        value={patientData.email}
                        onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-password">Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="patient-password"
                        type="password"
                        className="pl-10"
                        value={patientData.password}
                        onChange={(e) => setPatientData({ ...patientData, password: e.target.value })}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full mt-6 bg-medical-green hover:bg-medical-green/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Register as Patient"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="doctor">
              <form onSubmit={handleDoctorRegister}>
                <div className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor-firstName">First Name</Label>
                      <Input
                        id="doctor-firstName"
                        placeholder="Dr. Jane"
                        value={doctorData.firstName}
                        onChange={(e) => setDoctorData({ ...doctorData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor-lastName">Last Name</Label>
                      <Input
                        id="doctor-lastName"
                        placeholder="Smith"
                        value={doctorData.lastName}
                        onChange={(e) => setDoctorData({ ...doctorData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-email">Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="doctor-email"
                        type="email"
                        placeholder="doctor@hospital.com"
                        className="pl-10"
                        value={doctorData.email}
                        onChange={(e) => setDoctorData({ ...doctorData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-password">Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="doctor-password"
                        type="password"
                        className="pl-10"
                        value={doctorData.password}
                        onChange={(e) => setDoctorData({ ...doctorData, password: e.target.value })}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-department">Department (Optional)</Label>
                    <Input
                      id="doctor-department"
                      placeholder="Emergency Medicine"
                      value={doctorData.department}
                      onChange={(e) => setDoctorData({ ...doctorData, department: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-specialty">Specialty (Optional)</Label>
                    <Input
                      id="doctor-specialty"
                      placeholder="Cardiology"
                      value={doctorData.specialty}
                      onChange={(e) => setDoctorData({ ...doctorData, specialty: e.target.value })}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full mt-6 bg-medical-blue hover:bg-medical-blue/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Register as Doctor"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={handleAdminRegister}>
                <div className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-firstName">First Name</Label>
                      <Input
                        id="admin-firstName"
                        placeholder="Admin"
                        value={adminData.firstName}
                        onChange={(e) => setAdminData({ ...adminData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-lastName">Last Name</Label>
                      <Input
                        id="admin-lastName"
                        placeholder="User"
                        value={adminData.lastName}
                        onChange={(e) => setAdminData({ ...adminData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@hospital.com"
                        className="pl-10"
                        value={adminData.email}
                        onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-password"
                        type="password"
                        className="pl-10"
                        value={adminData.password}
                        onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-department">Department (Optional)</Label>
                    <Input
                      id="admin-department"
                      placeholder="Administration"
                      value={adminData.department}
                      onChange={(e) => setAdminData({ ...adminData, department: e.target.value })}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full mt-6 bg-red-600 hover:bg-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Register as Admin"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-medical-blue hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
