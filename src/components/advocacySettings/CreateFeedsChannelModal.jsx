"use client";

import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Plus, X, Loader2 } from "lucide-react";
import { FiRss } from "react-icons/fi";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function CreateFeedsChannelModal({
  isOpen,
  onClose,
  workspaceId,
}) {
  const [channelName, setChannelName] = useState("");
  const [feedRows, setFeedRows] = useState([{ feedName: "", feedUrl: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { setFeedsChannels } = useAuth();

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
      const feedNames = feedRows.map(row => row.feedName);

      const { data: channelData } = await supabase
        .from("channels")
        .insert([
          {
            name: channelName,
            workspace_id: workspaceId,
            feeds: {
              ...data,        
              ...feedNames,     
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
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

                <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                  <div>
                    <label
                      htmlFor="channelName"
                      className="block text-sm font-medium text-design-primaryGrey mb-1"
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
                      className={`input w-full px-3 py-2 border ${
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

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-design-black">
                        Feed Sources
                      </h4>
                    </div>

                    {feedRows.map((row, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-2 gap-3 relative"
                      >
                        <div>
                          <input
                            type="text"
                            value={row.feedName}
                            onChange={(e) =>
                              handleRowChange(index, "feedName", e.target.value)
                            }
                            className={`input w-full px-3 py-2 border ${
                              errors[`feedRows.${index}.feedName`]
                                ? "border-semantic-error"
                                : "border-design-greyOutlines"
                            } rounded-lg focus:outline-none focus:ring-2 focus:ring-button-primary-cta`}
                            placeholder="Feed Source Name"
                            disabled={isSubmitting}
                          />
                          {errors[`feedRows.${index}.feedName`] && (
                            <p className="mt-1 text-xs text-semantic-error">
                              {errors[`feedRows.${index}.feedName`]}
                            </p>
                          )}
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={row.feedUrl}
                            onChange={(e) =>
                              handleRowChange(index, "feedUrl", e.target.value)
                            }
                            className={`input w-full px-3 py-2 border ${
                              errors[`feedRows.${index}.feedUrl`]
                                ? "border-semantic-error"
                                : "border-design-greyOutlines"
                            } rounded-lg focus:outline-none focus:ring-2 focus:ring-button-primary-cta`}
                            placeholder="Enter URL, Topic or Keyword"
                            disabled={isSubmitting}
                          />
                          {errors[`feedRows.${index}.feedUrl`] && (
                            <p className="mt-1 text-xs text-semantic-error">
                              {errors[`feedRows.${index}.feedUrl`]}
                            </p>
                          )}

                          {feedRows.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveRow(index)}
                              className="absolute right-2 top-2 text-design-primaryGrey hover:text-semantic-error"
                              disabled={isSubmitting}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    <motion.button
                      type="button"
                      onClick={handleAddRow}
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center w-full py-2 px-4 border border-dashed border-button-primary-cta text-button-primary-cta rounded-lg hover:bg-button-tertiary-fill transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Another Feed Source
                    </motion.button>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-design-greyOutlines">
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
