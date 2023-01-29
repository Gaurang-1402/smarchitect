import {
  faArrowsAltH,
  faEraser,
  faMagic,
  faPaintBrush,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { BrushPreview } from "./BrushPreview";
import DropzoneComponent from "./DropzoneComponent";

export const Toolbar = ({
  currentWidth,
  currentColor,
  handleDownload,
  dataUrl,
  handleClear,
  handleSpecialMode,
  handleEraserMode,
  setAutoWidth,
  handleRegularMode,
  handleColor,
  handleWidth,
  setCurrentSaturation,
  setCurrentLightness,
  isRegularMode,
  isAutoWidth,
  isEraser,
  setIsLoading,
  isLoading,
  isOpen,
  setIsOpen,
  image,
  fetchImages,
  thumbs,
  getRootProps,
  getInputProps,
  inputValue,
  handleChange
}) => {


  return (
    <aside >
      <div>
        <BrushPreview currentWidth={currentWidth} currentColor={currentColor} />
        <div className="tool-section tool-section--lrg">
          <div className="tool-section">
            <small>
              <strong>Brush color</strong>
            </small>
          </div>
          <input
            disabled={!isRegularMode}
            className="btn--color"
            type="color"
            id="toolColorPicker"
            onChange={handleColor}
          />
        </div>
        <div className="tool-section">
          <small>
            <strong>Tools</strong>
          </small>
        </div>
        <div className="tool-grid tool-section tool-section--lrg">
          <div>
            <button
              className={`btn btn--tool ${isRegularMode && !isEraser ? "btn--active" : ""
                }`}
              onClick={handleRegularMode}
            >
              <FontAwesomeIcon icon={faPaintBrush} />
            </button>
          </div>
          <div>
            <button
              className={`btn btn--tool ${!isRegularMode ? "btn--dream-active" : ""
                }`}
              onClick={handleSpecialMode}
            >
              <FontAwesomeIcon icon={faMagic} />
            </button>
          </div>
          <div>
            <button
              className={`btn btn--tool ${isEraser ? "btn--eraser-active" : ""
                }`}
              onClick={handleEraserMode}
            >
              <FontAwesomeIcon icon={faEraser} />
            </button>
          </div>
          <div>
            <input
              disabled={isEraser}
              checked={isAutoWidth}
              id="tool-autowidth"
              type="checkbox"
              onChange={setAutoWidth}
              title="Dynamic brush size"
            />{" "}
            <label
              htmlFor="tool-autowidth"
              className={`btn btn--tool ${isAutoWidth ? "btn--width-active" : ""
                }`}
            >
              <FontAwesomeIcon icon={faArrowsAltH} />
            </label>
          </div>
        </div>
        {!isAutoWidth && (
          <div className="tool-section tool-section--lrg">
            <div className="tool-section">
              <small>
                <strong>Brush size</strong>
              </small>
            </div>
            <div className="tool-section">
              <input
                defaultValue="10"
                type="range"
                min="10"
                max="90"
                onChange={handleWidth}
              />
            </div>
          </div>
        )}
        {!isRegularMode && (
          <div className="tool-section tool-section--lrg">
            <div className="tool-section">
              <small>
                <strong>Smarchitect</strong>
              </small>
            </div>
            <div className="tool-section">
              <label>
                <small>Saturation</small>
              </label>
              <input
                defaultValue="100"
                type="range"
                min="0"
                max="100"
                onChange={setCurrentSaturation}
              />
            </div>
            <label>
              <small>Lightness</small>
            </label>
            <input
              defaultValue="50"
              type="range"
              min="0"
              max="100"
              onChange={setCurrentLightness}
            />
          </div>
        )}
      </div>
      <div>

        <input
          type="text"
          placeholder="Enter your input here"
          value={inputValue}
          onChange={handleChange}
          style={{
            fontSize: '20px',
            padding: '12px',
            borderRadius: '4px',
            border: '2px solid #ffa600',
            boxShadow: '0px 0px 5px #ffa600',
            width: '100%',
            margin: '16px auto',
          }}
        />
        <DropzoneComponent thumbs={thumbs} getRootProps={getRootProps} getInputProps={getInputProps}></DropzoneComponent>

        {/* <>
          {isLoading ? (
            <button disabled>Loading...</button>
          ) : (
            <button className="btn btn--main btn--block" onClick={() => {
              setIsOpen(!isOpen);
              if (!isLoading) fetchImages();
            }}>Open Modal</button>
          )}
          {isOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <img src={image} alt={"created image"} />
                {/* <a href={} download>
              Download
            </a> 
                <button onClick={() => setIsOpen(false)}>Close</button>
              </div>
            </div>
          )}
        </>*/}
        <button className="btn btn--main btn--block" onClick={() => {
          setIsOpen(!isOpen);
          if (!isLoading) fetchImages();
        }}>
          {isOpen ? 'Reset' : 'Generate'}
        </button>
        {isOpen && (
          <div className="image-drawer">
            {isLoading ? (
              <div className="loading-text">Loading...</div>
            ) : (
              // <img src=${`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==`} alt="Red dot" />
              <img src={image} alt={"created image"} />
            )}
          </div>
        )}
        {/* <button className="btn btn--main btn--block" onClick={fetchImages}>Fetch Images</button> */}
        <a
          className="btn btn--main btn--block"
          download="image.png"
          onClick={handleDownload}
          href={dataUrl}
        >
          Save Canvas
        </a>

        <button className="btn btn--block" onClick={handleClear}>
          Clear
        </button>
      </div>
    </aside>
  );
};


