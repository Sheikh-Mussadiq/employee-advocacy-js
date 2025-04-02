import React, { useState, useEffect } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { Wand2, Copy, ExternalLink } from 'lucide-react';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export default function FeedItem({ item }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCaption, setActiveCaption] = useState(null);
  const [editedCaption, setEditedCaption] = useState('');
  const [editedHashtags, setEditedHashtags] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (window.__sharethis__) {
      window.__sharethis__.initialize();
    }
  }, [activeCaption, editedCaption]);

  const generateCaption = async (platform) => {
    setIsGenerating(true);
    try {
      const customPrompt = localStorage.getItem('customPrompt') || '';
      const contentSnippet = item.contentSnippet || item.content.replace(/<[^>]+>/g, '');
      
      const prompt = `Create an engaging ${platform} post about this article. Title: "${item.title}"\n\nArticle content: "${contentSnippet}"\n\nAdditional instructions: ${customPrompt}\n\nProvide the response in this JSON format:\n{"caption": "your caption here", "hashtags": ["tag1", "tag2"]}\n\nMake it professional, engaging, and platform-appropriate. For LinkedIn, be more formal. For Twitter, be concise. For Facebook, be conversational.`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        const parsedResponse = JSON.parse(response);
        const caption = {
          platform,
          caption: parsedResponse.caption,
          hashtags: parsedResponse.hashtags
        };
        
        setActiveCaption(caption);
        setEditedCaption(caption.caption);
        setEditedHashtags(caption.hashtags);
      }
    } catch (error) {
      console.error('Failed to generate caption:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) throw new Error('Invalid date');
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return 'Date unavailable';
    }
  };

  const handleHashtagChange = (e) => {
    const tags = e.target.value.split(/[,\s]+/).filter(Boolean);
    setEditedHashtags(tags);
  };

  const copyToClipboard = async () => {
    const textToCopy = `${editedCaption}\n\n${editedHashtags.map(tag => `#${tag}`).join(' ')}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shareText = activeCaption 
    ? `${editedCaption}\n\n${editedHashtags.map(tag => `#${tag}`).join(' ')}`
    : item.title;

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold text-gray-900">
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
              {item.title}
            </a>
          </h2>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-600"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>{item.creator || 'Unknown author'}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(item.isoDate)}</span>
        </div>

        <div className={`prose prose-sm max-w-none ${!isExpanded ? 'line-clamp-3' : ''}`}>
          <div dangerouslySetInnerHTML={{ __html: item.content }} />
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>

        <div className="mt-6 space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => generateCaption('linkedin')}
              disabled={isGenerating}
              className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate AI text for this post'}
            </button>
            {activeCaption && (
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>

          {activeCaption && (
            <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Caption
                </label>
                <textarea
                  value={editedCaption}
                  onChange={(e) => setEditedCaption(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Hashtags
                </label>
                <input
                  type="text"
                  value={editedHashtags.join(' ')}
                  onChange={handleHashtagChange}
                  placeholder="Add hashtags separated by spaces"
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>
          )}
          
          <div 
            className="sharethis-inline-share-buttons"
            data-url={item.link}
            data-title={item.title}
            data-description={shareText}
            data-username="@YourCompany"
            data-image={item.content.match(/src="([^"]+)"/)?.[1] || ''}
            data-message={shareText}
            data-share-method="customize"
          ></div>
        </div>
      </div>
    </article>
  );
}