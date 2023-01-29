import { useState, useCallback, useRef, useEffect } from "react";
import { Canvas } from "./components/Canvas";
import { Goo } from "./components/Goo";
import { Intro } from "./components/Intro";
import { Toolbar } from "./components/Toolbar";
import { usePainter } from "./hooks/usePainter";
import axios from "axios"

const App = () => {
  const [dataUrl, setDataUrl] = useState("#");
  const [{ canvas, isReady, ...state }, { init, ctx, ...api }] = usePainter();
  const [images, setImages] = useState([]);

  console.log("context", ctx)

  const fetchImages = async () => {
    console.log("here")
    console.log("inside fetch ctx", ctx)

    // let canvasUrl = canvas.toDataURL("image/jpeg", 0.5);

    console.log(dataUrl);
    try {
      const response = await axios.post('http://172.28.169.136:5000/sketch', { search_image: dataUrl });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }    // setImages(images)

  };


  const handleDownload = useCallback(() => {
    if (!canvas || !canvas.current) return;
    ctx.globalCompositeOperation = 'destination-over' // Add behind elements.
    ctx.fillStyle = "#e5e7eb"; // light-gray
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setDataUrl(canvas.current.toDataURL("image/png"));
  }, [canvas]);

  const toolbarProps = { ...state, ...api, dataUrl, handleDownload };

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
