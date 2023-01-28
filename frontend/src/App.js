import React, { useState, useCallback, useRef } from "react";
import './App.css';
import Canvas from "./Components/Canvas";

function App() {
  const [dateUrl, setDateUrl] = useState("");
  const canvas = useRef();

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
