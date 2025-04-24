import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import NewsFeed from "../components/news/NewsFeed";
import { fetchRSSFeed } from "../utils/rss";
import { DEFAULT_FEED_URL } from "../components/settings/RSSFeedSettings";
import { useAuth } from "../context/AuthContext";
import { getChannelById } from "../services/newsFeedsChannelServices";

export default function News() {
  const { channelId } = useParams();
  const { feedsChannels } = useAuth();
  const [feed, setFeed] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [channelName, setChannelName] = useState("Company News");

  useEffect(() => {
    async function fetchChannelFeed() {
      setIsLoading(true);
      setError(null);
      
      try {
        // If no channelId is provided, use the default feed
        if (!channelId) {
          fetchRSSFeed(DEFAULT_FEED_URL, setFeed, setIsLoading, setError);
          setChannelName("Company News");
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
        // The structure is channel -> feeds -> data -> feedNames -> rss_feed_url
        if (channel.feeds && 
            channel.feeds.data && 
            channel.feeds.data.feedNames) {
          
          try {
            // Extract the feed URL from the channel data structure
            let feedUrl = DEFAULT_FEED_URL;
            
            // Handle array of feed names or object with rss_feed_url
            if (Array.isArray(channel.feeds.data.feedNames) && channel.feeds.data.feedNames.length > 0) {
              // If it's an array, find the first item with rss_feed_url
              const feedItem = channel.feeds.data.feedNames.find(feed => feed.rss_feed_url);
              if (feedItem && feedItem.rss_feed_url) {
                feedUrl = feedItem.rss_feed_url;
              }
            } else if (typeof channel.feeds.data.feedNames === 'object') {
              // If it's an object, check if it has rss_feed_url directly
              if (channel.feeds.data.feedNames.rss_feed_url) {
                feedUrl = channel.feeds.data.feedNames.rss_feed_url;
              }
            }
            
            // If we couldn't find the URL in feedNames, check if it's directly in the data
            if (feedUrl === DEFAULT_FEED_URL && channel.feeds.data.rss_feed_url) {
              feedUrl = channel.feeds.data.rss_feed_url;
            }
            
            fetchRSSFeed(feedUrl, setFeed, setIsLoading, setError);
          } catch (err) {
            console.error("Error extracting feed URL:", err);
            // If there's an error extracting the URL, use the default feed
            fetchRSSFeed(DEFAULT_FEED_URL, setFeed, setIsLoading, setError);
          }
        } else {
          // If no feed URL is found, use the default feed
          fetchRSSFeed(DEFAULT_FEED_URL, setFeed, setIsLoading, setError);
        }
      } catch (err) {
        console.error("Error fetching channel feed:", err);
        setError(err.message || "Failed to fetch channel feed");
        setIsLoading(false);
      }
    }
    
    fetchChannelFeed();
  }, [channelId, feedsChannels]);

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
