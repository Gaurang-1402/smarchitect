import React from "react";

export const Intro = ({ init, isReady }) => {
  return (
    <header className={isReady ? "hidden intro" : "intro"}>
      <div className="intro__content">
        <h1 style={{ "color": "black" }}>Smarchitect</h1>
        <button onClick={init} className="blob-btn">
          <span style={{ "color": "black" }}>Start painting</span>
        </button>
      </div>
    </header>
  );
};
