import React, { useState, useCallback, useRef } from "react";
import './App.css';
import Canvas from "./Components/Canvas";
import { usePainter } from "./Hooks/usePainter";

function App() {
  const [dateUrl, setDateUrl] = useState("");
  const [{ canvas, isReady, ...state }, { init, ...api }] = usePainter();

  return (
    <div className="App">
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <Canvas width={"20rem"} canvasRef={canvas} />
    </div>
  );
}

export default App;
