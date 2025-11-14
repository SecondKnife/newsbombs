"use client";

import React, { PropsWithChildren } from "react";
import "./AnimatedBackground.css";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/contexts/theme";

function AnimatedBackground({
  className = "",
}: PropsWithChildren<{ className?: string }>) {
  const { bgFlagNumber } = useThemeContext();
  return (
    <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
      {/* Background Image with Blur - Fallback to gradient if image not found */}
      <div className="absolute inset-0">
        {/* Fallback gradient background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 from-blue-50 via-blue-100 to-blue-200 animate-gradient-x`}
        />
        {/* Background Image with Blur (if exists) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/background.jpg')",
            filter: "blur(8px)",
            transform: "scale(1.1)", // Scale up to avoid blur edges
          }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
      </div>
      
      {/* Optional: Keep some animated elements if needed */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={cn(
              `absolute rounded-lg opacity-5 animate-rectangle-${i + 1}`,
            )}
            style={{
              left: `${bgFlagNumber * 100}%`,
              top: `${bgFlagNumber * 100}%`,
              width: `${bgFlagNumber * 300 + 1000}px`,
              height: `${bgFlagNumber * 300 + 1000}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
export default AnimatedBackground;
