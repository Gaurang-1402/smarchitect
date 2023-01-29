import React from "react";
import myGif from "../images/my.gif";
import imageUrl from "../images/abcd.png";
import buttonUrl from "../images/button.png";

export const Intro = ({ init, isReady }) => {
  return (
    <header className={isReady ? "hidden intro" : "intro brown-backgrdound"}>
      <>
      <div className="landing-page">
          <div className="left-side">
            <img style={{ "width": "50rem", }} src={myGif} alt="Animated gif" />
            <h1 style={{ "color": "#FCE3CF" }}>search for precedents with a sketch.</h1>
            <button onClick={init} className="blob-btn">
            {/* <img className="brown-background" src={buttonUrl} alt="start" /> */}
            <h2>start</h2>
            </button>
          </div>
        <div className="right-side">
        <img src={imageUrl} alt="Static" />
          </div>
      </div>
      </>
    </header>
  );
};

