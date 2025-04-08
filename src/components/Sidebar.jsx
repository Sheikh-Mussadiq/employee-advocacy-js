// import React, { useState } from 'react';
// import { 
//   Newspaper, 
//   Trophy, 
//   Settings, 
//   BarChart,
//   Users,
//   DollarSign,
//   Megaphone,
//   ChevronDown,
//   ChevronUp,
//   Hash,
//   MessageCircle,
//   HelpCircle,
//   Briefcase
// } from 'lucide-react';
// import { useNotifications } from '../context/NotificationContext';

// export default function Sidebar({ isOpen, onClose, activeTab, setActiveTab }) {
//   const [isChannelsExpanded, setIsChannelsExpanded] = useState(true);
//   const { unreadCounts } = useNotifications();

//   const channelsSubItems = [
//     { id: 'sales', icon: DollarSign, label: 'Sales' },
//     { id: 'marketing', icon: Megaphone, label: 'Marketing' },
//     { id: 'hr', icon: Briefcase, label: 'HR' },
//     { id: 'feedback', icon: MessageCircle, label: 'Ask for Feedback' },
//   ];

//   const menuItems = [
//     { 
//       id: 'news', 
//       icon: Newspaper, 
//       label: 'News',
//       hasSubmenu: false,
//     },
//     { id: 'colleagues', icon: Users, label: 'Colleagues' },
//     {
//       id: 'channels',
//       icon: Hash,
//       label: 'My Channels',
//       hasSubmenu: true,
//       subItems: channelsSubItems,
//       isExpanded: isChannelsExpanded,
//       toggleExpanded: () => setIsChannelsExpanded(!isChannelsExpanded),
//       totalUnread: channelsSubItems.reduce((acc, item) => acc + (unreadCounts[`channels-${item.id}`] || 0), 0)
//     },
//     { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
//     { id: 'analytics', icon: BarChart, label: 'Analytics' },
//     { id: 'settings', icon: Settings, label: 'Settings' },
//   ];

//   const handleTabChange = (tabId) => {
//     setActiveTab(tabId);
//     onClose();
//   };

//   const NotificationBubble = ({ count }) => {
//     if (count === 0) return null;
//     return (
//       <span className="bg-blue-100 text-blue-600 text-[10px] px-1.5 py-px rounded-full min-w-[16px] h-4 inline-flex items-center justify-center">
//         {count}
//       </span>
//     );
//   };

//   return (
//     <>
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
//           onClick={onClose}
//         />
//       )}

//       <aside
//         className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
//           isOpen ? 'translate-x-0' : '-translate-x-full'
//         } md:translate-x-0 md:static md:z-0`}
//       >
//         <div className="p-6">
//           <div className="mb-8">
//             <h1 className="text-2xl font-bold text-gray-900">SocialHub</h1>
//             <div className="flex items-center justify-between mt-1">
//               <p className="text-sm text-gray-600">Employee Advocacy Platform</p>
//               <button
//                 onClick={() => handleTabChange('help')}
//                 className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
//               >
//                 <HelpCircle className="w-4 h-4" />
//                 Help
//               </button>
//             </div>
//           </div>
//           <nav className="space-y-2">
//             {menuItems.map(({ id, icon: Icon, label, hasSubmenu, subItems, isExpanded, toggleExpanded, totalUnread }) => (
//               <div key={id}>
//                 <button
//                   onClick={() => hasSubmenu ? toggleExpanded?.() : handleTabChange(id)}
//                   className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
//                     (activeTab === id || (hasSubmenu && activeTab.startsWith(`${id}-`)))
//                       ? 'bg-blue-50 text-blue-600'
//                       : 'text-gray-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   <div className="flex items-center space-x-3">
//                     <Icon className="w-5 h-5" />
//                     <span className="font-medium">{label}</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     {hasSubmenu && totalUnread > 0 && <NotificationBubble count={totalUnread} />}
//                     {hasSubmenu && (
//                       isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
//                     )}
//                   </div>
//                 </button>
                
//                 {hasSubmenu && isExpanded && subItems && (
//                   <div className="ml-4 mt-2 space-y-1">
//                     {subItems.map(({ id: subId, icon: SubIcon, label: subLabel }) => (
//                       <button
//                         key={subId}
//                         onClick={() => handleTabChange(`${id}-${subId}`)}
//                         className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
//                           activeTab === `${id}-${subId}`
//                             ? 'bg-blue-50 text-blue-600'
//                             : 'text-gray-600 hover:bg-gray-50'
//                         }`}
//                       >
//                         <div className="flex items-center space-x-3">
//                           <SubIcon className="w-4 h-4" />
//                           <span className="font-medium text-sm">{subLabel}</span>
//                         </div>
//                         <NotificationBubble count={unreadCounts[`${id}-${subId}`] || 0} />
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </nav>
//         </div>
//       </aside>
//     </>
//   );
// }

