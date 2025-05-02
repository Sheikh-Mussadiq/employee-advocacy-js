import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Building2, MapPin, LogOut, Settings as SettingsIcon, Bell, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

// Keep MOCK_USER for fallback purposes
const MOCK_USER = {
  name: 'John Doe',
  email: 'john.doe@company.com',
  role: 'Software Engineer',
  location: 'San Francisco, CA',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
};

export default function UserProfileSettings({ onClose, isAdmin }) {
  const navigate = useNavigate();
  const { currentUser, setIsAuthenticated, setCurrentUser, setAuthUser } = useAuth();
  
  // Use real user data or fallback to mock data
  const userData = {
    name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : MOCK_USER.name,
    email: currentUser?.email || MOCK_USER.email,
    role: currentUser?.role || MOCK_USER.role,
    // location: currentUser?.location || MOCK_USER.location,
    avatar: currentUser?.avatarUrl || MOCK_USER.avatar
  };

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Signing out...');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Clear any stored user data
      localStorage.removeItem('workspaceId');
      
      // Reset auth context
      setIsAuthenticated(false);
      setCurrentUser(null);
      setAuthUser(null);
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Signed out successfully');
      
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-design-white rounded-lg shadow-lg border border-design-greyOutlines overflow-hidden z-50">
      <div className="p-6 border-b border-design-greyOutlines">
        <div className="flex items-center gap-4">
          <img
            src={userData.avatar}
            alt={userData.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-design-greyOutlines ring-offset-2"
          />
          <div>
            <h3 className="text-lg font-semibold text-design-black">{userData.name}</h3>
            <p className="text-sm text-design-primaryGrey">{userData.role}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-design-black">
            <Mail className="w-5 h-5 text-design-primaryGrey" />
            <span>{userData.email}</span>
          </div>
          <div className="flex items-center gap-3 text-design-black">
            <Building2 className="w-5 h-5 text-design-primaryGrey" />
            <span>{userData.role}</span>
          </div>
          {/* {userData.location && (
            <div className="flex items-center gap-3 text-design-black">
              <MapPin className="w-5 h-5 text-design-primaryGrey" />
              <span>{userData.location}</span>
            </div>
          )} */}
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
            onClick={handleLogout}
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