import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const DropzoneComponent = ({ thumbs, getRootProps, getInputProps }) => {
  return (
    <div>    <section>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag and drop some files here, or click to select files</p>
      </div>
      <aside>{thumbs}</aside>
    </section></div>
  )
}

export default DropzoneComponent