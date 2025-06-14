
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ExportOptions {
  format: 'csv' | 'json';
  table: string;
  includeDeleted?: boolean;
}

export const useDataExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportData = async (options: ExportOptions) => {
    setIsExporting(true);
    
    try {
      let query = supabase.from(options.table).select('*');
      
      // Filter out deleted records unless specifically requested
      if (!options.includeDeleted) {
        query = query.neq('is_deleted', true);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        toast.info('No data found to export');
        return;
      }
      
      const filename = `${options.table}_export_${new Date().toISOString().split('T')[0]}`;
      
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
    isExporting
  };
};
