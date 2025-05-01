
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Reusable CORS headers
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  try {
    const { userId, workspaceId } = await req.json();

    if (!userId || !workspaceId) {
      return new Response(JSON.stringify({
        error: "Missing required fields: userId and workspaceId"
      }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

  

    const { data, error } = await supabase
      .from("users")
      .update({ workspace_id: workspaceId })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error); // Optional: Log server-side
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: CORS_HEADERS,
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: CORS_HEADERS,
    });

  } catch (err) {
    console.error("Unexpected error:", err); // Optional: Log server-side
    return new Response(JSON.stringify({ error: "Invalid JSON or unexpected error" }), {
      status: 400,
      headers: CORS_HEADERS,
    });
  }
});
