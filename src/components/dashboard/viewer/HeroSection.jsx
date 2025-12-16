import React from "react";
import Lottie from "lottie-react";
import viewerHero from "../../../assets/lottie/Cricket Ball.json";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <div className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-900 shadow-xl">

      {/* Background Animation */}
      <Lottie
        animationData={viewerHero}
        loop
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 dark:from-black/10 dark:to-black/80"></div>

      {/* Text + Buttons */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-md"
        >
          Track Every Run, Every Ball, Every Victory!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mt-3 text-sm md:text-lg text-gray-200 max-w-xl"
        >
          Live Scores. Real-Time Highlights. Zero Delay.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mt-6 flex gap-4"
        >
          <button className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 backdrop-blur-sm">
            Watch Live Matches
          </button>

          <button className="px-6 py-2.5 bg-white/90 text-black font-semibold rounded-xl shadow hover:bg-white">
            View Leaderboard
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
