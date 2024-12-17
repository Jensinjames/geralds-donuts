import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const response = await fetch(
      "https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=f5VcNFddXJbBfZz1xvA8",
      {
        headers: {
          "xi-api-key": Deno.env.get('ELEVENLABS_API_KEY') || "",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get signed URL");
    }

    const data = await response.json();
    return new Response(
      JSON.stringify({ signedUrl: data.signed_url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error getting signed URL:', error);
    return new Response(
      JSON.stringify({ error: "Failed to generate signed URL" }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})