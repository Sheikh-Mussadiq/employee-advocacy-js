import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import OpenAI from 'openai';
import Select from 'react-select';

const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

const LANGUAGES = [
  { value: 'english', label: 'English' },
  { value: 'german', label: 'German' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'italian', label: 'Italian' },
];

const DEFAULT_PROMPT = `Act as an experienced Linkedin Marketer and generate a LinkedIn post where I share my insights on [Happiness topic]. Keep the content [engaging] and easy to understand. The post should consist of [100 words] maximum. 
Add a [catchy] headline
Apply best practices in formating for linkedin
End with something engaging
Use lists
Also include relatable SEO hashtags and emojis.`;

export default function AIModal({ isOpen, onClose, editor }) {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('preferredLanguage');
    return saved ? JSON.parse(saved) : LANGUAGES[0];
  });

  useEffect(() => {
    localStorage.setItem('preferredLanguage', JSON.stringify(language));
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      setPrompt(DEFAULT_PROMPT);
      setResult('');
    }
  }, [isOpen]);

  const generateContent = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { 
            role: "user", 
            content: `Write a LinkedIn post about: ${prompt}\n\nWrite the response in ${language.label}. Make it professional and engaging.`
          }
        ],
        model: "gpt-3.5-turbo",
      });

      setResult(completion.choices[0]?.message?.content || '');
    } catch (error) {
      console.error('Failed to generate content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const useContent = () => {
    if (result) {
      editor.chain().focus().insertContent(result).run();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-6 w-full max-w-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-lg font-semibold mb-4">AI Content Generator</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Output Language
          </label>
          <Select
            value={language}
            onChange={(newValue) => setLanguage(newValue)}
            options={LANGUAGES}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What would you like to write about?
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={6}
            placeholder="Enter your topic or idea..."
          />
        </div>

        {result && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Generated Content:</h4>
            <div className="p-3 bg-gray-50 rounded-lg whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          {isLoading ? (
            <div className="flex items-center text-blue-600">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Generating...
            </div>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Close
              </button>
              {result && (
                <>
                  <button
                    onClick={generateContent}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Generate Again
                  </button>
                  <button
                    onClick={useContent}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Use Content
                  </button>
                </>
              )}
              {!result && (
                <button
                  onClick={generateContent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={!prompt.trim()}
                >
                  Generate
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}