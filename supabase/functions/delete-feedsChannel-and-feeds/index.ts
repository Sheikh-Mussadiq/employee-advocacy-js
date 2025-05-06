import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RSS_API_BASE = 'https://api.rss.app/v1'
const RSS_API_KEY = Deno.env.get('RSS_API_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

Deno.serve(async (req: Request) => {
  // 1️⃣ CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })
  }

  try {
    // 2️⃣ Authenticate user
    const auth = req.headers.get('authorization') || ''
    if (!auth.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
    }
    const token = auth.split(' ')[1]
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token)
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: 'Invalid auth token' }), { status: 401, headers: corsHeaders })
    }

    // 3️⃣ Check Admin & workspace
    const { data: me, error: meErr } = await supabase
      .from('users')
      .select('role, workspace_id')
      .eq('id', user.id)
      .single()
    if (meErr || !me) {
      return new Response(JSON.stringify({ error: 'User record not found' }), { status: 404, headers: corsHeaders })
    }
    if (me.role !== 'Admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: Admins only' }), { status: 403, headers: corsHeaders })
    }

    // 4️⃣ Parse input & fetch channel row
    const { channelId } = await req.json()
    if (!channelId) {
      return new Response(JSON.stringify({ error: 'channelId is required' }), { status: 400, headers: corsHeaders })
    }

    const { data: channel, error: chanErr } = await supabase
      .from('feedschannels')
      .select('workspace_id, feeds')
      .eq('id', channelId)
      .single()
    if (chanErr || !channel) {
      return new Response(JSON.stringify({ error: 'Channel not found' }), { status: 404, headers: corsHeaders })
    }
    if (channel.workspace_id !== me.workspace_id) {
      return new Response(JSON.stringify({ error: 'Workspace mismatch' }), { status: 403, headers: corsHeaders })
    }

    // 5️⃣ Determine deletion strategy
    const { id: storedId, type, feedIds } = channel.feeds as {
      id: string
      type: 'feed' | 'bundle'
      feedIds?: string[]
    }

    // Build array of feed IDs to delete
    let toDeleteFeeds: string[] = []
    if (type === 'feed') {
      toDeleteFeeds = [storedId]
    } else {
      // bundle: use provided feedIds array
      if (!Array.isArray(feedIds) || feedIds.length === 0) {
        throw new Error('No feedIds in bundle to delete')
      }
      toDeleteFeeds = feedIds
    }

    // 6️⃣ Delete feeds
    for (const fid of toDeleteFeeds) {
      const resp = await fetch(`${RSS_API_BASE}/feeds/${fid}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${RSS_API_KEY}` }
      })
      if (!resp.ok) {
        const txt = await resp.text()
        throw new Error(`Failed deleting feed ${fid}: ${txt.slice(0,100)}`)
      }
    }

    // 7️⃣ If bundle, delete the bundle itself
    if (type === 'bundle') {
      const resp = await fetch(`${RSS_API_BASE}/bundles/${storedId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${RSS_API_KEY}` }
      })
      if (!resp.ok) {
        const txt = await resp.text()
        throw new Error(`Failed deleting bundle ${storedId}: ${txt.slice(0,100)}`)
      }
    }

    // 8️⃣ Remove channel row
    const { error: delErr } = await supabase
      .from('feedschannels')
      .delete()
      .eq('id', channelId)
    if (delErr) {
      throw new Error(`DB cleanup failed: ${delErr.message}`)
    }

    // 9️⃣ Success response
    return new Response(JSON.stringify({
      success: true,
      deletedFeeds: toDeleteFeeds,
      deletedBundle: type === 'bundle' ? storedId : null,
      message: 'Channel and its feed(s) deleted'
    }), { status: 200, headers: corsHeaders })

  } catch (e) {
    return new Response(JSON.stringify({
      success: false,
      error: e instanceof Error ? e.message : String(e)
    }), { status: 500, headers: corsHeaders })
  }
})
