import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Building2, MapPin, LogOut, Settings as SettingsIcon, Bell, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_USER = {
  name: 'John Doe',
  email: 'john.doe@company.com',
  role: 'Software Engineer',
  location: 'San Francisco, CA',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
};

export default function UserProfileSettings({ onClose, isAdmin }) {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-design-white rounded-lg shadow-lg border border-design-greyOutlines overflow-hidden z-50">
      <div className="p-6 border-b border-design-greyOutlines">
        <div className="flex items-center gap-4">
          <img
            src={MOCK_USER.avatar}
            alt={MOCK_USER.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-design-greyOutlines ring-offset-2"
          />
          <div>
            <h3 className="text-lg font-semibold text-design-black">{MOCK_USER.name}</h3>
            <p className="text-sm text-design-primaryGrey">{MOCK_USER.role}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-design-black">
            <Mail className="w-5 h-5 text-design-primaryGrey" />
            <span>{MOCK_USER.email}</span>
          </div>
          <div className="flex items-center gap-3 text-design-black">
            <Building2 className="w-5 h-5 text-design-primaryGrey" />
            <span>{MOCK_USER.role}</span>
          </div>
          <div className="flex items-center gap-3 text-design-black">
            <MapPin className="w-5 h-5 text-design-primaryGrey" />
            <span>{MOCK_USER.location}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <button
            onClick={() => handleNavigate('/settings')}
            className="w-full text-left px-4 py-2 text-design-black hover:bg-design-greyBG rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-design-primaryGrey" />
            Account Settings
            </div>
          </button>
          <button
            onClick={() => handleNavigate('/settings?tab=notifications')}
            className="w-full text-left px-4 py-2 text-design-black hover:bg-design-greyBG rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-design-primaryGrey" />
            Notification Preferences
            </div>
          </button>
          <button
            onClick={() => handleNavigate('/settings?tab=privacy')}
            className="w-full text-left px-4 py-2 text-design-black hover:bg-design-greyBG rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-design-primaryGrey" />
            Privacy Settings
            </div>
          </button>
          {isAdmin && (
            <button
              onClick={() => handleNavigate('/advocacy-settings')}
              className="w-full text-left px-4 py-2 text-design-black hover:bg-design-greyBG rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-design-primaryGrey" />
              Advocacy Settings
              </div>
            </button>
          )}
        </div>

        <div className="border-t pt-4">
          <button
            onClick={() => {/* Add logout logic */}}
            className="w-full flex items-center gap-2 px-4 py-2 text-semantic-error hover:bg-semantic-error-light hover:text-semantic-error-hover rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export { MOCK_USER }