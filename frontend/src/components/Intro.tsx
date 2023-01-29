import React from "react";

interface Props {
  init?: any;
  isReady?: boolean;
}

export const Intro: React.FC<Props> = ({ init, isReady }) => {
  return (
    <header className={isReady ? "hidden intro" : "intro"}>
      <div className="intro__content">
        <h1 style={{"color":"black"}}>Smarchitect</h1>
        <button onClick={init} className="blob-btn">
          <span style={{"color":"black"}}>Start painting</span>
          <span className="blob-btn__inner">
            <span className="blob-btn__blobs">
              <span className="blob-btn__blob"></span>
              <span className="blob-btn__blob"></span>
              <span className="blob-btn__blob"></span>
              <span className="blob-btn__blob"></span>
            </span>
          </span>
        </button>
 
      </div>
    </header>
  );
};
