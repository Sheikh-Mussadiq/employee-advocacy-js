import React, { useState } from "react";
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
  Briefcase,
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function Sidebar({
  isOpen,
  onClose,
  onToggle,
  navigate,
  currentPath,
}) {
  const [isChannelsExpanded, setIsChannelsExpanded] = useState(true);
  const [isNewsFeedsExpanded, setIsNewsFeedsExpanded] = useState(true);
  const { unreadCounts, getChannelsCount } = useNotifications();
  const totalChannelsCount = getChannelsCount();
  const { socialHubUser, feedsChannels } = useAuth();
  

  const channelsSubItems = [
    { id: "sales", icon: DollarSign, label: "Sales" },
    { id: "marketing", icon: Megaphone, label: "Marketing" },
    { id: "hr", icon: Briefcase, label: "HR" },
    { id: "feedback", icon: MessageCircle, label: "Ask for Feedback" },
  ];

  const menuItems = [
    feedsChannels.length > 0 && {
      id: "news_feeds",
      icon: Hash,
      label: "News Feeds",
      hasSubmenu: true,
      subItems: feedsChannels.map((channel) => ({
        id: channel.id,
        icon: Hash,
        label: channel.name,
      })),
      isExpanded: isNewsFeedsExpanded,
      toggleExpanded: () => setIsNewsFeedsExpanded(!isNewsFeedsExpanded),
      // totalUnread: totalChannelsCount,
    },
    // {
    //   id: "settings",
    //   icon: Settings,
    //   label: "Settings",
    //   hasSubmenu: false,
    //   unreadCount: 0,
    // },
    // {
    //   id: "news",
    //   icon: Newspaper,
    //   label: "News",
    //   hasSubmenu: false,
    //   unreadCount: unreadCounts.news || 0,
    // },
    {
      id: "colleagues",
      icon: Users,
      label: "Colleagues",
      hasSubmenu: false,
      unreadCount: unreadCounts.colleagues || 0,
    },
    {
      id: "channels",
      icon: Hash,
      label: "My Channels",
      hasSubmenu: true,
      subItems: channelsSubItems,
      isExpanded: isChannelsExpanded,
      toggleExpanded: () => setIsChannelsExpanded(!isChannelsExpanded),
      totalUnread: totalChannelsCount,
    },
    {
      id: "leaderboard",
      icon: Trophy,
      label: "Leaderboard",
      hasSubmenu: false,
      unreadCount: 0,
    },
    {
      id: "analytics",
      icon: BarChart,
      label: "Analytics",
      hasSubmenu: false,
      unreadCount: 0,
    },
  ].filter(Boolean); // Filter out falsy values

  const handleTabChange = (tabId) => {
    if (tabId.startsWith("channels-")) {
      const section = tabId.replace("channels-", "");
      navigate(`/channels/${section}`);
    } else if (tabId.startsWith("news_feeds-")) {
      const channelId = tabId.replace("news_feeds-", "");
      navigate(`/news_feeds/${channelId}`);
    } else {
      navigate(`/${tabId}`);
    }
    onClose();
  };

  const NotificationBubble = ({ count }) => {
    if (count === 0) return null;
    return (
      <span className="bg-button-tertiary-fill text-button-primary-cta text-[10px] px-1.5 py-px rounded-full min-w-[16px] h-4 inline-flex items-center justify-center">
        {count}
      </span>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-design-white border-r border-design-greyOutlines z-40 transform transition-all duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:z-0`}
      >
        <div className="sticky top-0 bg-design-white/80 backdrop-blur-sm border-b border-design-greyOutlines p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-design-black">SocialHub</h1>
            <p className="text-sm text-design-primaryGrey mt-1">
              Employee Advocacy Platform
            </p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map(
            ({
              id,
              icon: Icon,
              label,
              hasSubmenu,
              subItems,
              isExpanded,
              toggleExpanded,
              totalUnread,
              unreadCount,
            }) => (
              <div key={id}>
                <button
                  onClick={() =>
                    hasSubmenu ? toggleExpanded?.() : handleTabChange(id)
                  }
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    currentPath === `/${id}` ||
                    (hasSubmenu && currentPath.startsWith(`/${id}`))
                      ? "bg-button-tertiary-fill text-button-primary-cta"
                      : "text-design-primaryGrey hover:bg-design-greyBG hover:text-design-black"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!hasSubmenu && unreadCount > 0 && (
                      <NotificationBubble count={unreadCount} />
                    )}
                    {hasSubmenu && totalUnread > 0 && (
                      <NotificationBubble count={totalUnread} />
                    )}
                    {hasSubmenu &&
                      (isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </button>

                {hasSubmenu && isExpanded && subItems && (
                  <div className="ml-4 mt-1 space-y-1">
                    {subItems.map(
                      ({ id: subId, icon: SubIcon, label: subLabel }) => (
                        <button
                          key={subId}
                          onClick={() => handleTabChange(`${id}-${subId}`)}
                          className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                            (id === "channels" && currentPath === `/channels/${subId}`) ||
                            (id === "news_feeds" && currentPath === `/news_feeds/${subId}`)
                              ? "bg-button-tertiary-fill text-button-primary-cta ring-1 ring-button-primary-cta/10"
                              : "text-design-primaryGrey hover:bg-design-greyBG hover:text-design-black"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <SubIcon className="w-4 h-4 flex-shrink-0" />
                            <span className="font-medium text-sm">
                              {subLabel}
                            </span>
                          </div>
                          <NotificationBubble
                            count={unreadCounts[`${id}-${subId}`] || 0}
                          />
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            )
          )}
        </nav>
      </aside>
    </>
  );
}
