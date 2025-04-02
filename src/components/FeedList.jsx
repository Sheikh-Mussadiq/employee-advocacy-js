import React from 'react';
import FeedItem from './FeedItem';

export default function FeedList({ feed, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  if (!feed) {
    return (
      <div className="text-center p-4 text-gray-600">
        Enter an RSS feed URL to get started
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feed.items.map((item, index) => (
        <FeedItem key={item.link + index} item={item} />
      ))}
    </div>
  );
}