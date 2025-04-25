
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { headers: corsHeaders, status: 405 });
  }
  try {
    const { access_code } = await req.json();

    if (!access_code) {
      return new Response(
        JSON.stringify({ error: 'Access token is required' }),
        { headers: corsHeaders, status: 400 }
      );
    }

    const { data, error } = await supabase.from('workspace').select('id, name, description, img_path').eq('access_code', access_code).single();
    if (error) {
      let errorMessage;
      if (error.code === 'PGRST116') {
        errorMessage = {
          error: 'No Workspace exists for this code. Please contact your Admin.'
        };
      } else {
        errorMessage = {
          error: error.message || error
        };
      }
      return new Response(JSON.stringify(errorMessage), {
        headers: corsHeaders,
        status: 500
      });
    }
    return new Response(JSON.stringify(data), {
      headers: corsHeaders,
      status: 200
    });
  } catch (_error) {
    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), {
      headers: corsHeaders,
      status: 500
    });
  }
});