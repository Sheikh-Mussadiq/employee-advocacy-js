import React, { useState } from 'react';
import toast from 'react-hot-toast';

const mockAnnouncements = [
  { id: 1, title: 'Weekly Leaderboard', message: 'Top performers will be announced every Monday.' },
  { id: 2, title: 'Monthly Roundup', message: 'See who ranked top this month!' },
];

export default function LeaderboardAnnouncementsSettings() {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const addAnnouncement = () => {
    if (newTitle && newMessage) {
      setAnnouncements(prev => [...prev, { id: Date.now(), title: newTitle, message: newMessage }]);
      setNewTitle('');
      setNewMessage('');
      toast.success('Announcement added');
    } else {
      toast.error('Please enter both title and message');
    }
  };

  return (
    <div className="card p-6 space-y-4">
      <h3 className="text-xl font-semibold text-design-black">Leaderboard Announcements</h3>
      <p className="text-design-primaryGrey">Create announcements for the leaderboard.</p>
      <ul className="space-y-2 max-h-40 overflow-y-auto">
        {announcements.map((ann) => (
          <li key={ann.id} className="border p-3 rounded-lg">
            <h4 className="font-semibold text-design-black">{ann.title}</h4>
            <p className="text-design-primaryGrey text-sm">{ann.message}</p>
          </li>
        ))}
      </ul>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full px-3 py-2 border border-design-greyOutlines rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryPurple"
        />
        <textarea
          placeholder="Message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full px-3 py-2 border border-design-greyOutlines rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryPurple"
          rows={3}
        />
        <button
          onClick={addAnnouncement}
          className="btn-primary"
        >
          Add Announcement
        </button>
      </div>
    </div>
  );
}
