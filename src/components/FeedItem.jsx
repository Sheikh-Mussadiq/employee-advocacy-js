import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, isValid, parseISO } from "date-fns";
import { Wand2, Copy, ExternalLink } from "lucide-react";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey:
    "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",
  dangerouslyAllowBrowser: true,
});

export default function FeedItem({ item }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCaption, setActiveCaption] = useState(null);
  const [editedCaption, setEditedCaption] = useState("");
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
      const customPrompt = localStorage.getItem("customPrompt") || "";
      const contentSnippet =
        item.contentSnippet || item.content.replace(/<[^>]+>/g, "");

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
          hashtags: parsedResponse.hashtags,
        };

        setActiveCaption(caption);
        setEditedCaption(caption.caption);
        setEditedHashtags(caption.hashtags);
      }
    } catch (error) {
      console.error("Failed to generate caption:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) throw new Error("Invalid date");
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return "Date unavailable";
    }
  };

  const handleHashtagChange = (e) => {
    const tags = e.target.value.split(/[,\s]+/).filter(Boolean);
    setEditedHashtags(tags);
  };

  const copyToClipboard = async () => {
    const textToCopy = `${editedCaption}\n\n${editedHashtags
      .map((tag) => `#${tag}`)
      .join(" ")}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const shareText = activeCaption
    ? `${editedCaption}\n\n${editedHashtags.map((tag) => `#${tag}`).join(" ")}`
    : item.title;

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="card group hover:shadow-lg transition-all duration-300"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <motion.h2 className="text-xl font-semibold text-design-black group-hover:text-button-primary-cta transition-colors duration-200">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              {item.title}
            </a>
          </motion.h2>
          <motion.a
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-design-primaryGrey hover:text-button-primary-cta transition-colors duration-200"
          >
            <ExternalLink className="w-5 h-5" />
          </motion.a>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>{item.author || "Unknown author"}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(item.pubDate)}</span>
        </div>

        <div
          className={`prose prose-sm max-w-none ${
            !isExpanded ? "line-clamp-3" : ""
          }`}
        >
          <div dangerouslySetInnerHTML={{ __html: item.content }} />
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>

        <div className="mt-6 space-y-4">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => generateCaption("linkedin")}
              disabled={isGenerating}
              className="btn-primary"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {isGenerating
                ? "Generating..."
                : "Generate AI text for this post"}
            </motion.button>
            {activeCaption && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={copyToClipboard}
                className="btn-secondary"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copySuccess ? "Copied!" : "Copy"}
              </motion.button>
            )}
          </div>

          {activeCaption && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 p-4 bg-button-tertiary-fill rounded-lg border border-button-primary-cta/10"
            >
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Caption
                </label>
                <textarea
                  value={editedCaption}
                  onChange={(e) => setEditedCaption(e.target.value)}
                  className="input"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Hashtags
                </label>
                <input
                  type="text"
                  value={editedHashtags.join(" ")}
                  onChange={handleHashtagChange}
                  placeholder="Add hashtags separated by spaces"
                  className="input"
                />
              </div>
            </motion.div>
          )}

          <div
            className="sharethis-inline-share-buttons"
            data-url={item.link}
            data-title={item.title}
            data-description={shareText}
            data-username="@YourCompany"
            data-image={item.content.match(/src="([^"]+)"/)?.[1] || ""}
            data-message={shareText}
            data-share-method="customize"
          ></div>
        </div>
      </div>
    </motion.article>
  );
}
