import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Webhook received:', req.method);
    
    if (req.method === 'POST') {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const payload = await req.json();
      console.log('Received webhook payload:', payload);

      // Extract conversation ID from the ElevenLabs URL
      const conversationId = payload.url ? 
        payload.url.split('history/').pop() : 
        'unknown';

      const { data, error } = await supabaseClient
        .from('conversation_history')
        .insert({
          conversation_id: conversationId,
          user_message: payload.input || '',
          agent_response: payload.output || '',
          metadata: {
            url: payload.url,
            session_id: payload.metadata?.session_id,
            model_id: payload.metadata?.model_id,
            char_count: payload.metadata?.char_count,
            timestamp: payload.metadata?.timestamp || new Date().toISOString()
          }
        });

      if (error) throw error;

      console.log('Successfully stored conversation:', data);
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
    }

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