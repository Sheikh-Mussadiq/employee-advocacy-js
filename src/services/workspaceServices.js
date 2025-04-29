import { supabase } from '../lib/supabase';

export const getWorkspaceByAccountId = async (accountId) => {
  try {
    const { data, error } = await supabase
      .from('workspace_with_access')
      .select('*')
      // .eq('account_id', accountId)
      .single();

    if (error) {
      return { error: error, workspace: null };
    }

    return { error: null, workspace: data };
  } catch (error) {
    console.error('Exception fetching workspace:', error);
    return { error: error.message, workspace: null };
  }
}

export const createWorkspace = async (workspaceData) => {
  try {
    const { data, error } = await supabase
      .from('workspace')
      .insert(workspaceData)
      .select()
      .single();

    if (error) {
      return { error: error, workspace: null };
    }

    return { error: null, workspace: data };
  } catch (error) {
    console.error('Exception creating workspace:', error);
    return { error: error.message, workspace: null };
  }
}

export const updateWorkspace = async (workspaceId, workspaceData) => {
  try {
    const { data, error } = await supabase
      .from('workspace')
      .update(workspaceData)
      .eq('id', workspaceId)
      .select()
      .single();

    if (error) {
      return { error: error, workspace: null };
    }

    return { error: null, workspace: data };
  } catch (error) {
    console.error('Exception updating workspace:', error);
    return { error: error.message, workspace: null };
  }
}

export const uploadWorkspaceImage = async (file, accountId) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${accountId}-${Date.now()}.${fileExt}`;
    const filePath = `workspace-logos/${fileName}`;

    // 1. List existing files for the user
    const { data: existingFiles, error: listError } = await supabase.storage
      .from('workspace-logos')
      .list(
        accountId
      );

    if (listError) {
      console.warn('Could not list existing logos, proceeding with upload anyway:', listError);
    } else if (existingFiles && existingFiles.length > 0) {
      // 2. Delete old files
      const filesToRemove = existingFiles.map(f => f.name);
      const { error: removeError } = await supabase.storage
        .from('workspace-logos')
        .remove(filesToRemove);

      if (removeError) {
        console.warn('Could not remove old logos:', removeError);
      }
    }

    // 3. Upload the new file
    const { data, error: uploadError } = await supabase.storage
      .from('workspace-logos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false // Set upsert to false as we handle deletion manually
      });

    if (uploadError) {
      return { error: uploadError, url: null };
    }

    const { data: urlData } = await supabase.storage
      .from('workspace-logos')
      .getPublicUrl(filePath);

    return { error: null, url: urlData.publicUrl };
  } catch (error) {
    console.error('Exception uploading workspace image:', error);
    return { error: error.message, url: null };
  }
}
