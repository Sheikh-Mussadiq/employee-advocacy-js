import { supabase } from "../lib/supabase";

/**
 * Get user by their email
 */
export const getUserByEmail = async (email) => {
  return await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
};

/**
 * Get user by their provider_user_id from LinkedIn
 */
export const getUserByProviderId = async (providerUserId) => {
  return await supabase
    .from("users")
    .select("*")
    .eq("provider_user_id", providerUserId)
    .single();
};

/**
 * Create or update user data in Supabase
 */
export const upsertUser = async (userData, workspaceId) => {
  const { email, firstName, lastName, avatarUrl, providerUserId } = userData;
  
  return await supabase
    .from("users")
    .upsert(
      {
        email,
        first_name: firstName,
        last_name: lastName, 
        avatar_url: avatarUrl,
        provider_user_id: providerUserId,
        workspace_id: workspaceId,
      
      },
      { 
        onConflict: "provider_user_id", 
        returning: "representation" 
      }
    );
};

/**
 * Format user data to match app requirements
 */
export const getFormattedUserData = async (providerUserId) => {
  try {
    const { data, error } = await getUserByProviderId(providerUserId);
    
    if (error) throw error;
    
    if (!data) {
      return { error: { message: "User not found" } };
    }
    
    const formattedData = {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      avatarUrl: data.avatar_url,
      workspaceId: data.workspace_id,
      userName: `${data.first_name.replace(/\s+/g, "")}_${data.last_name.replace(/\s+/g, "")}`,
      provider_user_id: data.provider_user_id
    };
    
    return { userData: formattedData };
  } catch (error) {
    console.error("Error getting formatted user data:", error);
    return { error };
  }
};
