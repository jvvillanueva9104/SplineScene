// Register one of the TF.js backends.

import "@mediapipe/hands";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import {
  HandDetector,
  MediaPipeHandsMediaPipeModelConfig,
} from "@tensorflow-models/hand-pose-detection";
import { proxy, useSnapshot } from "valtio";
import { IPosition } from "../../common/models";
import { videoSize } from "../camera/camera-store";

const model = handPoseDetection.SupportedModels.MediaPipeHands;

const detectorConfig: MediaPipeHandsMediaPipeModelConfig = {
  runtime: "mediapipe",
  modelType: "full",
  maxHands: 2,
  solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
};

interface IBodyPose {
  pointers: Array<IPosition>;
}

const poseState = proxy<IBodyPose>({
  pointers: [],
});

let detector: HandDetector | null = null;

export const useBodyPoseState = (): IBodyPose => {
  return useSnapshot(poseState as any);
};

export const initPoseDetection = async () => {
  detector = await handPoseDetection.createDetector(model, detectorConfig);
};

export const detectPose = async (canvas: HTMLCanvasElement) => {
  if (detector) {
    const poses = await detector.estimateHands(canvas);

    poseState.pointers = [];
    poses.forEach((pose, index) => {
      const point = pose.keypoints[9]; //middle_finger_mcp
      if (point) {
        poseState.pointers.push(scaleToScreen(point));
      }
    });
  }
};

const scaleToScreen = (pos: IPosition): IPosition => {
  return {
    x: (window.innerWidth / videoSize.width) * pos.x,
    y: (window.innerHeight / videoSize.height) * pos.y,
  };
};
