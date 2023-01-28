import { useCallback, useRef, useState } from 'react'

export const usePainter = () => {

    const canvas = useRef()

    // initialize pen modes
    const [isReady, setIsReady] = useState(false)
    const [isRegularMode, setIsRegularMode] = useState(true)
    const [isAutoWidth, setIsAutoWidth] = useState(false)
    const [isEraser, setIsEraser] = useState(false)

    // initialize pen stats
    const [currentColor, setCurrentColor] = useState('#000000')
    const [currentWidth, setCurrentWidth] = useState(50)

    const autoWidth = useRef(false)

    const selectedSaturation = useRef(100)
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

    // The canvas context is first obtained from the canvas element using canvas.current.getContext("2d") and stored in the "context" variable
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

    // event handler for the "mousedown" event, which is fired when the mouse button is pressed down on an element
    const handleMouseDown = useCallback((e) => {

        // isDrawing.current state to "true" to indicate that the user has started drawing on the canvas
        isDrawing.current = true;

        // set the "lastX.current" and "lastY.current" state variables to the current cursor position on the canvas, represented by the "e.offsetX" and "e.offsetY" properties of the event object. This will be used as the starting point for the next line segment when the user moves the cursor
        [lastX.current, lastY.current] = [e.offsetX, e.offsetY];
    }, []);

    //  This function will be used to change the width of the line being drawn on the canvas.
    const dynamicLineWidth = useCallback(() => {

        //  first checks if the canvas context exists and if it does, it then checks if the current line width of the context is greater than 90 or less than 10, if so it will change the direction of the line width change using the direction.current state variable.
        if (!context || !context.current) {
            return;
        }

        // Then it will increment or decrement the line width depending on the direction.current state variable. The context.current.lineWidth++ or context.current.lineWidth-- will increase or decrease the width of the line being drawn.
        if (context.current.lineWidth > 90 || context.current.lineWidth < 10) {
            direction.current = !direction.current;
        }

        // Finally, the function sets the currentWidth state variable to the current line width of the context using setCurrentWidth(context.current.lineWidth). This allows the component using this function to have access to the current width of the line being drawn.
        direction.current ? context.current.lineWidth++ : context.current.lineWidth--;
        setCurrentWidth(context.current.lineWidth);
    }, []);
    const drawNormal = useCallback((e) => {
        if (!isDrawing.current || !context.current) return;

        if (isRegularPaintMode.current || isEraserMode.current) {
            context.current.strokeStyle = selectedColor.current;

            setCurrentColor(selectedColor.current);

            autoWidth.current && !isEraserMode.current
                ? dynamicLineWidth()
                : (context.current.lineWidth = selectedLineWidth.current);

            isEraserMode.current
                ? (context.current.globalCompositeOperation = "destination-out")
                : (context.current.globalCompositeOperation = "source-over");
        } else {
            setCurrentColor(
                `hsl(${hue.current},${selectedSaturation.current}%,${selectedLightness.current}%)`,
            );
            context.current.strokeStyle = `hsl(${hue.current},${selectedSaturation.current}%,${selectedLightness.current}%)`;
            context.current.globalCompositeOperation = "source-over";

            hue.current++;

            if (hue.current >= 360) hue.current = 0;

            autoWidth.current
                ? dynamicLineWidth()
                : (context.current.lineWidth = selectedLineWidth.current);
        }
        drawOnCanvas(e);
    },
        [drawOnCanvas, dynamicLineWidth],
    );

    const stopDrawing = useCallback(() => {
        isDrawing.current = false;
    }, []);

    const init = useCallback(() => {
        context.current = canvas?.current?.getContext("2d");
        if (canvas && canvas.current && context && context.current) {
            canvas.current.addEventListener("mousedown", handleMouseDown);
            canvas.current.addEventListener("mousemove", drawNormal);
            canvas.current.addEventListener("mouseup", stopDrawing);
            canvas.current.addEventListener("mouseout", stopDrawing);

            canvas.current.width = window.innerWidth - 196;
            canvas.current.height = window.innerHeight;

            context.current.strokeStyle = "#000";
            context.current.lineJoin = "round";
            context.current.lineCap = "round";
            context.current.lineWidth = 10;
            setIsReady(true);
        }
    }, [drawNormal, handleMouseDown, stopDrawing]);

    const handleRegularMode = useCallback(() => {
        setIsRegularMode(true);
        isEraserMode.current = false;
        setIsEraser(false);
        isRegularPaintMode.current = true;
    }, []);

    const handleSpecialMode = useCallback(() => {
        setIsRegularMode(false);
        isEraserMode.current = false;
        setIsEraser(false);
        isRegularPaintMode.current = false;
    }, []);

    const handleColor = (e) => {
        setCurrentColor(e.currentTarget.value);
        selectedColor.current = e.currentTarget.value;
    };

    const handleWidth = (e) => {
        setCurrentWidth(e.currentTarget.value);
        selectedLineWidth.current = e.currentTarget.value;
    };

    const handleClear = useCallback(() => {
        if (!context || !context.current || !canvas || !canvas.current) {
            return;
        }
        context.current.clearRect(0, 0, canvas.current.width, canvas.current.height);
    }, []);

    const handleEraserMode = (e) => {
        autoWidth.current = false;
        setIsAutoWidth(false);
        setIsRegularMode(true);
        isEraserMode.current = true;
        setIsEraser(true);
    };

    const setCurrentSaturation = (e) => {
        setCurrentColor(
            `hsl(${hue.current},${e.currentTarget.value}%,${selectedLightness.current}%)`,
        );
        selectedSaturation.current = e.currentTarget.value;
    };

    const setCurrentLightness = (e) => {
        setCurrentColor(
            `hsl(${hue.current},${selectedSaturation.current}%,${e.currentTarget.value}%)`,
        );
        selectedLightness.current = e.currentTarget.value;
    };

    const setAutoWidth = (e) => {
        autoWidth.current = e.currentTarget.checked;
        setIsAutoWidth(e.currentTarget.checked);

        if (!e.currentTarget.checked) {
            setCurrentWidth(selectedLineWidth.current);
        } else {
            setCurrentWidth(context?.current?.lineWidth ?? selectedLineWidth.current);
        }
    };


    return [
        {
            canvas,
            isReady,
            currentWidth,
            currentColor,
            isRegularMode,
            isAutoWidth,
            isEraser,
        },
        {
            init,
            handleRegularMode,
            handleSpecialMode,
            handleColor,
            handleWidth,
            handleClear,
            handleEraserMode,
            setAutoWidth,
            setCurrentSaturation,
            setCurrentLightness,
        },
    ]
}

