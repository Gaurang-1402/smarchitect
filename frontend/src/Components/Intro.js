import React from 'react'

const Intro = ({ init, isReady }) => {
  return (
    <header className={isReady ? "hidden intro" : "intro"}>
      <div className="intro__content">
        <h1>Smarchitect</h1>
        <button onClick={init} className="blob-btn">
          <span className="blob-text">start</span>
        </button>
        <p>

        </p>
      </div>
    </header>
  )
}

export default Intro