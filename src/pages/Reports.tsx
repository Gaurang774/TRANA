
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, Download, Upload, File, FilePlus, Search, 
  RefreshCw, Trash2, Filter, Calendar, User
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Reports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [patientFiles, setPatientFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedPatientId, setSelectedPatientId] = useState('PAT-001');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterType, setFilterType] = useState('all');

  // Sample data - would be replaced with real data from Supabase
  const demoReports = [
    { id: 'rep-001', title: 'Monthly Emergency Summary', date: '2023-05-15', type: 'Summary', status: 'Complete' },
    { id: 'rep-002', title: 'Ambulance Response Times', date: '2023-05-10', type: 'Analysis', status: 'Complete' },
    { id: 'rep-003', title: 'Hospital Bed Occupancy', date: '2023-05-20', type: 'Dashboard', status: 'Processing' },
    { id: 'rep-004', title: 'Critical Care Statistics', date: '2023-05-18', type: 'Analytics', status: 'Complete' },
    { id: 'rep-005', title: 'Emergency Response Outcomes', date: '2023-05-05', type: 'Summary', status: 'Complete' },
  ];

  const demoPatientFiles = [
    { id: 'file-001', name: 'Rajesh Sharma Medical History', patientId: 'PAT-001', date: '2023-04-10', type: 'Medical Record', size: '2.4 MB' },
    { id: 'file-002', name: 'Priya Patel Lab Results', patientId: 'PAT-002', date: '2023-05-05', type: 'Lab Report', size: '1.8 MB' },
    { id: 'file-003', name: 'Arjun Singh X-Ray Results', patientId: 'PAT-003', date: '2023-05-12', type: 'Imaging', size: '5.2 MB' },
    { id: 'file-004', name: 'Neha Gupta Treatment Plan', patientId: 'PAT-004', date: '2023-05-18', type: 'Treatment', size: '1.1 MB' },
    { id: 'file-005', name: 'Vikram Reddy Follow-up Notes', patientId: 'PAT-005', date: '2023-05-20', type: 'Notes', size: '0.8 MB' },
  ];

  // Patient sample data with Indian names
  const patients = [
    { id: 'PAT-001', name: 'Rajesh Sharma', age: 45 },
    { id: 'PAT-002', name: 'Priya Patel', age: 32 },
    { id: 'PAT-003', name: 'Arjun Singh', age: 28 },
    { id: 'PAT-004', name: 'Neha Gupta', age: 52 },
    { id: 'PAT-005', name: 'Vikram Reddy', age: 64 },
  ];

  useEffect(() => {
    // This would fetch real data from Supabase in a production environment
    setReports(demoReports);
    setPatientFiles(demoPatientFiles);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    
    // Simulate fetching data
    setTimeout(() => {
      setReports(demoReports);
      setPatientFiles(demoPatientFiles);
      setLoading(false);
    }, 1000);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (activeTab === 'reports') {
      const filteredReports = demoReports.filter(report => 
        report.title.toLowerCase().includes(query.toLowerCase()) || 
        report.type.toLowerCase().includes(query.toLowerCase())
      );
      setReports(filteredReports);
    } else {
      const filteredFiles = demoPatientFiles.filter(file => 
        file.name.toLowerCase().includes(query.toLowerCase()) || 
        file.patientId.toLowerCase().includes(query.toLowerCase()) ||
        file.type.toLowerCase().includes(query.toLowerCase())
      );
      setPatientFiles(filteredFiles);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile || !selectedPatientId) {
      toast({
        title: "Upload Error",
        description: "Please select a file and patient ID",
        variant: "destructive",
      });
      return;
    }
    
    // Show progress simulation
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // In a real implementation, this would use the Supabase edge function
        // to upload the file and store metadata
        
        // Add the uploaded file to the list
        const newFile = {
          id: `file-${Date.now()}`,
          name: selectedFile.name,
          patientId: selectedPatientId,
          date: new Date().toISOString().split('T')[0],
          type: getFileType(selectedFile.name),
          size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
        };
        
        setPatientFiles([newFile, ...patientFiles]);
        setSelectedFile(null);
        setUploadProgress(0);
        
        toast({
          title: "File Uploaded",
          description: `${selectedFile.name} has been successfully uploaded for patient ${selectedPatientId}`,
        });
      }
    }, 300);
  };

  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'Image';
    if (['pdf'].includes(extension)) return 'Document';
    if (['doc', 'docx'].includes(extension)) return 'Medical Record';
    if (['xls', 'xlsx', 'csv'].includes(extension)) return 'Lab Report';
    return 'Other';
  };

  const downloadFile = (fileId) => {
    // In a real app, this would get the file from Supabase storage
    const file = patientFiles.find(f => f.id === fileId);
    if (file) {
      toast({
        title: "Download Started",
        description: `Downloading ${file.name}`,
      });
    }
  };

  const deleteFile = (fileId) => {
    // In a real app, this would delete the file from Supabase storage
    const updatedFiles = patientFiles.filter(file => file.id !== fileId);
    setPatientFiles(updatedFiles);
    
    toast({
      title: "File Deleted",
      description: "The file has been removed",
    });
  };

  const sortedPatientFiles = [...patientFiles].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'size') {
      // Convert '2.4 MB' to number for comparison
      const getSizeInMB = (sizeStr) => {
        const match = sizeStr.match(/(\d+\.?\d*)/);
        return match ? parseFloat(match[0]) : 0;
      };
      
      const sizeA = getSizeInMB(a.size);
      const sizeB = getSizeInMB(b.size);
      return sortOrder === 'asc' ? sizeA - sizeB : sizeB - sizeA;
    }
    return 0;
  }).filter(file => {
    if (filterType === 'all') return true;
    return file.type.toLowerCase().includes(filterType.toLowerCase());
  });

  const sortedReports = [...reports].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortBy === 'title') {
      return sortOrder === 'asc' 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title);
    }
    return 0;
  });

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reports & Documents</h1>
          <p className="text-gray-500">Access patient files and system reports</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm">
            <FilePlus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <Tabs 
            defaultValue="reports" 
            value={activeTab} 
            onValueChange={(value) => {
              setActiveTab(value);
              setSearchQuery('');
            }}
          >
            <CardHeader className="pb-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <TabsList>
                  <TabsTrigger value="reports">
                    <FileText className="mr-2 h-4 w-4" />
                    System Reports
                  </TabsTrigger>
                  <TabsTrigger value="patient-files">
                    <File className="mr-2 h-4 w-4" />
                    Patient Files
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      className="pl-9 h-9 w-[200px]"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <select 
                      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="date">Sort by Date</option>
                      {activeTab === 'reports' ? (
                        <option value="title">Sort by Title</option>
                      ) : (
                        <>
                          <option value="name">Sort by Name</option>
                          <option value="size">Sort by Size</option>
                        </>
                      )}
                    </select>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <TabsContent value="reports">
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="py-3 px-4 text-left font-medium text-gray-500">Report ID</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-500">Title</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-500">Date</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-500">Type</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-500">Status</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedReports.map((report) => (
                          <tr key={report.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm">{report.id}</td>
                            <td className="py-3 px-4 text-sm font-medium">{report.title}</td>
                            <td className="py-3 px-4 text-sm">{report.date}</td>
                            <td className="py-3 px-4 text-sm">{report.type}</td>
                            <td className="py-3 px-4 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                report.status === 'Complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {report.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => downloadFile(report.id)}>
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="patient-files">
                <div className="space-y-6">
                  <Card className="border p-4">
                    <form onSubmit={handleFileUpload} className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex-grow">
                          <Input 
                            type="file" 
                            id="file-upload" 
                            onChange={handleFileChange}
                            className="cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <select 
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                            value={selectedPatientId}
                            onChange={(e) => setSelectedPatientId(e.target.value)}
                          >
                            {patients.map(patient => (
                              <option key={patient.id} value={patient.id}>
                                {patient.name} ({patient.id})
                              </option>
                            ))}
                          </select>
                          <Button type="submit" disabled={!selectedFile}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                        </div>
                      </div>
                      
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div>
                          <div className="h-2 bg-gray-200 rounded-full mt-1.5">
                            <div 
                              className="h-2 bg-medical-blue rounded-full" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
                        </div>
                      )}
                    </form>
                  </Card>

                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-sm font-medium">Filter by type:</span>
                    <Button 
                      variant={filterType === 'all' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setFilterType('all')}
                    >
                      All
                    </Button>
                    <Button 
                      variant={filterType === 'medical' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setFilterType('medical')}
                    >
                      Medical Records
                    </Button>
                    <Button 
                      variant={filterType === 'lab' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setFilterType('lab')}
                    >
                      Lab Reports
                    </Button>
                    <Button 
                      variant={filterType === 'imaging' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setFilterType('imaging')}
                    >
                      Imaging
                    </Button>
                  </div>

                  <div className="rounded-md border">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="py-3 px-4 text-left font-medium text-gray-500">Name</th>
                            <th className="py-3 px-4 text-left font-medium text-gray-500">Patient ID</th>
                            <th className="py-3 px-4 text-left font-medium text-gray-500">Date</th>
                            <th className="py-3 px-4 text-left font-medium text-gray-500">Type</th>
                            <th className="py-3 px-4 text-left font-medium text-gray-500">Size</th>
                            <th className="py-3 px-4 text-left font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedPatientFiles.map((file) => (
                            <tr key={file.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm font-medium">{file.name}</td>
                              <td className="py-3 px-4 text-sm">{file.patientId}</td>
                              <td className="py-3 px-4 text-sm">{file.date}</td>
                              <td className="py-3 px-4 text-sm">{file.type}</td>
                              <td className="py-3 px-4 text-sm">{file.size}</td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm" onClick={() => downloadFile(file.id)}>
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => deleteFile(file.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;
