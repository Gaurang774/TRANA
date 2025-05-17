
import React, { useState } from 'react';
import EmergencyHeader from '@/components/EmergencyHeader';
import EmergencySidebar from '@/components/EmergencySidebar';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Ambulance, Clock, MapPin, Phone, User, MessageSquare, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Emergency = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <EmergencySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <EmergencyHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold">Emergency Response</h1>
                  <div className="ml-3 bg-medical-red/10 text-medical-red px-2 py-1 rounded-md text-sm font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Active Case
                  </div>
                </div>
                <p className="text-gray-500">Incident #E-7823 | Cardiac Arrest</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Button>Resolve Case</Button>
                <Button variant="outline">Transfer Patient</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Emergency Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-bold mb-4">Emergency Details</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="mb-4">
                          <label className="text-sm text-gray-500 block mb-1">Incident Type</label>
                          <div className="font-medium">Cardiac Arrest</div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="text-sm text-gray-500 block mb-1">Location</label>
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                            <div className="font-medium">
                              1234 Main Street<br />
                              Apt 5B<br />
                              Cityville, ST 12345
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="text-sm text-gray-500 block mb-1">Reported By</label>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-gray-500" />
                            <div className="font-medium">John Doe (Spouse)</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="mb-4">
                          <label className="text-sm text-gray-500 block mb-1">Status</label>
                          <div className="bg-medical-red/10 text-medical-red px-3 py-1.5 rounded-md inline-flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            <span className="font-semibold">Critical</span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="text-sm text-gray-500 block mb-1">Time Received</label>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                            <div className="font-medium">Today at 10:24 AM</div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="text-sm text-gray-500 block mb-1">Responding Unit</label>
                          <div className="flex items-center">
                            <Ambulance className="h-4 w-4 mr-2 text-medical-blue" />
                            <div className="font-medium">Ambulance #103</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Description</label>
                      <div className="p-3 bg-gray-50 rounded-md">
                        65-year-old male experiencing severe chest pain and difficulty breathing. Patient has a history of coronary artery disease. Caller reports patient is conscious but in extreme distress. Patient is taking nitroglycerin medication.
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-bold mb-4">Patient Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="mb-4">
                          <label className="text-sm text-gray-500 block mb-1">Patient Name</label>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            <div className="font-medium">Robert Johnson</div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="text-sm text-gray-500 block mb-1">Age / Gender</label>
                          <div className="font-medium">65 / Male</div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="text-sm text-gray-500 block mb-1">Medical History</label>
                          <div className="font-medium">
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Coronary artery disease</li>
                              <li>Type 2 diabetes</li>
                              <li>Hypertension</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="mb-4">
                          <label className="text-sm text-gray-500 block mb-1">Allergies</label>
                          <div className="font-medium">
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Penicillin</li>
                              <li>Shellfish</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="text-sm text-gray-500 block mb-1">Current Medications</label>
                          <div className="font-medium">
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Metformin 500mg</li>
                              <li>Atorvastatin 40mg</li>
                              <li>Lisinopril 20mg</li>
                              <li>Nitroglycerin PRN</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-bold mb-4">Vitals & Assessments</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-50 p-3 rounded-md text-center">
                        <div className="text-gray-500 text-xs mb-1">Heart Rate</div>
                        <div className="text-xl font-bold text-medical-red">123 bpm</div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md text-center">
                        <div className="text-gray-500 text-xs mb-1">Blood Pressure</div>
                        <div className="text-xl font-bold text-medical-yellow">154/95</div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md text-center">
                        <div className="text-gray-500 text-xs mb-1">Oxygen</div>
                        <div className="text-xl font-bold text-medical-red">89%</div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md text-center">
                        <div className="text-gray-500 text-xs mb-1">Temperature</div>
                        <div className="text-xl font-bold text-medical-green">98.6°F</div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="text-sm text-gray-500 block mb-2">Assessment Notes</label>
                      <Textarea 
                        placeholder="Enter patient assessment notes here..." 
                        className="h-32"
                        defaultValue="Patient presenting with acute chest pain radiating to left arm. Diaphoretic, pale, clammy skin. Administered 325mg ASA. Established IV access. 12-lead ECG shows ST elevation in leads II, III, and aVF, consistent with inferior wall MI."
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Update Assessment</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Communications and Updates */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold">ETA to Hospital</h2>
                      <div className="text-xl font-bold text-medical-blue">4 min</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Distance</span>
                        <span className="font-medium">1.2 miles</span>
                      </div>
                      
                      <div className="bg-gray-100 h-2 rounded-full mb-4">
                        <div className="bg-medical-blue h-full rounded-full w-3/4"></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          <span className="font-medium text-medical-blue">Central Hospital</span>
                          <div className="text-xs">Cardiac unit notified</div>
                        </div>
                        <Button variant="outline" size="sm">Route Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-0">
                    <div className="p-4 border-b">
                      <h2 className="text-lg font-bold">Communication Log</h2>
                    </div>
                    
                    <div className="max-h-[400px] overflow-y-auto p-4">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center mb-1">
                            <div className="h-8 w-8 bg-medical-blue rounded-full flex items-center justify-center text-white text-xs font-bold">
                              A3
                            </div>
                            <div className="ml-2">
                              <div className="font-medium">Ambulance Crew</div>
                              <div className="text-xs text-gray-500">10:26 AM</div>
                            </div>
                          </div>
                          
                          <div className="bg-medical-blue/5 rounded-lg p-3 ml-10">
                            Patient secured. Beginning transport to Central Hospital.
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-end mb-1">
                            <div className="mr-2 text-right">
                              <div className="font-medium">Dispatch</div>
                              <div className="text-xs text-gray-500">10:27 AM</div>
                            </div>
                            <div className="h-8 w-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              DS
                            </div>
                          </div>
                          
                          <div className="bg-gray-100 rounded-lg p-3 mr-10 ml-auto max-w-xs">
                            Confirming transport. Central Hospital notified and prepared for arrival.
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center mb-1">
                            <div className="h-8 w-8 bg-medical-green rounded-full flex items-center justify-center text-white text-xs font-bold">
                              CH
                            </div>
                            <div className="ml-2">
                              <div className="font-medium">Central Hospital</div>
                              <div className="text-xs text-gray-500">10:28 AM</div>
                            </div>
                          </div>
                          
                          <div className="bg-medical-green/5 rounded-lg p-3 ml-10">
                            Cardiac team standing by in ER Bay 3. Please confirm estimated arrival time.
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center mb-1">
                            <div className="h-8 w-8 bg-medical-blue rounded-full flex items-center justify-center text-white text-xs font-bold">
                              A3
                            </div>
                            <div className="ml-2">
                              <div className="font-medium">Ambulance Crew</div>
                              <div className="text-xs text-gray-500">10:29 AM</div>
                            </div>
                          </div>
                          
                          <div className="bg-medical-blue/5 rounded-lg p-3 ml-10">
                            ETA 4 minutes. Patient condition remains critical but stable. Oxygen levels at 89%, maintaining IV access.
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border-t">
                      <div className="flex">
                        <Input placeholder="Type a message..." className="flex-1" />
                        <Button className="ml-2" size="icon">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-bold mb-4">Hospital Preparation</h2>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-2 w-2 bg-medical-green rounded-full mr-2"></div>
                          <span>Cardiac Team Notified</span>
                        </div>
                        <span className="text-xs text-gray-500">10:26 AM</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-2 w-2 bg-medical-green rounded-full mr-2"></div>
                          <span>Catheterization Lab Prepped</span>
                        </div>
                        <span className="text-xs text-gray-500">10:27 AM</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-2 w-2 bg-medical-green rounded-full mr-2"></div>
                          <span>ER Bay 3 Reserved</span>
                        </div>
                        <span className="text-xs text-gray-500">10:28 AM</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-2 w-2 bg-medical-yellow rounded-full mr-2"></div>
                          <span>Critical Care Unit Bed Reserved</span>
                        </div>
                        <span className="text-xs text-gray-500">Pending</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Emergency;
