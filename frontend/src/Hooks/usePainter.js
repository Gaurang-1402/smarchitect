import { useCallback, useRef, useState } from 'react'

const usePainter = () => {

    const canvas = useRef()
    const [isReady, setIsReady] = useState(false)
    const [isRegularMode, setIsRegularMode] = useState(true)
    const [isAutoWidth, setIsAutoWidth] = useState(false)
    const [isEraser, setIsEraser] = useState(false)

    const [currentColor, setCurrentColor] = useState('#000000')
    const [currentWidth, setCurrentWidth] = useState(50)

    const autoWidth = useRef(false)

    const selectSaturation = useRef(100)
    const selectedLightness = useRef(50)
    const selectedColor = useRef('#000000')
    const selectedLineWidth = useRef(50)
    const lastX = useRef(0)
    const lastY = useRef(0)
    const hue = useRef(0)
    const isDrawing = useRef(false)
    const direction = useRef(true)
    const isRegularPaintMode = useRef(true)
    const isEraserMode = useRef(false)

    // The canvas context is first obtained from the canvas element using canvas.current.getContext("2d") and stored in the "ctx" variable
    const context = useRef(canvas?.current?.getContext('2d'))

    // checks if the canvas context exists and if it does, 
    // it starts a new path, moves the cursor to the last known position, 
    // draws a line to the current cursor position and strokes it
    const drawOnCanvas = useCallback((event) => {
        if (!context || !context.current) {
            return;
        }
        context.current.beginPath();
        context.current.moveTo(lastX.current, lastY.current);
        context.current.lineTo(event.offsetX, event.offsetY);
        context.current.stroke();

        [lastX.current, lastY.current] = [event.offsetX, event.offsetY];
    }, []);
    return (
        <div>usePainter</div>
    )
}

export default usePainter