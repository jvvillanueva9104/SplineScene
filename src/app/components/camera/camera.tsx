"use client";

import { FC, useEffect } from "react";
import {
  detectPose,
  initPoseDetection,
} from "../pose-detection/pose-detection";
import { initCamera, useCameraState } from "./camera-store";

interface ICamera {
  showCanvas: boolean;
}

export const Camera: FC<ICamera> = (props) => {
  const { video, canvas } = useCameraState();

  useEffect(() => {
    const init = async () => {
      await initCamera();
      await initPoseDetection();

      const draw = () => {
        if (canvas.current) {
          detectPose(canvas.current as HTMLCanvasElement);
        }
        requestAnimationFrame(draw);
      };
      draw();
    };
    init();
  }, [canvas]);

  return (
    <>
      <video
        ref={video as any}
        playsInline
        style={{ display: "none", width: "auto", height: "auto" }}
      />
      <canvas
        ref={canvas as any}
        className="z-10 relative opacity-80"
        style={{ display: props.showCanvas ? "block" : "none" }}
      ></canvas>
    </>
  );
};
