"use client";

import { useEffect } from "react";

const VIEWER_SCRIPT_SRC =
  "https://unpkg.com/@splinetool/viewer@1.12.77/build/spline-viewer.js";

let scriptLoaded = false;

function loadViewerScript() {
  if (scriptLoaded || document.querySelector(`script[src="${VIEWER_SCRIPT_SRC}"]`)) {
    scriptLoaded = true;
    return;
  }
  const script = document.createElement("script");
  script.type = "module";
  script.src = VIEWER_SCRIPT_SRC;
  document.head.appendChild(script);
  scriptLoaded = true;
}

interface SplineSceneProps {
  scene: string;
  className?: string;
  style?: React.CSSProperties;
}

export function SplineScene({ scene, className, style }: SplineSceneProps) {
  useEffect(() => {
    loadViewerScript();
  }, []);

  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{
        __html: `<spline-viewer url="${scene}" style="width:100%;height:100%"></spline-viewer>`,
      }}
    />
  );
}
