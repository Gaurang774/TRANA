
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { message, context } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create a comprehensive system prompt for TRANA
    const systemPrompt = `You are TRANA, a virtual assistant for a hospital emergency response and coordination system. You are helpful, professional, and knowledgeable about medical emergency protocols.

Your capabilities include:
- Emergency protocols and procedures guidance
- Hospital services and bed availability information
- Ambulance tracking and ETA information
- OPD appointment booking assistance
- Patient triage and priority level guidance
- Hospital navigation and general assistance
- Medical terminology and procedure explanations

You assist doctors, nurses, admin staff, patients, and their families. Always be:
- Professional and empathetic
- Clear and concise in explanations
- Safety-focused for emergency situations
- Helpful with hospital navigation and processes

Context about the current system:
${context ? JSON.stringify(context, null, 2) : 'No specific context provided'}

Always prioritize patient safety and emergency protocols. If unsure about critical medical decisions, recommend consulting with medical professionals immediately.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantResponse = data.choices[0].message.content;
    
    console.log('TRANA Response:', assistantResponse);

    return new Response(JSON.stringify({ 
      response: assistantResponse,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in TRANA assistant function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: 'I apologize, but I\'m experiencing technical difficulties. Please try again or contact system administrator for assistance.'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
