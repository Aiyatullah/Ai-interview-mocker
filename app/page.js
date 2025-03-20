"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Code, UserCheck, BarChart } from "lucide-react";
import LoadingScreen from "./loading"; // Loading animation component

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } }
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <LoadingScreen onFinish={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      {/* Animated Background Decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>

      {/* Main Content */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeUp} 
        className="relative z-10 max-w-4xl mx-auto text-center px-6 py-16"
      >
        <motion.div 
          className="inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 mb-6 shadow-sm" 
          variants={fadeUp}
        >
          Your Interview Success Partner
        </motion.div>

        <motion.h1 
          className="text-5xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600" 
          variants={fadeUp}
        >
          Welcome to AI Interview Mocker
        </motion.h1>

        <motion.p 
          className="text-xl text-slate-700 mb-8 max-w-3xl mx-auto leading-relaxed" 
          variants={fadeUp}
        >
          Practice your interview skills with our advanced AI that simulates real interview scenarios.
          Get instant feedback, improve your responses, and boost your confidence for your next job interview.
        </motion.p>

        {/* New Let's Get Started Button */}
        <motion.div 
          className="mt-10 animate-bounce" 
          variants={fadeUp}
        >
          <Link 
            href="/dashboard"
            className="px-6 py-3 text-lg font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-md transition-transform hover:scale-105 hover:shadow-lg"
          >
            Let's Get Started 🚀
          </Link>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full py-8 text-center">
        <div className="text-sm text-slate-500">
          © {new Date().getFullYear()} AI Interview Mocker. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
