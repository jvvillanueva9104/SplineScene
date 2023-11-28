import { createRef, RefObject } from "react";
import { proxy, ref, snapshot, useSnapshot } from "valtio";
export const videoSize = { width: 640, height: 480 };

interface IVideo {
  canvas: RefObject<HTMLCanvasElement>;
  video: RefObject<HTMLVideoElement>;
}

const cameraState = proxy<IVideo>({
  canvas: ref(createRef<HTMLCanvasElement>()),
  video: ref(createRef<HTMLVideoElement>()),
});

export const useCameraState = () => {
  return useSnapshot(cameraState);
};

export const getCameraRef = () => {
  const snap = snapshot(cameraState);
  if (
    cameraState.video.current &&
    cameraState.canvas.current &&
    snap.video.current &&
    snap.canvas.current
  ) {
    return {
      videoRef: cameraState.video.current,
      canvasRef: cameraState.canvas.current,
      video: snap.video.current,
      canvas: snap.canvas.current,
    };
  }

  throw Error("not initialized");
};

export const initCamera = async () => {
  const stream = await getPermission();
  const { video, videoRef } = getCameraRef();

  if (stream) {
    videoRef.srcObject = stream;
    await video.play();
    initCameraCanvas();
  } else {
    alert("Camera permission denied");
  }
};

export const getPermission = async (): Promise<MediaStream | null> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { ...videoSize, facingMode: "user" },
    });
    return stream;
  } catch {}

  return null;
};

export const initCameraCanvas = () => {
  const { video, canvasRef, canvas } = getCameraRef();
  canvasRef.width = videoSize.width;
  canvasRef.height = videoSize.height;

  let ctx = canvas.getContext("2d")!;
  ctx.translate(video.videoWidth, 0);
  ctx.scale(-1, 1);

  drawCameraCanvas();
};

export const drawCameraCanvas = () => {
  const { canvas, videoRef, video } = getCameraRef();
  let ctx = canvas.getContext("2d")!;

  const draw = () => {
    ctx.drawImage(videoRef, 0, 0, video.videoWidth, video.videoHeight);
    requestAnimationFrame(draw);
  };
  draw();
};