import React, { useState } from 'react';
import { 
  Newspaper, 
  Trophy, 
  Settings, 
  BarChart,
  Users,
  DollarSign,
  Megaphone,
  ChevronDown,
  ChevronUp,
  Hash,
  MessageCircle,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function Sidebar({ isOpen, onClose, navigate, currentPath }) {
  const [isChannelsExpanded, setIsChannelsExpanded] = useState(true);
  const { unreadCounts, getChannelsCount } = useNotifications();
  const totalChannelsCount = getChannelsCount();

  const channelsSubItems = [
    { id: 'sales', icon: DollarSign, label: 'Sales' },
    { id: 'marketing', icon: Megaphone, label: 'Marketing' },
    { id: 'hr', icon: Briefcase, label: 'HR' },
    { id: 'feedback', icon: MessageCircle, label: 'Ask for Feedback' },
  ];

  const menuItems = [
    { 
      id: 'news', 
      icon: Newspaper, 
      label: 'News',
      hasSubmenu: false,
      unreadCount: unreadCounts.news || 0
    },
    { 
      id: 'colleagues', 
      icon: Users, 
      label: 'Colleagues',
      hasSubmenu: false,
      unreadCount: unreadCounts.colleagues || 0
    },
    {
      id: 'channels',
      icon: Hash,
      label: 'My Channels',
      hasSubmenu: true,
      subItems: channelsSubItems,
      isExpanded: isChannelsExpanded,
      toggleExpanded: () => setIsChannelsExpanded(!isChannelsExpanded),
      totalUnread: totalChannelsCount
    },
    { 
      id: 'leaderboard', 
      icon: Trophy, 
      label: 'Leaderboard',
      hasSubmenu: false,
      unreadCount: 0
    },
    { 
      id: 'analytics', 
      icon: BarChart, 
      label: 'Analytics',
      hasSubmenu: false,
      unreadCount: 0
    },
    { 
      id: 'settings', 
      icon: Settings, 
      label: 'Settings',
      hasSubmenu: false,
      unreadCount: 0
    },
  ];

  const handleTabChange = (tabId) => {
    if (tabId.startsWith('channels-')) {
      const section = tabId.replace('channels-', '');
      navigate(`/channels/${section}`);
    } else {
      navigate(`/${tabId}`);
    }
    onClose();
  };

  const NotificationBubble = ({ count }) => {
    if (count === 0) return null;
    return (
      <span className="bg-blue-100 text-blue-600 text-[10px] px-1.5 py-px rounded-full min-w-[16px] h-4 inline-flex items-center justify-center">
        {count}
      </span>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:z-0`}
      >
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">SocialHub</h1>
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-gray-600">Employee Advocacy Platform</p>
              <button
                onClick={() => handleTabChange('help')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <HelpCircle className="w-4 h-4" />
                Help
              </button>
            </div>
          </div>
          <nav className="space-y-2">
            {menuItems.map(({ id, icon: Icon, label, hasSubmenu, subItems, isExpanded, toggleExpanded, totalUnread, unreadCount }) => (
              <div key={id}>
                <button
                  onClick={() => hasSubmenu ? toggleExpanded?.() : handleTabChange(id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    (currentPath === `/${id}` || (hasSubmenu && currentPath.startsWith(`/${id}`)))
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!hasSubmenu && unreadCount > 0 && <NotificationBubble count={unreadCount} />}
                    {hasSubmenu && totalUnread > 0 && <NotificationBubble count={totalUnread} />}
                    {hasSubmenu && (
                      isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>
                
                {hasSubmenu && isExpanded && subItems && (
                  <div className="ml-4 mt-2 space-y-1">
                    {subItems.map(({ id: subId, icon: SubIcon, label: subLabel }) => (
                      <button
                        key={subId}
                        onClick={() => handleTabChange(`${id}-${subId}`)}
                        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                          currentPath === `/channels/${subId}`
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <SubIcon className="w-4 h-4" />
                          <span className="font-medium text-sm">{subLabel}</span>
                        </div>
                        <NotificationBubble count={unreadCounts[`${id}-${subId}`] || 0} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}