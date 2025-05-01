"use client";

import { useState, Fragment, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2, ChevronDown, Search } from "lucide-react";
import { FiRss } from "react-icons/fi";
import {
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaYoutube,
  FaMedium,
  FaReddit,
  FaInstagram,
} from "react-icons/fa";
import { SiSubstack } from "react-icons/si";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

// Predefined feed sources with URLs and icons
const predefinedFeeds = [
  {
    name: "Twitter",
    url: "https://twitter.com/",
    icon: FaTwitter,
    color: "#1DA1F2",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/",
    icon: FaLinkedin,
    color: "#0A66C2",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/",
    icon: FaFacebook,
    color: "#1877F2",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/",
    icon: FaYoutube,
    color: "#FF0000",
  },
  {
    name: "Medium",
    url: "https://medium.com/",
    icon: FaMedium,
    color: "#000000",
  },
  {
    name: "Reddit",
    url: "https://www.reddit.com/r/",
    icon: FaReddit,
    color: "#FF4500",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/",
    icon: FaInstagram,
    color: "#E4405F",
  },
  { name: "Substack", url: "https://", icon: SiSubstack, color: "#FF6719" },
  { name: "Custom RSS", url: "", icon: FiRss, color: "#FFA500" },
];

export default function CreateFeedsChannelModal({
  isOpen,
  onClose,
  workspaceId,
}) {
  const [channelName, setChannelName] = useState("");
  const [feedRows, setFeedRows] = useState([
    { feedName: "", feedUrl: "", platform: null },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const { setFeedsChannels } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddRow = () => {
    setFeedRows([...feedRows, { feedName: "", feedUrl: "" }]);
  };

  const handleRemoveRow = (index) => {
    if (feedRows.length > 1) {
      const newRows = [...feedRows];
      newRows.splice(index, 1);
      setFeedRows(newRows);
    }
  };

  const handleRowChange = (index, field, value) => {
    const newRows = [...feedRows];
    newRows[index][field] = value;
    setFeedRows(newRows);

    // Clear error for this field if it exists
    if (errors[`feedRows.${index}.${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`feedRows.${index}.${field}`];
      setErrors(newErrors);
    }
  };

  const handlePlatformSelect = (index, platform) => {
    const newRows = [...feedRows];
    newRows[index].platform = platform;
    newRows[index].feedName = platform.name;

    // Only set the URL if it's not a custom RSS feed
    if (platform.name !== "Custom RSS") {
      newRows[index].feedUrl = platform.url;
    }

    setFeedRows(newRows);
    setDropdownOpen(null);

    // Clear errors
    const newErrors = { ...errors };
    delete newErrors[`feedRows.${index}.feedName`];
    if (platform.name !== "Custom RSS") {
      delete newErrors[`feedRows.${index}.feedUrl`];
    }
    setErrors(newErrors);
  };

  const handleClearPlatform = (index, event) => {
    // Stop propagation to prevent dropdown from opening
    event.stopPropagation();

    const newRows = [...feedRows];
    newRows[index].platform = null;
    newRows[index].feedName = "";
    newRows[index].feedUrl = "";

    setFeedRows(newRows);
  };

  const filteredFeeds = (searchTerm) => {
    return predefinedFeeds.filter((feed) =>
      feed.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!channelName.trim()) {
      newErrors.channelName = "Channel name is required";
    }

    feedRows.forEach((row, index) => {
      if (!row.feedName.trim()) {
        newErrors[`feedRows.${index}.feedName`] = "Feed name is required";
      }
      if (!row.feedUrl.trim()) {
        newErrors[`feedRows.${index}.feedUrl`] =
          "URL, topic, or keyword is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Call the Supabase Edge function
      const { data, error } = await supabase.functions.invoke(
        "Creating-workspace-Feeds-Channel",
        {
          body: {
            name: channelName,
            feeds: feedRows,
            workspace_id: workspaceId,
          },
        }
      );

      if (error) throw error;

      // Extract all feed names into an array
      const feedNames = feedRows.map((row) => row.feedName);

      const { data: channelData } = await supabase
        .from("feedschannels")
        .insert([
          {
            name: channelName,
            workspace_id: workspaceId,
            feeds: {
              ...data,
              feedNames,
            },
          },
        ])
        .select()
        .single();

      if (!channelData) {
        throw new Error("Failed to create channel in the database");
      }

      // Update the feeds channels in the context
      setFeedsChannels((prevChannels) => [
        ...prevChannels,
        {
          id: channelData.id,
          name: channelData.name,
          feeds: channelData.feeds,
          workspace_id: channelData.workspace_id,
          createdAt: channelData.created_at,
          updatedAt: channelData.updated_at || null,
        },
      ]);

      toast.success("Channel created successfully!");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error creating channel:", error);
      toast.error(
        "Failed to create channel: " + (error.message || "Unknown error")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setChannelName("");
    setFeedRows([{ feedName: "", feedUrl: "" }]);
    setErrors({});
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => !isSubmitting && onClose()}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-design-black flex items-center"
                >
                  <FiRss className="mr-2 text-button-primary-cta" />
                  Create New Channel
                </Dialog.Title>

                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="absolute top-4 right-4 text-design-primaryGrey hover:text-design-black disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>

                <form onSubmit={handleSubmit} className="mt-6 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-3">
                      <label
                        htmlFor="channelName"
                        className="block text-sm font-medium text-design-primaryGrey mb-2"
                      >
                        Channel Name
                      </label>
                      <input
                        type="text"
                        id="channelName"
                        value={channelName}
                        onChange={(e) => {
                          setChannelName(e.target.value);
                          if (errors.channelName) {
                            const newErrors = { ...errors };
                            delete newErrors.channelName;
                            setErrors(newErrors);
                          }
                        }}
                        className={`input w-full px-4 py-2.5 border ${
                          errors.channelName
                            ? "border-semantic-error"
                            : "border-design-greyOutlines"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-button-primary-cta`}
                        placeholder="Enter channel name"
                        disabled={isSubmitting}
                      />
                      {errors.channelName && (
                        <p className="mt-1 text-xs text-semantic-error">
                          {errors.channelName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-design-greyOutlines pb-2">
                      <h4 className="text-base font-medium text-design-black">
                        Feed Sources
                      </h4>
                      <motion.button
                        type="button"
                        onClick={handleAddRow}
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center py-1.5 px-3 border border-dashed border-button-primary-cta text-button-primary-cta rounded-lg hover:bg-button-tertiary-fill transition-colors disabled:opacity-50 text-sm"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Add Source
                      </motion.button>
                    </div>
                    
                    <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {feedRows.map((row, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="md:col-span-3 p-4 border border-design-greyOutlines rounded-lg bg-design-greyBG bg-opacity-30 relative"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                              <label className="block text-sm font-medium text-design-primaryGrey mb-2">
                                Platform
                              </label>
                              <div
                                className="relative"
                                ref={
                                  dropdownOpen === index ? dropdownRef : null
                                }
                              >
                                <div
                                  onClick={() =>
                                    setDropdownOpen(
                                      dropdownOpen === index ? null : index
                                    )
                                  }
                                  className={`flex items-center w-full px-4 py-2.5 border cursor-pointer ${
                                    errors[`feedRows.${index}.feedName`]
                                      ? "border-semantic-error"
                                      : "border-design-greyOutlines"
                                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-button-primary-cta ${
                                    row.platform
                                      ? "bg-button-tertiary-fill bg-opacity-30"
                                      : "bg-white"
                                  }`}
                                >
                                  {row.platform ? (
                                    <>
                                      <span className="flex items-center gap-2 flex-1">
                                        <row.platform.icon
                                          style={{ color: row.platform.color }}
                                          className="w-4 h-4"
                                        />
                                        <span>{row.feedName}</span>
                                      </span>
                                      <button
                                        type="button"
                                        onClick={(e) =>
                                          handleClearPlatform(index, e)
                                        }
                                        className="mr-2 text-design-primaryGrey hover:text-semantic-error transition-colors"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </>
                                  ) : (
                                    <span className="text-design-primaryGrey flex-1">
                                      Select a platform
                                    </span>
                                  )}
                                  <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${
                                      dropdownOpen === index
                                        ? "transform rotate-180"
                                        : ""
                                    }`}
                                  />
                                </div>

                                <AnimatePresence>
                                  {dropdownOpen === index && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      transition={{ duration: 0.15 }}
                                      className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-lg shadow-lg border border-design-greyOutlines overflow-hidden"
                                    >
                                      <div className="p-2 border-b border-design-greyOutlines">
                                        <div className="relative">
                                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-design-primaryGrey" />
                                          <input
                                            type="text"
                                            placeholder="Search platforms..."
                                            className="w-full pl-8 pr-2 py-1.5 text-sm border border-design-greyOutlines rounded-md focus:outline-none focus:ring-1 focus:ring-button-primary-cta"
                                            value={searchTerm}
                                            onChange={(e) =>
                                              setSearchTerm(e.target.value)
                                            }
                                          />
                                        </div>
                                      </div>

                                      <div className="max-h-48 overflow-y-auto py-1">
                                        {filteredFeeds(searchTerm).map(
                                          (feed, feedIndex) => (
                                            <motion.div
                                              key={feedIndex}
                                              whileHover={{
                                                backgroundColor: "#F5F3FF",
                                              }}
                                              className="px-3 py-2 flex items-center gap-2 cursor-pointer"
                                              onClick={() =>
                                                handlePlatformSelect(
                                                  index,
                                                  feed
                                                )
                                              }
                                            >
                                              <feed.icon
                                                style={{ color: feed.color }}
                                                className="w-4 h-4"
                                              />
                                              <span>{feed.name}</span>
                                            </motion.div>
                                          )
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                {errors[`feedRows.${index}.feedName`] && (
                                  <p className="mt-1 text-xs text-semantic-error">
                                    {errors[`feedRows.${index}.feedName`]}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-design-primaryGrey mb-2">
                                URL or Handle
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={row.feedUrl}
                                  onChange={(e) =>
                                    handleRowChange(
                                      index,
                                      "feedUrl",
                                      e.target.value
                                    )
                                  }
                                  className={`input w-full px-4 py-2.5 border ${
                                    errors[`feedRows.${index}.feedUrl`]
                                      ? "border-semantic-error"
                                      : "border-design-greyOutlines"
                                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-button-primary-cta`}
                                  placeholder={
                                    row.platform?.name === "Custom RSS"
                                      ? "Enter full RSS feed URL"
                                      : "Complete the URL or enter handle"
                                  }
                                  disabled={isSubmitting}
                                />
                                {errors[`feedRows.${index}.feedUrl`] && (
                                  <p className="mt-1 text-xs text-semantic-error">
                                    {errors[`feedRows.${index}.feedUrl`]}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Remove Row Button */}
                          {feedRows.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveRow(index)}
                              className="absolute right-3 top-3 text-design-primaryGrey hover:text-semantic-error bg-white rounded-full p-1 shadow-sm border border-design-greyOutlines"
                              disabled={isSubmitting}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    </div>
                  </div>

                  <div className="flex justify-end pt-5 border-t border-design-greyOutlines mt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="mr-3 px-4 py-2 text-design-primaryGrey hover:bg-design-greyBG rounded-lg transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-button-primary-cta text-white rounded-lg hover:bg-button-primary-hover transition-colors disabled:opacity-70 flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Channel"
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
