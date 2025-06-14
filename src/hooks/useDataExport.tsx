
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ExportOptions {
  format: 'csv' | 'json';
  includeDeleted?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

export const useDataExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportData = async (table: string, options: ExportOptions) => {
    setIsExporting(true);
    
    try {
      let query = supabase.from(table as any).select('*');
      
      // Filter out deleted records unless specifically requested
      if (!options.includeDeleted) {
        query = query.neq('is_deleted', true);
      }

      // Apply date range filter for emergencies
      if (options.dateRange && table === 'emergencies') {
        query = query
          .gte('created_at', options.dateRange.start)
          .lte('created_at', options.dateRange.end);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        toast.info('No data found to export');
        return;
      }
      
      const filename = `${table}_export_${new Date().toISOString().split('T')[0]}`;
      
      if (options.format === 'csv') {
        exportToCSV(data, filename);
      } else {
        exportToJSON(data, filename);
      }
      
      toast.success(`Successfully exported ${data.length} records`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const exportEmergencies = async (options: ExportOptions) => {
    return exportData('emergencies', options);
  };

  const exportAmbulances = async (options: ExportOptions) => {
    return exportData('ambulances', options);
  };

  const exportHospitalBeds = async (options: ExportOptions) => {
    return exportData('hospital_beds', options);
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle JSON objects and arrays
          const stringValue = typeof value === 'object' && value !== null 
            ? JSON.stringify(value).replace(/"/g, '""')
            : String(value || '').replace(/"/g, '""');
          return `"${stringValue}"`;
        }).join(',')
      )
    ].join('\n');
    
    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  };

  const exportToJSON = (data: any[], filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${filename}.json`, 'application/json');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    exportData,
    exportEmergencies,
    exportAmbulances,
    exportHospitalBeds,
    isExporting
  };
};
