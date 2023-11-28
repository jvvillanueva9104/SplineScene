"use client";

import React, { useState, useEffect } from "react";
import { PlayerScene } from "./player/player-scene";
import SplineScene from "../spline-scene/spline-scene";
import ScreenSaver from "../screensaver/screensaver";

export const GameStage: React.FC = () => {
  const [isPointerActive, setIsPointerActive] = useState(true);

  useEffect(() => {
    let inactivityTimeout: NodeJS.Timeout;

    const handlePointerActivity = () => {
      setIsPointerActive(true);

      // Reset the inactivity timeout
      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(() => {
        setIsPointerActive(false);
      }, 3000); // 3 seconds inactivity threshold
    };

    // Add event listeners for pointer activity
    document.addEventListener("mousemove", handlePointerActivity);
    document.addEventListener("mousedown", handlePointerActivity);

    // Initial setup for inactivity timeout
    inactivityTimeout = setTimeout(() => {
      setIsPointerActive(false);
    }, 3000);

    // Clean up event listeners on component unmount
    return () => {
      clearTimeout(inactivityTimeout);
      document.removeEventListener("mousemove", handlePointerActivity);
      document.removeEventListener("mousedown", handlePointerActivity);
    };
  }, []);

  return (
    <div className="absolute left-0 top-0 w-full h-full z-0">
      <div className="absolute w-full h-full z-30 overflow-hidden">
        <SplineScene />
      </div>
      {!isPointerActive ? (
        <>
          <div className="absolute w-full h-full bg-black opacity-[0.7] z-40"></div>
          <div className="absolute h-full z-39">
            <ScreenSaver />
          </div>
        </>
      ) : null}
      <div className="absolute w-full h-full z-45 pointer-events-none">
        {/* Player Hand with z-index 40 */}
        <PlayerScene />
      </div>
    </div>
  );
};
