"use client";
import React, { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LoadingScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // Call function to switch to the main page
    }, 3000); // Show animation for 3 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <DotLottieReact
        src="https://lottie.host/96071673-d539-42dd-bebb-9954ecf44bbf/dXQ6g9f9x6.lottie"
        loop
        autoplay
      />
    </div>
  );
};

export default LoadingScreen;
