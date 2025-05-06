import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface CreateUserRequest {
  userId: string
  email: string
  firstName: string
  lastName: string
  avatarUrl: string
  workspaceId: string
}

interface UserResponse {
  id: string
  email: string
  first_name: string
  last_name: string
  workspace_id: string
  created_at: string
  email_notifications: boolean
  avatar_url: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
}


Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response("ok", {
      headers: corsHeaders,
      status: 204,
    })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: corsHeaders, status: 405 }
    )
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    
    const { userId, email, firstName, lastName, avatarUrl, workspaceId } = await req.json() as CreateUserRequest

    // Basic validation
    if (!userId || !email || !firstName || !lastName || !workspaceId ) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: corsHeaders, status: 422 }
      )
    }

    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
            id: userId,
            email,
            first_name: firstName,
            last_name: lastName,
            workspace_id: workspaceId,
            avatar_url: avatarUrl,
            role: 'EMPLOYEE',
          }
      ])
      .select()
      .single()

    if (error) throw error

    const formattedUser: UserResponse = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      workspace_id: user.workspace_id,
      created_at: user.created_at,
      email_notifications: user.email_notifications,
      avatar_url: user.avatar_url
    }

    return new Response(
      JSON.stringify({ user: formattedUser }),
      { headers: corsHeaders, status: 201 }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { headers: corsHeaders, status: 500 }
    )
  }
})

interface CreateUserRequest {
  email: string
  firstName: string
  lastName: string
  avatarUrl: string
  workspaceId: string
}

interface UserResponse {
  id: string
  email: string
  first_name: string
  last_name: string
  workspace_id: string
  created_at: string
  email_notifications: boolean
  avatar_url: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Change to specific origin if needed
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    // ✅ CORS preflight support
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: corsHeaders }
    )
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    const { userId, email, firstName, lastName, avatarUrl, workspaceId } = body as CreateUserRequest

    if (!userId || !email || !firstName || !lastName || !workspaceId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 422, headers: corsHeaders }
      )
    }

    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        id:userId,
        email,
        first_name: firstName,
        last_name: lastName,
        workspace_id: workspaceId,
        avatar_url: avatarUrl,
        role: 'EMPLOYEE',
      }])
      .select()
      .single()

    if (error) throw error

    const formattedUser: UserResponse = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      workspace_id: user.workspace_id,
      created_at: user.created_at,
      email_notifications: user.email_notifications,
      avatar_url: user.avatar_url
    }

    return new Response(
      JSON.stringify({ user: formattedUser }),
      { status: 201, headers: corsHeaders }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    )
  }
})
