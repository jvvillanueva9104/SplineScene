import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import _debounce from "lodash/debounce";
import ScreenSaver from "../screensaver/screensaver";

const DynamicSpline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function SplineScene() {
  const splineRef = useRef<any>();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const delayedHandlePointerDown = () => {
      setTimeout(() => {
        const objectId = "watering can final glb";
        splineRef.current.emitEvent("mouseDown", objectId);
      }, 3000); // 3 second delay
    };

    const handlePointerDown = _debounce(
      (event: any) => {
        delayedHandlePointerDown();
      },
      1000,
      { leading: true, trailing: false }
    );

    const checkAndAddListener = () => {
      const customPointer = document.querySelector(".playerPointer");

      if (customPointer) {
        document.addEventListener(
          "mousedown",
          handlePointerDown as EventListener
        );
        clearInterval(intervalId);
      }
    };

    // Check for the custom pointer element every 100ms
    intervalId = setInterval(checkAndAddListener, 100);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener(
        "mousedown",
        handlePointerDown as EventListener
      );
    };
  }, []); /// Effect runs once on component mount

  return (
    <div>
      <DynamicSpline
        scene="https://prod.spline.design/gp08zU9S4FelbyRZ/scene.splinecode"
        onLoad={(spline: any) => {
          splineRef.current = spline;
        }}
        onMouseDown={(event: any) => {
          console.log("Event:", event);
        }}
      />
    </div>
  );
}
