
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_server
// Learn more about Deno Deploy: https://deno.com/deploy/docs

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default when deployed.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default when deployed.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Handle only POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get the request body
    const { patientId, fileDetails, fileContent } = await req.json();

    // Validate input
    if (!patientId || !fileDetails || !fileContent) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // First, save the file content to storage
    const fileName = `${patientId}/${Date.now()}_${fileDetails.name}`.replace(/\s+/g, '_');
    
    // Upload file to storage bucket
    const { data: storageData, error: storageError } = await supabaseClient
      .storage
      .from('patient_files')
      .upload(fileName, fileContent, {
        contentType: fileDetails.type,
      });

    if (storageError) {
      console.error('Storage error:', storageError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload file' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Then save file metadata to the database
    const { data, error } = await supabaseClient
      .from('patient_files')
      .insert({
        patient_id: patientId,
        file_name: fileDetails.name,
        file_type: fileDetails.type,
        file_size: fileDetails.size,
        file_path: fileName,
      })
      .select();

    if (error) {
      console.error('DB error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save file metadata' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
