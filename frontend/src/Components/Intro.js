import React from 'react'

const Intro = ({init, isReady}) => {
  return (
    <div className={isReady ? "hidden intro" : "intro"}>

        <div className="intro__content">
        {/* <h1>Magic Painter</h1>
        <button onClick={init} className="blob-btn">
          <span className="blob-text">Start painting</span>
          <span className="blob-btn__inner">
            <span className="blob-btn__blobs">
              <span className="blob-btn__blob"></span>
              <span className="blob-btn__blob"></span>
              <span className="blob-btn__blob"></span>
              <span className="blob-btn__blob"></span>
            </span>
          </span>
        </button> */}
        </div>
    </div>
  )
}

export default Intro