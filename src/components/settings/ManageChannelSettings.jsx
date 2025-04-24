import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Search, Copy, Info, Pencil, Check, X } from 'lucide-react';

// Removed mock channels as we'll use real data from the API

export default function ManageChannelSettings() {
  const { feedsChannels } = useAuth();
  const [channels, setChannels] = useState([]);
  const [editingChannelId, setEditingChannelId] = useState(null);
  const [editingLink, setEditingLink] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState([]);

  // Transform feedsChannels into the format expected by the component
  useEffect(() => {
    if (feedsChannels && feedsChannels.length > 0) {
      const formattedChannels = feedsChannels.map(channel => ({
        id: channel.id,
        name: channel.name,
        status: 'Active', // Default status, you might want to store this in the database
        feedLink: channel.feeds?.data?.feedNames?.[0]?.rss_feed_url || 
                 (channel.feeds?.data?.rss_feed_url ? channel.feeds.data.rss_feed_url : '')
      }));
      setChannels(formattedChannels);
    }
  }, [feedsChannels]);

  const filteredChannels = useMemo(() =>
    channels.filter(ch => ch.name.toLowerCase().includes(searchTerm.toLowerCase())),
  [channels, searchTerm]);

  const toggleSelect = id => setSelected(prev => prev.includes(id) ? prev.filter(i=>i!==id) : [...prev, id]);
  const toggleSelectAll = () => setSelected(prev => prev.length === filteredChannels.length ? [] : filteredChannels.map(ch=>ch.id));
  const bulkToggleStatus = () => {
    setChannels(prev => prev.map(ch => selected.includes(ch.id)
      ? { ...ch, status: ch.status==='Active' ? 'Inactive' : 'Active' }
      : ch
    ));
    toast.success('Bulk status updated');
    setSelected([]);
  };

  const toggleChannelStatus = (id) => {
    setChannels(prev =>
      prev.map(channel => {
        if (channel.id === id) {
          const updated = { ...channel, status: channel.status === 'Active' ? 'Inactive' : 'Active' };
          toast.success(`${updated.name} ${updated.status === 'Active' ? 'activated' : 'deactivated'}`);
          return updated;
        }
        return channel;
      })
    );
  };

  const startEdit = (id, link) => { setEditingChannelId(id); setEditingLink(link); };
  const cancelEdit = () => { setEditingChannelId(null); setEditingLink(''); };
  const saveEdit = (id) => {
    const channelName = channels.find(ch => ch.id === id)?.name;
    setChannels(prev => prev.map(ch => ch.id === id ? { ...ch, feedLink: editingLink } : ch));
    toast.success(`${channelName} feed link updated`);
    setEditingChannelId(null);
    setEditingLink('');
  };

  const isValidLink = useMemo(() => /^https?:\/\/\S+$/.test(editingLink), [editingLink]);

  return (
    <div className="card p-6 space-y-4">
      {/* Search & Bulk Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-design-primaryGrey" />
          <input
            type="text"
            placeholder="Search channels..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-design-greyOutlines rounded focus:ring-2 focus:ring-primaryPurple"
          />
        </div>
        {selected.length > 0 && (
          <div className="flex items-center space-x-2">
            <button onClick={bulkToggleStatus} className="btn-primary btn-sm">Toggle Status</button>
            <span className="text-sm text-design-primaryGrey">{selected.length} selected</span>
          </div>
        )}
      </div>
      <h3 className="text-xl font-semibold text-design-black">Manage Channels</h3>
      <p className="text-design-primaryGrey">Toggle channels on and off for advocacy posts.</p>
      {/* Table Layout */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-design-greyBG sticky top-0">
            <tr>
              <th className="p-2"><input type="checkbox" checked={selected.length === filteredChannels.length} onChange={toggleSelectAll} /></th>
              <th className="p-2">Channel</th>
              <th className="p-2">Feed Link</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredChannels.map(ch => (
              <tr key={ch.id} className={`border-t ${editingChannelId === ch.id ? 'bg-design-lightVioletSelection' : ''}`}> 
                <td className="p-2"><input type="checkbox" checked={selected.includes(ch.id)} onChange={() => toggleSelect(ch.id)} /></td>
                <td className="p-2">{ch.name}</td>
                <td className="p-2">
                  {editingChannelId === ch.id ? (
                    <div className="relative">
                      <input
                        type="text"
                        value={editingLink}
                        onChange={e => setEditingLink(e.target.value)}
                        className={`w-full px-2 py-1 border rounded focus:ring-2 focus:ring-primaryPurple ${isValidLink ? 'border-semantic-success' : 'border-semantic-error'}`}
                      />
                      <Info className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-design-primaryGrey" title="Enter full URL" />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <a href={ch.feedLink} target="_blank" rel="noopener noreferrer" className="truncate max-w-xs text-sm text-design-primaryPurple underline">
                        {ch.feedLink}
                      </a>
                      <Copy className="w-4 h-4 text-design-primaryGrey hover:text-design-black cursor-pointer" onClick={() => {navigator.clipboard.writeText(ch.feedLink); toast.success('Copied link');}} aria-label="Copy link" />
                    </div>
                  )}
                </td>
                <td className="p-2">
                  <label htmlFor={`toggle-${ch.id}`} className="inline-flex relative items-center cursor-pointer mr-2">
                    <input id={`toggle-${ch.id}`} type="checkbox" className="sr-only peer" checked={ch.status === 'Active'} onChange={() => toggleChannelStatus(ch.id)} />
                    <div className="w-8 h-4 bg-design-greyBG rounded-full peer-focus:ring-2 peer-focus:ring-primaryPurple peer-checked:bg-semantic-success relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-design-greyOutlines after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
                  </label>
                </td>
                <td className="p-2 flex items-center space-x-2">
                  {editingChannelId === ch.id ? (
                    <>
                      <button onClick={() => saveEdit(ch.id)} disabled={!isValidLink} className={`p-1 rounded hover:bg-design-greyBG ${!isValidLink ? 'opacity-50 cursor-not-allowed' : ''}`} aria-label="Save">
                        <Check className="w-4 h-4 text-semantic-success" />
                      </button>
                      <button onClick={cancelEdit} className="p-1 rounded hover:bg-design-greyBG" aria-label="Cancel"><X className="w-4 h-4 text-semantic-error" /></button>
                    </>
                  ) : (
                    <button onClick={() => startEdit(ch.id, ch.feedLink)} className="p-1 rounded hover:bg-design-greyBG" aria-label="Edit"><Pencil className="w-4 h-4 text-design-primaryGrey" /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
