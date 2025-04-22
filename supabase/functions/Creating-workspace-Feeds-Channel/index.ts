
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const RSS_API_BASE = 'https://api.rss.app/v1'
const RSS_API_KEY = Deno.env.get('RSS_API_KEY')!
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }),  { headers: corsHeaders, status: 405 } )
  }
  
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }),  { headers: corsHeaders, status: 401 })
    }
    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid auth token' }), { headers: corsHeaders, status: 401 })
    }

    // Check user role and workspace
    const { data: userRecord, error: userErr } = await supabase
      .from('users')
      .select('role, workspace_id')
      .eq('id', user.id)
      .single()

    if (userErr || !userRecord) {
      return new Response(JSON.stringify({ error: 'User record not found' }), { headers: corsHeaders, status: 404 })
    }
    if (userRecord.role !== 'Admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: Admins only' }), { headers: corsHeaders, status: 403 })
    }

    const { name, feeds, workspace_id } = await req.json()
    // Ensure workspace matches user's workspace
    if (workspace_id !== userRecord.workspace_id) {
      return new Response(JSON.stringify({ error: 'Workspace mismatch' }), { headers: corsHeaders, status: 403 })
    }

    if (!name || !Array.isArray(feeds) ) {
      return new Response(JSON.stringify({ error: 'Invalid request payload' }), { headers: corsHeaders, status: 400 })
    }

    // Create individual feeds
    const feedIds: string[] = []
    for (const feed of feeds) {
      const resp = await fetch(`${RSS_API_BASE}/feeds`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RSS_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: feed.feedUrl }),
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(`Feed creation failed: ${data.message}`)
      feedIds.push(data.id)
    }

    // Create bundle
    const bundleResp = await fetch(`${RSS_API_BASE}/bundles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RSS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, feeds: feedIds }),
    })
    const bundleData = await bundleResp.json()
    if (!bundleResp.ok) throw new Error(`Bundle creation failed: ${bundleData.message}`)

      const { id: bundle_id, rss_feed_url } = bundleData

    return new Response(JSON.stringify({ bundle_id, rss_feed_url }), { status: 200 })
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Bundle creation failed", error: error instanceof Error ? error.message : String(error) }),
      { headers: corsHeaders, status: 500 }
    )    
  }
})
