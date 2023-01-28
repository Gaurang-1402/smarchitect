import React, { useState, useCallback, useRef } from "react";
import Canvas from "./Components/Canvas";
import { usePainter } from "./Hooks/usePainter";
import Intro from "./Components/Intro";
import Toolbar from "./Components/Toolbar";

function App() {
  const [dataUrl, setDataUrl] = useState("");
  const [{ canvas, isReady, ...state }, { init, ...api }] = usePainter();

  const handleDownload = useCallback(() => {
    if (!canvas || !canvas.current) return;

    setDataUrl(canvas.current.toDataURL("image/png"));
  }, [canvas]);

  const toolbarProps = { ...state, ...api, dataUrl, handleDownload };

  return (
    <div>
      <Intro isReady={isReady} init={init}></Intro>
      <Toolbar {...toolbarProps} />
      <Canvas width={state.currentWidth} canvasRef={canvas} />
    </div>
  );
}

export default App;
