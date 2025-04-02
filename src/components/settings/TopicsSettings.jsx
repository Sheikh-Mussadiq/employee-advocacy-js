import React, { useState } from 'react';
import { TOPICS } from '../../constants/topics';

export default function TopicsSettings() {
  const [selectedTopics, setSelectedTopics] = useState([]);

  const toggleTopic = (topicId) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Topics of Interest
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Select topics you'd like to share about:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => toggleTopic(topic.id)}
            className={`p-3 rounded-lg border-2 transition-colors text-left ${
              selectedTopics.includes(topic.id)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            {topic.label}
          </button>
        ))}
      </div>
    </div>
  );
}