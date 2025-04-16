import React from "react";
import { motion } from "framer-motion";
import { LogIn, ExternalLink } from "lucide-react";
import { supabase } from "../lib/supabase";
import { LampDemo } from "../components/ui/LampDemo";
import { MovingBorderContainer } from "../components/ui/moving-border";

export default function Login() {
  const handleLoginWithLinkedIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "linkedin",
        options: {
          redirectTo: `${window.location.origin}/news`,
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-design-white to-design-greyBG">
      {/* Lamp Demo Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <LampDemo />
      </div>

      {/* Modern Minimalist Announcement Banner with Moving Border */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="w-full flex justify-center mt-6 px-2">
          <MovingBorderContainer
            as="div"
            borderRadius="1.5rem"
            duration={2200}
            containerClassName="w-full max-w-4xl mx-auto p-0 h-auto"
            borderClassName="bg-[radial-gradient(var(--purple-500,#6D28D9)_38%,transparent_62%)]"
            className="w-full flex flex-row items-center gap-6 px-10 py-6 rounded-2xl shadow-lg border-none bg-white/95 backdrop-blur-xl min-h-[72px] whitespace-normal"
            style={{ minHeight: 72 }}
            tabIndex={-1}
            aria-hidden="true"
          >
            <div className="flex items-center min-w-fit">
              <svg width="28" height="28" fill="none" stroke="#6D28D9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><circle cx="14" cy="14" r="12" /><path d="M14 10v5" /><path d="M14 20h.01" /></svg>
              <span className="text-lg text-gray-900 font-bold tracking-tight">Announcement</span>
            </div>
            <span className="flex-1 text-base text-gray-800 font-medium leading-snug text-left whitespace-normal">
              Are you a SocialHub admin? Please visit SocialHub first and then return here.
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={redirectToSocialHub}
              className="ml-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6D28D9] text-white text-sm font-semibold shadow hover:bg-[#5B21B6] transition"
            >
              Visit SocialHub
              <ExternalLink className="h-5 w-5" />
            </motion.button>
          </MovingBorderContainer>
        </div>
      </motion.div>

      {/* Login Content with Tubelight Effect */}
      <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/30 relative z-20 overflow-visible"
          style={{ boxShadow: '0 8px 40px 0 rgba(80,80,180,0.08), 0 1.5px 8px 0 rgba(120,120,140,0.08)' }}
        >
          {/* Tubelight Above Card */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-30 w-full flex justify-center pointer-events-none">
            <div className="tubelight-gradient animate-tubelight-glow" style={{ width: '340px', height: '28px' }} />
          </div>
          <div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-button-tertiary-fill"
            >
              <LogIn className="h-6 w-6 text-button-primary-cta" />
            </motion.div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-design-black">
              Welcome to SocialHub
            </h2>
            <p className="mt-2 text-center text-sm text-design-primaryGrey">
              Sign in with your LinkedIn account to continue
            </p>
          </div>

          <div className="mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLoginWithLinkedIn}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#0A66C2] hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A66C2] transition-colors duration-200"
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

          <div className="mt-6">
            <p className="text-center text-sm text-design-primaryGrey">
              By continuing, you agree to our{" "}
              <a
                href="#"
                className="font-medium text-button-primary-cta hover:text-button-primary-hover"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="font-medium text-button-primary-cta hover:text-button-primary-hover"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
