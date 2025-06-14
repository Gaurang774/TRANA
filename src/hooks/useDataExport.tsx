
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ExportOptions {
  format: 'pdf' | 'csv';
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: Record<string, any>;
}

export const useDataExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportEmergencies = async (options: ExportOptions) => {
    setIsExporting(true);
    try {
      let query = supabase.from('emergencies').select('*');
      
      if (options.dateRange) {
        query = query
          .gte('created_at', options.dateRange.start)
          .lte('created_at', options.dateRange.end);
      }

      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            query = query.eq(key, value);
          }
        });
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;

      if (options.format === 'csv') {
        exportToCSV(data, 'emergencies');
      } else {
        exportToPDF(data, 'emergencies');
      }

      toast.success(`Emergencies exported as ${options.format.toUpperCase()}`);
    } catch (error: any) {
      toast.error(`Export failed: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAmbulances = async (options: ExportOptions) => {
    setIsExporting(true);
    try {
      const { data, error } = await supabase
        .from('ambulances')
        .select('*')
        .order('ambulance_number');
      
      if (error) throw error;

      if (options.format === 'csv') {
        exportToCSV(data, 'ambulances');
      } else {
        exportToPDF(data, 'ambulances');
      }

      toast.success(`Ambulances exported as ${options.format.toUpperCase()}`);
    } catch (error: any) {
      toast.error(`Export failed: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const exportHospitalBeds = async (options: ExportOptions) => {
    setIsExporting(true);
    try {
      const { data, error } = await supabase
        .from('hospital_beds')
        .select('*')
        .order('department', { ascending: true });
      
      if (error) throw error;

      if (options.format === 'csv') {
        exportToCSV(data, 'hospital_beds');
      } else {
        exportToPDF(data, 'hospital_beds');
      }

      toast.success(`Hospital beds exported as ${options.format.toUpperCase()}`);
    } catch (error: any) {
      toast.error(`Export failed: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value).replace(/"/g, '""');
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToPDF = (data: any[], filename: string) => {
    // Simple PDF export - in production, you'd use a library like jsPDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename} Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          <h1>${filename.charAt(0).toUpperCase() + filename.slice(1)} Report</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                ${Object.keys(data[0] || {}).map(key => `<th>${key}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => 
                `<tr>${Object.values(row).map(value => 
                  `<td>${value !== null && value !== undefined ? String(value) : ''}</td>`
                ).join('')}</tr>`
              ).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return {
    isExporting,
    exportEmergencies,
    exportAmbulances,
    exportHospitalBeds
  };
};
