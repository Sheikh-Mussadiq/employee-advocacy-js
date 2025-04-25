import React from "react";
import { motion } from "framer-motion";

// Simple classNames joiner (replaces cn)
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const LampContainer = ({ children, className }) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 w-full rounded-md z-0",
        className
      )}
    >
      {/* Add px-4 to create padding on mobile screens */}
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 -translate-y-40 px-4 sm:px-8 md:px-0">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{
            opacity: 1,
            width: window.innerWidth < 768 ? "16rem" : "30rem"
          }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-64 sm:w-72 md:w-[30rem] bg-gradient-conic from-[#6D28D9] via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute  w-[100%] left-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute  w-40 h-[100%] left-0 bg-slate-950  bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{
            opacity: 1,
            width: window.innerWidth < 768 ? "16rem" : "30rem"
          }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-64 sm:w-72 md:w-[30rem] bg-gradient-conic from-transparent via-transparent to-[#6D28D9] text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute  w-40 h-[100%] right-0 bg-slate-950  bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute  w-[100%] right-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-110 sm:scale-x-125 md:scale-x-150 bg-slate-950 blur-2xl"></div>
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div className="absolute inset-auto z-50 h-36 w-56 sm:w-64 md:w-[28rem] -translate-y-1/2 rounded-full bg-[#D1B5FD] opacity-50 blur-3xl"></div>
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{
            width: window.innerWidth < 768 ? "10rem" : "16rem"
          }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-36 w-40 sm:w-48 md:w-64 -translate-y-[6rem] rounded-full bg-[#BFA3F7] blur-2xl"
        ></motion.div>
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{
            width: window.innerWidth < 768 ? "16rem" : "30rem"
          }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-50 h-0.5 w-64 sm:w-72 md:w-[30rem] -translate-y-[7rem] bg-[#6D28D9] "
        ></motion.div>
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-slate-950 "></div>
      </div>
      <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
};

export { LampContainer };
