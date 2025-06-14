
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
    const { symptoms, vitals, patientAge, patientGender } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create a structured prompt for triage prediction
    const prompt = `As a medical triage AI, analyze the following patient information and determine the appropriate triage level. Respond with a JSON object containing the triage level, reasoning, and recommended actions.

Patient Information:
- Age: ${patientAge || 'Not specified'}
- Gender: ${patientGender || 'Not specified'}
- Symptoms: ${symptoms}
- Vitals: ${vitals || 'Not provided'}

Triage Levels:
1. Critical (Red) - Life-threatening emergency requiring immediate attention
2. High (Orange) - Urgent condition requiring prompt medical care within 15 minutes
3. Medium (Yellow) - Semi-urgent condition requiring care within 30-60 minutes
4. Low (Green) - Non-urgent condition that can wait 2+ hours

Respond ONLY with valid JSON in this format:
{
  "triageLevel": "critical|high|medium|low",
  "confidence": 0.95,
  "reasoning": "Brief explanation of the assessment",
  "recommendedActions": ["action1", "action2"],
  "estimatedWaitTime": "immediate|15 minutes|30-60 minutes|2+ hours"
}`;

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
            content: 'You are a medical triage AI assistant. Always respond with valid JSON only. Do not include any text outside the JSON response.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI Response:', aiResponse);
    
    // Parse the JSON response
    let triageResult;
    try {
      triageResult = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Invalid response format from AI');
    }

    // Validate the response structure
    if (!triageResult.triageLevel || !triageResult.reasoning) {
      throw new Error('Incomplete triage assessment received');
    }

    return new Response(JSON.stringify(triageResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in predict-triage function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        triageLevel: 'medium',
        reasoning: 'AI assessment failed, defaulting to medium priority for safety',
        confidence: 0.1
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
