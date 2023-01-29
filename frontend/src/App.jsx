import { useState, useCallback, useRef, useEffect } from "react";
import { Canvas } from "./components/Canvas";
import { Goo } from "./components/Goo";
import { Intro } from "./components/Intro";
import { Toolbar } from "./components/Toolbar";
import { usePainter } from "./hooks/usePainter";
import axios from "axios"
import { useDropzone } from "react-dropzone";
import DropzoneComponent from "./components/DropzoneComponent";


const App = () => {
  const [dataUrl, setDataUrl] = useState("");
  const [{ canvas, isReady, ...state }, { init, ctx, ...api }] = usePainter();
  const [image, setImage] = useState([]);
  const [dropzoneImages, setDropzoneImages] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchImages = async () => {
    setIsLoading(true);
    let canvasUrl = canvas.current.toDataURL("image/png")

    console.log(canvasUrl)
    if (dropzoneImages.length > 0) {
      console.log("dropzoneImages[0]", dropzoneImages[0].base64)

    }

    const url = "http://127.0.0.1:7860/sdapi/v1/txt2img";
    // 'http://172.28.169.136:5000/sketch'
    const payload = {
      "init_images": [
        dropzoneImages.length > 0 ? dropzoneImages[0].base64 : canvasUrl
      ],
      "mask": canvasUrl,
      "prompt": "architecture hallway",
      "styles": [
        "concrete and metal",
        "architecture design",
        "cinematic",
        "hyper-realistic",
        "photo realistic",
        "8k render"
      ],
      "seed": -1,
      "subseed": -1,
      "subseed_strength": 0,
      "batch_size": 1,
      "n_iter": 1,
      "steps": 50,
      "cfg_scale": 7,
      "width": 512,
      "height": 512,
      "include_init_images": true,
    }
    try {
      // const data = await axios.post(url, { search_image: dataUrl });
      const { data } = await axios.post(url, { json: payload });
      console.log(data)

      for (var i = 0; i < data.images.length; i++) {

        // base64 encoded string representation of the image
        var imageString = data.images[i];
        console.log(data.images[i]);

        // Decode the base64 string
        var binary = atob(imageString.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''));

        // Create a typed array from the decoded string
        var typedArray = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i++) {
          typedArray[i] = binary.charCodeAt(i);
        }

        // Create a Blob object containing the typed array, and specify the 'image/png' MIME type
        var blob = new Blob([typedArray], { type: 'image/png' });

        // Create a URL that can be used to reference the newly created Blob object
        var imageUrl = URL.createObjectURL(blob);
        console.log(imageUrl)
        setImage(imageUrl)

      };

    } catch (error) {
      console.log(error);
    }    // setImages(images)

    setIsLoading(false);

  }

  const handleDownload = useCallback(() => {
    // if (!canvas || !canvas.current) return;

    setDataUrl(canvas.current.toDataURL("image/png"));
  }, [canvas]);

  const toolbarProps = { ...state, ...api, dataUrl, handleDownload };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: async (acceptedFiles) => {
      const imagePromises = acceptedFiles.map(async (file) => {
        const fileReader = new FileReader();
        return new Promise((resolve) => {
          fileReader.onload = (e) => {
            resolve({
              file,
              preview: URL.createObjectURL(file),
              base64: e.target.result,
            });
          };
          fileReader.readAsDataURL(file);
        });
      });

      const imageData = await Promise.all(imagePromises);
      setDropzoneImages(imageData);
    },
  });


  const thumbs = dropzoneImages.map((file) => (
    <div key={file.name}>
      <img style={{ "width": "10rem", "height": "10rem" }} key={file.name} src={file.preview} alt={file.name} />
    </div>
  ));


  return (
    <>
      <Intro isReady={isReady} init={init} />
      <Toolbar thumbs={thumbs} getRootProps={getRootProps} getInputProps={getInputProps} isOpen={isOpen} image={image} setIsOpen={setIsOpen} isLoading={isLoading} setIsLoading={setIsLoading} fetchImages={fetchImages} {...toolbarProps} />
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
