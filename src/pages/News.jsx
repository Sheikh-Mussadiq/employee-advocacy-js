import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import NewsFeed from "../components/news/NewsFeed";
import { fetchRSSFeed } from "../utils/rss";
import { useAuth } from "../context/AuthContext";
import { getChannelById } from "../services/newsFeedsChannelServices";

export default function News() {
  const { channelId } = useParams();
  const { feedsChannels } = useAuth();
  const navigate = useNavigate();
  const [feed, setFeed] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [channelName, setChannelName] = useState("News Feed");

  // Use a ref to track if we've already loaded the feed for this channelId
  const [loadedChannelIds, setLoadedChannelIds] = useState(new Set());
  
  useEffect(() => {
    // Skip if we've already loaded this channelId and it's not null
    // This prevents double loading when feedsChannels updates
    if (channelId && loadedChannelIds.has(channelId)) {
      return;
    }
    
    async function fetchChannelFeed() {
      setIsLoading(true);
      setError(null);
      
      try {
        // If no channelId is provided but we have channels, auto-select the first one
        if (!channelId && feedsChannels && feedsChannels.length > 0) {
          const firstChannel = feedsChannels[0];
          // Navigate to the first channel's feed
          navigate(`/news_feeds/${firstChannel.id}`);
          return; // The useEffect will run again with the new channelId
        } else if (!channelId) {
          // If there are no channels available
          setError("No channels available. Please create a channel in the Advocacy Settings.");
          setChannelName("News Feed");
          setIsLoading(false);
          return;
        }
        
        // Try to find the channel in the context first
        let channel = feedsChannels.find(ch => ch.id === channelId);
        
        // If not found in context, fetch from database
        if (!channel) {
          channel = await getChannelById(channelId);
          if (!channel) {
            throw new Error("Channel not found");
          }
        }
        
        // Set the channel name
        setChannelName(channel.name);
        
        // Get the RSS feed URL from the channel data
        // The new structure is: channel -> feeds -> rss_feed_url
        if (channel.feeds && channel.feeds.rss_feed_url) {
          try {
            // Extract the feed URL from the channel data structure
            const feedUrl = channel.feeds.rss_feed_url;
            fetchRSSFeed(feedUrl, setFeed, setIsLoading, setError);
            
            // Mark this channelId as loaded
            if (channelId) {
              setLoadedChannelIds(prev => new Set([...prev, channelId]));
            }
          } catch (err) {
            console.error("Error extracting feed URL:", err);
            setError(`Unable to load feed for ${channel.name}. Please try again later.`);
            setIsLoading(false);
          }
        } else {
          // If no feed URL is found, show an empty state error
          setError(`No feed URL found for ${channel.name}. Please configure a feed URL in the channel settings.`);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error fetching channel feed:", err);
        setError(err.message || "Failed to fetch channel feed");
        setIsLoading(false);
      }
    }
    
    fetchChannelFeed();
  }, [channelId, feedsChannels, loadedChannelIds]);
  
  // Reset loaded channels when navigating to a different channel
  useEffect(() => {
    return () => {
      setLoadedChannelIds(new Set());
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full space-y-4"
    >
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          {channelName}
        </h2>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Latest updates and announcements
        </p>
      </div>
      <div className="">
        <NewsFeed feed={feed} isLoading={isLoading} error={error} />
      </div>
    </motion.div>
  );
}
