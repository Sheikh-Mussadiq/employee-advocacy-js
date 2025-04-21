import React from "react";
import toast, { Toaster } from "react-hot-toast";

const CustomToaster = () => {
  const handleDismiss = (toastId) => {
    try {
      toast.dismiss(toastId);
    } catch (error) {
      console.error("Error dismissing toast:", error);
    }
  };

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "",
        style: {
          background: "none",
          boxShadow: "none",
        },
        success: {
          icon: null,
          className: "!bg-none !shadow-none",
          duration: 2500,
          style: {
            background: "none",
            boxShadow: "none",
          },
        },
        error: {
          icon: null,
          className: "!bg-none !shadow-none",
          duration: 2500,
          style: {
            background: "none",
            boxShadow: "none",
          },
        },
      }}
    >
      {(toastItem) => (
        <div
          className={`${
            toastItem.visible
              ? "animate-in fade-in slide-in-from-right-5"
              : "animate-out fade-out slide-out-to-right-5"
          } max-w-md w-[320px] bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 ${
            toastItem.type === "success"
              ? "border-l-4 border-semantic-success"
              : toastItem.type === "error"
              ? "border-l-4 border-semantic-error"
              : ""
          }`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                {toastItem.type === "success" && (
                  <svg
                    className="h-5 w-5 text-semantic-success"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {toastItem.type === "error" && (
                  <svg
                    className="h-5 w-5 text-semantic-error"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {toastItem.message}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200 dark:border-gray-700">
            <button
              onClick={() => handleDismiss(toastItem.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Toaster>
  );
};

export default CustomToaster;
