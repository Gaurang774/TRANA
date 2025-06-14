
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ExtractedData {
  patient_name: string;
  patient_phone: string;
  patient_email: string;
  notes: string;
}

interface OCRPrescriptionUploadProps {
  onDataExtracted: (data: ExtractedData) => void;
}

const OCRPrescriptionUpload: React.FC<OCRPrescriptionUploadProps> = ({ onDataExtracted }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, [toast]);

  const extractPatientData = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Convert file to base64
      const base64 = await fileToBase64(selectedFile);
      
      // Call the OCR edge function
      const { data, error } = await supabase.functions.invoke('extract-prescription-data', {
        body: {
          image: base64,
          fileName: selectedFile.name
        }
      });

      if (error) {
        throw error;
      }

      if (data?.extractedData) {
        onDataExtracted(data.extractedData);
        toast({
          title: "Data extracted successfully",
          description: "Patient information has been filled in the form",
        });
      } else {
        throw new Error('No data could be extracted from the prescription');
      }
    } catch (error) {
      console.error('OCR extraction error:', error);
      toast({
        title: "Extraction failed",
        description: error instanceof Error ? error.message : "Failed to extract data from prescription",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix to get just the base64 string
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload Prescription for Auto-Fill
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Upload a clear image of the prescription to automatically extract patient information.
          </AlertDescription>
        </Alert>

        <div>
          <Label htmlFor="prescription-upload">Select Prescription Image</Label>
          <Input
            id="prescription-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="cursor-pointer"
          />
        </div>

        {previewUrl && (
          <div className="space-y-2">
            <Label>Preview:</Label>
            <div className="relative">
              <img
                src={previewUrl}
                alt="Prescription preview"
                className="max-h-64 w-full object-contain border rounded-md"
              />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={extractPatientData}
            disabled={!selectedFile || isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {isUploading ? 'Extracting Data...' : 'Extract Patient Data'}
          </Button>
          
          {selectedFile && (
            <Button variant="outline" onClick={clearSelection} disabled={isUploading}>
              Clear
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OCRPrescriptionUpload;
