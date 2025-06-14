
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExtractedData {
  patient_name: string;
  patient_phone: string;
  patient_email: string;
  notes: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, fileName } = await req.json();

    if (!image) {
      throw new Error('No image provided');
    }

    console.log(`Processing OCR for file: ${fileName}`);

    // Use OCR.space API (free tier available)
    const ocrResponse = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'apikey': 'helloworld', // Free API key
        'base64Image': `data:image/jpeg;base64,${image}`,
        'language': 'eng',
        'isOverlayRequired': 'false',
        'detectOrientation': 'true',
        'scale': 'true',
        'isTable': 'true'
      }),
    });

    if (!ocrResponse.ok) {
      throw new Error(`OCR API error: ${ocrResponse.status}`);
    }

    const ocrData = await ocrResponse.json();
    console.log('OCR Response:', ocrData);

    if (!ocrData.ParsedResults || ocrData.ParsedResults.length === 0) {
      throw new Error('No text could be extracted from the image');
    }

    const extractedText = ocrData.ParsedResults[0].ParsedText;
    console.log('Extracted text:', extractedText);

    // Parse the extracted text to find patient information
    const extractedData = parsePatientData(extractedText);

    return new Response(JSON.stringify({ 
      success: true, 
      extractedData,
      rawText: extractedText 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in extract-prescription-data function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function parsePatientData(text: string): ExtractedData {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let patient_name = '';
  let patient_phone = '';
  let patient_email = '';
  let notes = '';

  // Common patterns for patient information on prescriptions
  const namePatterns = [
    /(?:patient|name|mr|mrs|ms|dr)[\s:]*([a-zA-Z\s]+)/i,
    /^([a-zA-Z\s]+)(?:\s+age|\s+\d{1,3})/i,
  ];

  const phonePatterns = [
    /(?:phone|tel|mobile|cell|contact)[\s:]*([+]?[\d\s\-\(\)]{7,15})/i,
    /([+]?[\d\s\-\(\)]{10,15})/,
  ];

  const emailPatterns = [
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
  ];

  // Extract patient name (usually first meaningful text or after "Patient:")
  for (const line of lines) {
    if (!patient_name) {
      for (const pattern of namePatterns) {
        const match = line.match(pattern);
        if (match && match[1] && match[1].trim().length > 2) {
          patient_name = match[1].trim();
          break;
        }
      }
    }

    // Extract phone number
    if (!patient_phone) {
      for (const pattern of phonePatterns) {
        const match = line.match(pattern);
        if (match && match[1]) {
          const phone = match[1].replace(/\s+/g, '').replace(/[^\d+\-\(\)]/g, '');
          if (phone.length >= 7) {
            patient_phone = phone;
            break;
          }
        }
      }
    }

    // Extract email
    if (!patient_email) {
      for (const pattern of emailPatterns) {
        const match = line.match(pattern);
        if (match && match[1]) {
          patient_email = match[1].trim();
          break;
        }
      }
    }
  }

  // If no name found, use first non-empty line that looks like a name
  if (!patient_name) {
    for (const line of lines) {
      if (line.length > 2 && line.length < 50 && /^[a-zA-Z\s]+$/.test(line)) {
        patient_name = line;
        break;
      }
    }
  }

  // Create notes from extracted text
  notes = `Extracted from prescription: ${text.substring(0, 200)}${text.length > 200 ? '...' : ''}`;

  return {
    patient_name: patient_name || '',
    patient_phone: patient_phone || '',
    patient_email: patient_email || '',
    notes: notes
  };
}
