import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogIn, ExternalLink } from "lucide-react";
import { supabase } from "../lib/supabase";
import { LampDemo } from "../components/ui/LampDemo";
import { LampContainer } from "../components/ui/LampContainer";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SocialHubLogo from "../assets/SocialHub logo.png";


export default function Login() {
  const [workspaceInfo, setWorkspaceInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [hasAccessCode, setHasAccessCode] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const accessCode = queryParams.get('access_code');
    
    if (accessCode) {
      setHasAccessCode(true);
      fetchWorkspaceInfo(accessCode);
    } else {
      setHasAccessCode(false);
    }
  }, [location]);

  const fetchWorkspaceInfo = async (accessCode) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-workspaceInfo-accesscode`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ access_code: accessCode })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch workspace info');
      }

      const data = await response.json();
      
      // Check if data is empty or null
      if (!data || Object.keys(data).length === 0) {
        throw new Error('No workspace found with this access code');
      }
      
      setWorkspaceInfo(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching workspace info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithLinkedIn = async () => {
    try {
      // Prepare query params to include workspace ID after successful login
      let redirectTo = `${window.location.origin}/news`;
      
      // If we have the workspace info, include it in the redirect
      if (workspaceInfo?.id) {
        redirectTo = `${redirectTo}?workspace_id=${workspaceInfo.id}`;
        if (location.search) {
          // Preserve the access_code in the redirect
          redirectTo = `${redirectTo}&${location.search.substring(1)}`;
        }
      } else if (location.search) {
        // Just preserve the current query string (with access_code)
        redirectTo = `${redirectTo}${location.search}`;
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "linkedin",
        options: {
          redirectTo,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("LinkedIn login error:", error.message);
    }
  };

  const redirectToSocialHub = () => {
    window.location.href = "https://app.socialhub.io";
  };

  return (
    // <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-design-white to-design-greyBG">
    <div className="h-screen relative overflow-hidden bg-black">
      {/* Lamp Demo Background */}
      <div className="absolute top-0 inset-0 w-full h-full z-0">
        <LampContainer/>
      </div>




      {/* Login Content with Tubelight Effect */}
      <div className="relative min-h-[calc(100vh-50px)] flex items-center justify-center p-4">
        {/* Tubelight Above Card */}
        <div className="absolute z-30 w-full flex justify-center pointer-events-none" style={{ top: 'calc(50% - 170px)' }}>
          <div className="tubelight-gradient animate-tubelight-glow" style={{ width: '340px', height: '28px' }} />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-white/10 relative z-20 overflow-visible mt-16"
          style={{ boxShadow: '0 8px 40px 0 rgba(80,80,180,0.08), 0 1.5px 8px 0 rgba(120,120,140,0.08)' }}
        >
          {hasAccessCode ? (
            <>
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17, delay: 0.4 }}
                  className="mx-auto h-[90px] w-[90px] rounded-full bg-gradient-to-r from-[#6D28D9]/80 to-[#9333EA]/80 flex items-center justify-center mb-4 overflow-hidden"
                >
                  {loading ? (
                    <div className="h-20 w-20 rounded-full bg-white/20 animate-pulse"></div>
                  ) : (
                    <div className="h-20 w-20 rounded-full flex items-center justify-center overflow-hidden">
                      <img 
                        src={workspaceInfo?.img_path || SocialHubLogo} 
                        alt="Workspace Logo" 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                  )}
                </motion.div>
                <h2 className="mt-2 text-center text-2xl font-extrabold text-white">
                  {loading ? (
                    <div className="h-8 w-48 mx-auto bg-white/20 rounded animate-pulse"></div>
                  ) : (
                    workspaceInfo?.name || "Employee Advocacy"
                  )}
                </h2>
                {error ? (
                  <p className="mt-1 text-center text-sm text-red-400">{error}</p>
                ) : (
                  <p className="mt-1 text-center text-sm text-white/80">Please sign in to continue</p>
                )}
              </div>

              {!loading && workspaceInfo && !error && (
                <div className="mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative w-full flex justify-center py-3 px-4 border border-white/20 text-sm font-medium rounded-lg text-white bg-[#0A66C2]/90 hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A66C2] transition-all duration-150"
                    onClick={handleLoginWithLinkedIn}
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg
                        className="h-5 w-5 text-[#0A66C2] group-hover:text-[#004182]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16 8c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4zM4 8c0 2.2 1.8 4 4 4s4-1.8 4-4-1.8-4-4-4-4 1.8-4 4zm12 8v-1.5c0-1.4-1.1-2.5-2.5-2.5h-7c-1.4 0-2.5 1.1-2.5 2.5v1.5h12z" />
                      </svg>
                    </span>
                    Continue with LinkedIn
                  </motion.button>
                </div>
              )}
            </>
          ) : (
            <div className="py-6">
              <div className="mx-auto flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17, delay: 0.4 }}
                  className="h-20 w-20 rounded-full bg-gradient-to-r from-[#6D28D9]/80 to-[#9333EA]/80 p-2 flex items-center justify-center mb-2"
                >
                  <img src={SocialHubLogo} alt="Logo" className="h-full w-full object-cover" />
                </motion.div>
              </div>
              <h2 className="mt-4 text-center text-xl font-bold text-white">Access Code Required</h2>
              <div className="mt-4 text-center text-sm text-white/80 space-y-2">
                <p>We couldn't find an access code in the link.</p>
                <p>Please reach out to your workspace administrator to obtain a valid link with the required access code.</p>
                <p>Once you receive it, use that link to signin to your workspace.</p>
              </div>
            </div>
          )}

          {hasAccessCode && !loading && workspaceInfo && !error && (
            <div className="mt-6">
              <p className="text-center text-sm text-white/80">
                By continuing, you agree to our{" "}
                <a
                  href="#"
                  className="font-medium text-white hover:text-white/90"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-medium text-white hover:text-white/90"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          )}
          

        </motion.div>
      </div>

      {/* Simple Announcement Banner - Outside Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute bottom-8 left-0 right-0 flex justify-center z-20"
      >
        <div className="max-w-md w-full mx-4 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-between">
          <p className="text-sm text-white/80">
            Are you a SocialHub admin?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={redirectToSocialHub}
            className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#6D28D9] text-white text-xs font-medium shadow-sm hover:bg-[#5B21B6] transition"
          >
            Visit SocialHub
            <ExternalLink className="h-3 w-3" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
