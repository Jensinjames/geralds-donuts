import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vercel-signature',
}

async function verifySignature(request: Request): Promise<boolean> {
  const payload = await request.text();
  const signature = request.headers.get('x-vercel-signature');
  
  if (!signature) return false;

  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const key = encoder.encode(Deno.env.get('WEBHOOK_SECRET'));
  
  const hmac = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  
  const calculatedSignature = await crypto.subtle.sign(
    "HMAC",
    hmac,
    data
  );
  
  // Convert to hex
  const calculatedHex = Array.from(new Uint8Array(calculatedSignature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return calculatedHex === signature;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const isValid = await verifySignature(req);
    
    console.log('Webhook signature verification result:', isValid);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        isValid 
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error verifying webhook:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to verify webhook signature' 
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
})