import React, { useState } from 'react';
import { Wand2, Copy, ChevronLeft, Download, FileDown } from 'lucide-react';
import { TOPICS } from '../constants/topics';
import { generateAICaption } from '../utils/ai';
import { handleImageDownload, handlePDFDownload } from '../utils/downloads';
import { initializeShareThis } from '../utils/share';

const CONTENT_POOLS = {
  'company-updates': [
    {
      id: 'milestones',
      title: 'Company Milestones',
      items: [
        {
          id: 'milestone-1',
          title: 'Record Breaking Q4 Results',
          text: 'We\'re thrilled to announce our strongest quarter yet! Q4 2023 saw a 45% year-over-year growth, with our customer satisfaction score reaching an all-time high of 98%. This milestone reflects our team\'s dedication and our customers\' trust in our solutions.',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
          pdf: '#'
        },
      ]
    }
  ]
};

export default function ContentPool() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedPool, setSelectedPool] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeCaption, setActiveCaption] = useState(null);
  const [editedCaption, setEditedCaption] = useState('');
  const [editedHashtags, setEditedHashtags] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const generateCaption = async (platform) => {
    if (!selectedItem) return;
    
    setIsGenerating(true);
    try {
      const result = await generateAICaption(
        platform,
        selectedItem.title,
        selectedItem.text
      );
      
      const caption = {
        platform,
        ...result
      };
      
      setActiveCaption(caption);
      setEditedCaption(caption.caption);
      setEditedHashtags(caption.hashtags);
    } catch (error) {
      console.error('Failed to generate caption:', error);
    } finally {
      setIsGenerating(false);
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

  React.useEffect(() => {
    if (selectedItem) {
      initializeShareThis();
    }
  }, [selectedItem, activeCaption, editedCaption]);

  const renderTopicList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {TOPICS.map((topic) => (
        <button
          key={topic.id}
          onClick={() => setSelectedTopic(topic.id)}
          className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900">{topic.label}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {CONTENT_POOLS[topic.id]?.length || 0} content pools available
          </p>
        </button>
      ))}
    </div>
  );

  const renderPoolList = () => {
    if (!selectedTopic) return null;
    const pools = CONTENT_POOLS[selectedTopic] || [];

    return (
      <>
        <button
          onClick={() => setSelectedTopic(null)}
          className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Topics
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pools.map((pool) => (
            <button
              key={pool.id}
              onClick={() => setSelectedPool(pool)}
              className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900">{pool.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {pool.items.length} items available
              </p>
            </button>
          ))}
        </div>
      </>
    );
  };

  const renderContentList = () => {
    if (!selectedPool) return null;

    return (
      <>
        <button
          onClick={() => setSelectedPool(null)}
          className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Pools
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedPool.items.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden text-left"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.text}</p>
              </div>
            </button>
          ))}
        </div>
      </>
    );
  };

  const renderContentDetail = () => {
    if (!selectedItem) return null;

    const shareText = activeCaption 
      ? `${editedCaption}\n\n${editedHashtags.map(tag => `#${tag}`).join(' ')}`
      : selectedItem.title;

    return (
      <>
        <button
          onClick={() => setSelectedItem(null)}
          className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Content List
        </button>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="relative">
            <img
              src={selectedItem.image}
              alt={selectedItem.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <button
              onClick={() => handleImageDownload(selectedItem.image, selectedItem.title)}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white transition-colors"
              title="Download Image"
            >
              <Download className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
            <button
              onClick={() => handlePDFDownload(selectedItem.pdf, selectedItem.title)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FileDown className="w-5 h-5" />
              <span>Download PDF</span>
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">{selectedItem.text}</p>
          
          <div className="border-t pt-6">
            <div className="space-y-4">
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
              
              <div className="mt-6">
                <div 
                  className="sharethis-inline-share-buttons"
                  data-url={window.location.href}
                  data-title={selectedItem.title}
                  data-description={shareText}
                  data-username="@YourCompany"
                  data-image={selectedItem.image}
                  data-message={shareText}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Content Pool</h2>
        <p className="text-gray-600 mt-1">Browse and share curated content</p>
      </div>

      {!selectedTopic && renderTopicList()}
      {selectedTopic && !selectedPool && renderPoolList()}
      {selectedPool && !selectedItem && renderContentList()}
      {selectedItem && renderContentDetail()}
    </div>
  );
}