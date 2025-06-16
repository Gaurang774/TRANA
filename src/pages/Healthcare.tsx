
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  MapPin
} from 'lucide-react';

const Healthcare = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Patient Management Dashboard",
      description: "Comprehensive patient records with intelligent insights and streamlined workflows"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Smart Appointment Scheduling",
      description: "AI-powered scheduling that optimizes provider availability and patient preferences"
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Secure Patient Communication",
      description: "HIPAA-compliant messaging system for seamless patient-provider interaction"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Health Analytics & Reporting",
      description: "Advanced analytics to track outcomes and improve operational efficiency"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "HIPAA-Compliant Data Security",
      description: "Enterprise-grade security with 256-bit encryption and SOC 2 certification"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "EHR System Integration",
      description: "Seamless integration with existing electronic health record systems"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      title: "Chief Medical Officer, Metropolitan Health",
      quote: "Trana reduced our administrative overhead by 40% while improving patient satisfaction scores significantly.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      title: "Practice Administrator, Family Care Clinic",
      quote: "The security features and HIPAA compliance gave us complete confidence in managing sensitive patient data.",
      rating: 5
    },
    {
      name: "Dr. Emily Watson",
      title: "Pediatric Specialist, Children's Medical Center",
      quote: "Patient communication has never been easier. Our families love the secure messaging features.",
      rating: 5
    }
  ];

  const trustBadges = [
    { label: "HIPAA Compliant", icon: <Shield className="h-5 w-5" /> },
    { label: "SOC 2 Certified", icon: <CheckCircle className="h-5 w-5" /> },
    { label: "256-bit Encryption", icon: <Lock className="h-5 w-5" /> },
    { label: "99.9% Uptime", icon: <Zap className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50 shadow-sm">
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
              <a href="#features" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Features</a>
              <a href="#testimonials" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Testimonials</a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Contact</a>
              <Button 
                variant="outline" 
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => navigate('/')}
              >
                View Dashboard
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                Trusted by 500+ Healthcare Providers
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Advanced Healthcare 
                <span className="text-blue-600"> Management</span> Made Simple
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Streamline patient care, reduce administrative burden, and improve outcomes with Trana's intelligent healthcare platform designed for modern medical practices.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                  onClick={() => document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Request Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Features
                </Button>
              </div>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                {trustBadges.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                    <div className="text-emerald-600">{badge.icon}</div>
                    <span className="text-sm font-medium text-slate-700">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
                <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">Patient Dashboard</h3>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">Live</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Card className="border-slate-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-600">Total Patients</p>
                            <p className="text-2xl font-bold text-slate-900">1,247</p>
                          </div>
                          <Users className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-slate-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-600">Today's Appointments</p>
                            <p className="text-2xl font-bold text-slate-900">23</p>
                          </div>
                          <Calendar className="h-8 w-8 text-emerald-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">JD</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">John Doe</p>
                          <p className="text-sm text-slate-600">Check-up - 2:30 PM</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-emerald-600 font-semibold">SM</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Sarah Miller</p>
                          <p className="text-sm text-slate-600">Follow-up - 3:00 PM</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800">Confirmed</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need for Modern Healthcare
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive tools designed specifically for healthcare providers to improve patient outcomes and operational efficiency.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6">
                    <div className="text-blue-600">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Trusted by Healthcare Leaders
            </h2>
            <p className="text-xl text-slate-600">
              Join hundreds of healthcare providers who trust Trana with their most critical operations.
            </p>
          </div>
          
          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">40%</div>
              <p className="text-slate-600">Reduction in Administrative Time</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">95%</div>
              <p className="text-slate-600">Patient Satisfaction Score</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
              <p className="text-slate-600">System Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">500+</div>
              <p className="text-slate-600">Healthcare Providers</p>
            </div>
          </div>
          
          {/* Testimonials */}
          <div id="testimonials" className="grid lg:grid-cols-3 gap-8">
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
                Schedule a personalized demo and see how Trana can streamline your operations while improving patient care.
              </p>
              
              <div className="space-y-4">
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
                  <span className="text-slate-700">ROI calculation and implementation timeline</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                  <span className="text-slate-700">HIPAA compliance consultation</span>
                </div>
              </div>
            </div>
            
            <Card className="border-slate-200 shadow-xl">
              <CardContent className="p-8">
                <div id="demo-form">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-6">Request Your Demo</h3>
                  
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Dr. John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Smith"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="john.smith@clinic.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Organization</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Metropolitan Medical Center"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                      <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select your role</option>
                        <option value="physician">Physician</option>
                        <option value="administrator">Administrator</option>
                        <option value="nurse">Nurse</option>
                        <option value="manager">Practice Manager</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Message (Optional)</label>
                      <textarea 
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tell us about your specific needs..."
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg"
                    >
                      Schedule My Demo
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
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
                Empowering healthcare providers with intelligent technology solutions that improve patient outcomes and operational efficiency.
              </p>
              
              <div className="flex flex-wrap gap-4">
                {trustBadges.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-slate-800 px-3 py-2 rounded-lg">
                    <div className="text-emerald-400">{badge.icon}</div>
                    <span className="text-sm text-slate-300">{badge.label}</span>
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
                  <span className="text-slate-300">demo@trana.health</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span className="text-slate-300">Available 24/7 Support</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Compliance & Security</h3>
              <div className="space-y-3">
                <a href="#" className="block text-slate-300 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="block text-slate-300 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="block text-slate-300 hover:text-white transition-colors">HIPAA Compliance</a>
                <a href="#" className="block text-slate-300 hover:text-white transition-colors">Security Audit Results</a>
                <a href="#" className="block text-slate-300 hover:text-white transition-colors">Patient Rights</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 text-center">
            <p className="text-slate-400">
              © 2024 Trana Healthcare Systems. All rights reserved. | SOC 2 Certified | HIPAA Compliant
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Healthcare;
