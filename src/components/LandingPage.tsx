
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Shield, 
  Users, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Lock, 
  Zap,
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Activity,
  Stethoscope,
  UserCheck,
  Clock,
  Database,
  Globe,
  Award
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const solutions = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Patient Management",
      description: "Comprehensive electronic health records with intelligent patient tracking and care coordination."
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Smart Scheduling",
      description: "AI-powered appointment scheduling that optimizes provider availability and patient preferences."
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Secure Communication",
      description: "HIPAA-compliant messaging platform for seamless patient-provider interaction."
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Health Analytics",
      description: "Advanced analytics dashboard for tracking outcomes and operational efficiency."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Data Security",
      description: "Enterprise-grade security with 256-bit encryption and SOC 2 Type II certification."
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: "Emergency Coordination",
      description: "Real-time emergency medical services with intelligent triage and resource allocation."
    }
  ];

  const features = [
    {
      category: "Clinical Excellence",
      items: [
        "Electronic Health Records (EHR)",
        "Clinical Decision Support",
        "Medication Management",
        "Lab Results Integration",
        "Imaging System Integration"
      ]
    },
    {
      category: "Operational Efficiency",
      items: [
        "Automated Scheduling",
        "Revenue Cycle Management",
        "Inventory Management",
        "Staff Scheduling",
        "Reporting & Analytics"
      ]
    },
    {
      category: "Patient Engagement",
      items: [
        "Patient Portal",
        "Telemedicine Integration",
        "Mobile Health Apps",
        "Appointment Reminders",
        "Health Education Resources"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      title: "Chief Medical Officer, Metropolitan Health",
      quote: "Trana reduced our administrative overhead by 40% while improving patient satisfaction scores significantly.",
      rating: 5,
      specialty: "Internal Medicine"
    },
    {
      name: "Michael Rodriguez",
      title: "Practice Administrator, Family Care Clinic",
      quote: "The security features and HIPAA compliance gave us complete confidence in managing sensitive patient data.",
      rating: 5,
      specialty: "Practice Management"
    },
    {
      name: "Dr. Emily Watson",
      title: "Emergency Medicine Director",
      quote: "The emergency coordination features have transformed our response times and patient outcomes.",
      rating: 5,
      specialty: "Emergency Medicine"
    }
  ];

  const certifications = [
    { label: "HIPAA Compliant", icon: <Shield className="h-5 w-5" /> },
    { label: "SOC 2 Type II", icon: <CheckCircle className="h-5 w-5" /> },
    { label: "FDA Cleared", icon: <Award className="h-5 w-5" /> },
    { label: "ISO 27001", icon: <Lock className="h-5 w-5" /> },
    { label: "HL7 FHIR", icon: <Database className="h-5 w-5" /> },
    { label: "99.9% Uptime", icon: <Zap className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Professional Header */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Trana</h1>
                <p className="text-xs text-slate-600 font-medium">Smart Healthcare System</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#solutions" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Solutions</a>
              <a href="#features" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Features</a>
              <a href="#testimonials" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Testimonials</a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Contact</a>
              <Button 
                variant="outline" 
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => navigate('/')}
              >
                <Globe className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Request Demo
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-emerald-600/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
              Trusted by 500+ Healthcare Providers Worldwide
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight mb-8">
              The Future of
              <span className="text-blue-600 block">Healthcare Management</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-4xl mx-auto">
              Comprehensive healthcare platform that streamlines clinical workflows, enhances patient care, 
              and drives operational excellence through intelligent automation and data-driven insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                onClick={() => document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Stethoscope className="mr-2 h-5 w-5" />
                Schedule Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg"
                onClick={() => navigate('/')}
              >
                <Activity className="mr-2 h-5 w-5" />
                View Live Demo
              </Button>
            </div>
            
            {/* Certifications */}
            <div className="flex flex-wrap gap-4 justify-center">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                  <div className="text-emerald-600">{cert.icon}</div>
                  <span className="text-sm font-medium text-slate-700">{cert.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Integrated platform designed to address every aspect of modern healthcare delivery.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <Card key={index} className="border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6">
                    <div className="text-blue-600">{solution.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">{solution.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{solution.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Tabs Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Complete Healthcare Platform Features
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need to deliver exceptional patient care and operational excellence.
            </p>
          </div>
          
          <Tabs defaultValue="clinical" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
              <TabsTrigger value="clinical" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Clinical Excellence
              </TabsTrigger>
              <TabsTrigger value="operational" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Operational Efficiency
              </TabsTrigger>
              <TabsTrigger value="patient" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Patient Engagement
              </TabsTrigger>
            </TabsList>
            
            {features.map((feature, index) => (
              <TabsContent 
                key={index} 
                value={index === 0 ? 'clinical' : index === 1 ? 'operational' : 'patient'}
                className="mt-8"
              >
                <Card className="border-slate-200">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <h3 className="text-2xl font-semibold text-slate-900 mb-6">{feature.category}</h3>
                        <div className="space-y-4">
                          {feature.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                              <span className="text-slate-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-8">
                        <div className="w-full h-64 bg-white rounded-xl shadow-sm flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                              {index === 0 ? <Stethoscope className="h-8 w-8 text-blue-600" /> :
                               index === 1 ? <BarChart3 className="h-8 w-8 text-blue-600" /> :
                               <UserCheck className="h-8 w-8 text-blue-600" />}
                            </div>
                            <p className="text-slate-600 font-medium">{feature.category} Dashboard</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Proven Results Across Healthcare Organizations
            </h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">40%</div>
              <p className="text-slate-600">Reduction in Administrative Time</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">95%</div>
              <p className="text-slate-600">Patient Satisfaction Score</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">25%</div>
              <p className="text-slate-600">Improvement in Care Quality</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">500+</div>
              <p className="text-slate-600">Healthcare Providers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Trusted by Healthcare Leaders
            </h2>
            <p className="text-xl text-slate-600">
              See what medical professionals are saying about Trana.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-slate-200 bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-slate-700 mb-6 italic leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.title}</div>
                    <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800">
                      {testimonial.specialty}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Request Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                Ready to Transform Your Healthcare Practice?
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Schedule a personalized demonstration and discover how Trana can enhance your clinical workflows and patient outcomes.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                  <span className="text-slate-700">30-minute personalized demonstration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                  <span className="text-slate-700">Custom workflow analysis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                  <span className="text-slate-700">ROI calculation and implementation plan</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                  <span className="text-slate-700">HIPAA compliance consultation</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-slate-600">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Available 24/7</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>HIPAA Secure</span>
                </div>
              </div>
            </div>
            
            <Card className="border-slate-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-900">Request Your Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <div id="demo-form">
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Dr. John"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Smith"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                      <input 
                        type="email" 
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="john.smith@clinic.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                      <input 
                        type="tel" 
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Organization *</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Metropolitan Medical Center"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Role *</label>
                      <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                        <option value="">Select your role</option>
                        <option value="physician">Physician</option>
                        <option value="administrator">Administrator</option>
                        <option value="nurse">Nurse</option>
                        <option value="manager">Practice Manager</option>
                        <option value="executive">Executive</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Organization Size</label>
                      <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select organization size</option>
                        <option value="small">1-50 employees</option>
                        <option value="medium">51-200 employees</option>
                        <option value="large">201-1000 employees</option>
                        <option value="enterprise">1000+ employees</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Areas of Interest</label>
                      <textarea 
                        rows={3}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tell us about your specific needs and challenges..."
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg"
                    >
                      Schedule My Demo
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    
                    <p className="text-xs text-slate-500 text-center">
                      By submitting this form, you agree to our privacy policy and terms of service.
                    </p>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Trana</h1>
                  <p className="text-sm text-slate-400">Smart Healthcare System</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6 leading-relaxed">
                Empowering healthcare providers with intelligent technology solutions that improve patient outcomes, 
                enhance operational efficiency, and ensure the highest standards of medical care.
              </p>
              
              <div className="flex flex-wrap gap-4">
                {certifications.slice(0, 4).map((cert, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-slate-800 px-3 py-2 rounded-lg">
                    <div className="text-emerald-400">{cert.icon}</div>
                    <span className="text-sm text-slate-300">{cert.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <span className="text-slate-300">1-800-TRANA-01</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <span className="text-slate-300">contact@trana.health</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span className="text-slate-300">Enterprise Support Available</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <span className="text-slate-300">24/7 Technical Support</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Legal & Compliance</h3>
              <div className="space-y-3">
                <a href="#" className="block text-slate-300 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="block text-slate-300 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="block text-slate-300 hover:text-white transition-colors">HIPAA Compliance</a>
                <a href="#" className="block text-slate-300 hover:text-white transition-colors">Security Documentation</a>
                <a href="#" className="block text-slate-300 hover:text-white transition-colors">Patient Rights</a>
                <a href="#" className="block text-slate-300 hover:text-white transition-colors">Accessibility Statement</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 mb-4 md:mb-0">
                © 2024 Trana Healthcare Systems. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-slate-400">
                <span>SOC 2 Type II Certified</span>
                <span>|</span>
                <span>HIPAA Compliant</span>
                <span>|</span>
                <span>ISO 27001 Certified</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
