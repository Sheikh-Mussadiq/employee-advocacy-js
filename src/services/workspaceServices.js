import { supabase } from '../lib/supabase';

export const getWorkspaceByAccountId = async (accountId) => {
  try {
    const { data, error } = await supabase
      .from('workspace')
      .select('*')
      .eq('account_id', accountId)
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

