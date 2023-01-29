import React, { useState, useCallback } from "react";
import { Canvas } from "./components/Canvas";
import { Goo } from "./components/Goo";
import { Intro } from "./components/Intro";
import { Toolbar } from "./components/Toolbar";
import { usePainter } from "./hooks/usePainter";
import axios from "axios"

const App = () => {
  const [dateUrl, setDataUrl] = useState("#");
  const [{ canvas, isReady, ...state }, { init, ...api }] = usePainter();
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    console.log("here")

    // const { images } = axios.get("url")
    // setImages(images)

    // fetch("your_api_endpoint")
    //   .then(response => response.json())
    //   .then(data => setImages(data.images));
  };
  const handleDownload = useCallback(() => {
    if (!canvas || !canvas.current) return;

    setDataUrl(canvas.current.toDataURL("image/png"));
  }, [canvas]);

  const toolbarProps = { ...state, ...api, dateUrl, handleDownload };

  return (
    <>
      <Intro isReady={isReady} init={init} />
      <Toolbar fetchImages={fetchImages} {...toolbarProps} />
      <Canvas width={state.currentWidth} canvasRef={canvas} />
      <Goo />
    </>
  );
};

function RightDrawer({ images }) {
  return (
    <div className="right-drawer">
      {images.map((image, index) => (
        <img key={index} src={image.url} alt={image.name} />
      ))}
    </div>
  );
}

export default App;
