"use client";

import React, { useEffect, useRef } from "react";
import { IPosition } from "../../../common/models";
import "./player-pointer.css";

interface IProp {
  position: IPosition;
  height: number;
  width: number;
}

export const PlayerPointer: React.FC<IProp> = (props) => {
  const magnifierRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const magnifier = magnifierRef.current;

    if (magnifier) {
      const magnifierSize = 100; // Size of the magnifying glass
      const magnification = 2; // Magnification level

      const x = props.position.x - magnifierSize / 2;
      const y = props.position.y - magnifierSize / 2;

      magnifier.style.left = `${x}px`;
      magnifier.style.top = `${y}px`;
      magnifier.style.backgroundPosition = `-${x * magnification}px -${
        y * magnification
      }px`;
      magnifier.style.backgroundSize = `${
        window.innerWidth * magnification
      }px ${window.innerHeight * magnification}px`;
      magnifier.style.backgroundImage = `url(${document.body.style.backgroundImage})`;

      // Dispatch custom event when the component mounts
      const customPointerReadyEvent = new Event("customPointerReady");
      document.dispatchEvent(customPointerReadyEvent);

      // Simulate mousemove event
      const pointerDownEvent = new MouseEvent("mousedown", {
        clientX: x,
        clientY: y,
      });
      document.dispatchEvent(pointerDownEvent);
    }
  }, [props.position]);

  return (
    <div
      ref={magnifierRef}
      className="playerPointer"
      style={{
        height: `${props.height}px`,
        width: `${props.width}px`,
        left: `${props.position.x}px`,
        top: `${props.position.y}px`,
      }}
    ></div>
  );
};
