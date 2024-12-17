import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Webhook received:', req.method);
    
    // Test endpoint with a GET request
    if (req.method === 'GET') {
      return new Response(
        JSON.stringify({ 
          status: 'success',
          message: 'Webhook endpoint is working!' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Handle POST requests
    if (req.method === 'POST') {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      let payload;
      try {
        payload = await req.json();
        console.log('Received webhook payload:', payload);

        // Extract conversation ID from the ElevenLabs URL if present
        let conversationId = payload.conversation_id;
        if (payload.url && payload.url.includes('history/')) {
          conversationId = payload.url.split('history/').pop();
        }

        // Insert the conversation data into Supabase
        const { data, error } = await supabaseClient
          .from('conversation_history')
          .insert({
            conversation_id: conversationId || 'default',
            user_message: payload.user_message || payload.input || '',
            agent_response: payload.agent_response || payload.output || '',
            metadata: {
              url: payload.url,
              ...payload.metadata
            },
            timestamp: new Date().toISOString()
          });

        if (error) throw error;

        console.log('Successfully inserted conversation:', data);
        return new Response(
          JSON.stringify({ 
            status: 'success',
            message: 'Conversation data stored successfully',
            data 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );

      } catch (error) {
        console.error('Error processing payload:', error);
        return new Response(
          JSON.stringify({ 
            status: 'error',
            message: 'Failed to process payload',
            error: error.message 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }
    }

    // Handle unsupported methods
    return new Response(
      JSON.stringify({ 
        status: 'error',
        message: 'Method not allowed' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405 
      }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ 
        status: 'error',
        message: 'Internal server error',
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})