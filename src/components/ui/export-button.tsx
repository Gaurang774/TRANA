
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Calendar } from 'lucide-react';
import { useDataExport, type ExportOptions } from '@/hooks/useDataExport';

interface ExportButtonProps {
  dataType: 'emergencies' | 'ambulances' | 'hospital_beds';
  label?: string;
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  dataType, 
  label = 'Export Data',
  className = '' 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    }
  });

  const { isExporting, exportEmergencies, exportAmbulances, exportHospitalBeds } = useDataExport();

  const handleExport = async () => {
    try {
      switch (dataType) {
        case 'emergencies':
          await exportEmergencies(exportOptions);
          break;
        case 'ambulances':
          await exportAmbulances(exportOptions);
          break;
        case 'hospital_beds':
          await exportHospitalBeds(exportOptions);
          break;
      }
      setShowModal(false);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setShowModal(true)}
        className={className}
        disabled={isExporting}
      >
        <Download className="h-4 w-4 mr-2" />
        {isExporting ? 'Exporting...' : label}
      </Button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export {dataType.replace('_', ' ')}
              </CardTitle>
              <CardDescription>
                Configure export options and download your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select 
                  value={exportOptions.format} 
                  onValueChange={(value: 'csv' | 'json') => 
                    setExportOptions({ ...exportOptions, format: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV (Excel compatible)</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {dataType === 'emergencies' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date Range
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">From</Label>
                        <Input
                          type="date"
                          value={exportOptions.dateRange?.start || ''}
                          onChange={(e) => setExportOptions({
                            ...exportOptions,
                            dateRange: {
                              ...exportOptions.dateRange!,
                              start: e.target.value
                            }
                          })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">To</Label>
                        <Input
                          type="date"
                          value={exportOptions.dateRange?.end || ''}
                          onChange={(e) => setExportOptions({
                            ...exportOptions,
                            dateRange: {
                              ...exportOptions.dateRange!,
                              end: e.target.value
                            }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex-1"
                >
                  {isExporting ? 'Exporting...' : 'Export'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ExportButton;
