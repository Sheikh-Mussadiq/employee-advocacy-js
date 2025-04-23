import { supabase } from '../lib/supabase';

// Create a new channel
export const createChannel = async (channelData) => {
  try {
    const { data, error } = await supabase
      .from('channels')
      .insert([channelData])
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating channel:', error);
    throw error;
  }
};

// Get all channels
export const getAllChannels = async () => {
  try {
    const { data, error } = await supabase
      .from('channels')
      .select('*');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching channels:', error);
    throw error;
  }
};

// Get channel by ID
export const getChannelById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching channel by ID:', error);
    throw error;
  }
};

// Get channels by workspace ID
export const getChannelsByWorkspaceId = async (workspaceId) => {
  try {
    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .eq('workspace_id', workspaceId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching channels by workspace ID:', error);
    throw error;
  }
};

// Update a channel
export const updateChannel = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('channels')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating channel:', error);
    throw error;
  }
};

// Delete a channel
export const deleteChannel = async (id) => {
  try {
    const { error } = await supabase
      .from('channels')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting channel:', error);
    throw error;
  }
};

