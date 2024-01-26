// Summary: This component is used to upload the profile picture of the user.


// importing libraries and dependencies
import React, { useState } from 'react';

// DndPic component
const DndPic = ({ handlePC }) => {

  // isDraggedOver: state to check if the file is dragged over
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  // fileList: list of files
  const [fileList, setFileList] = useState([]);

  // disp: state to display the file name
  const [disp, setDisp] = useState(false)

  // function to handle drag over 
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggedOver(true);
  };

  // function to handle drag leave
  const handleDragLeave = () => {
    setIsDraggedOver(false);
  };

  // function to handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggedOver(false);
    handlePC(e.dataTransfer.files[0])
    setDisp(e.dataTransfer.files[0].name)
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  // function to handle input change
  const handleInputChange1 = (e) => {
    const files = e.target.files;
    console.log("pic upload");
    handlePC(files[0])
    setDisp(files[0].name)
  };

  // function to handle files
  const handleFiles = (files) => {
    const newFileList = [];
    for (const file of files) {
      newFileList.push(`${file.name} (${formatBytes(file.size)})`);
    }
    setFileList(newFileList);
  };

  // function to format bytes
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  // returning the DndPic component
  return (
    <div className="w-full  bg-transparent rounded-lg shadow-lg">
      <div
        className={`bg-gray-700 p-8 text-center rounded-lg border-dashed border-2 border-gray-300 ${isDraggedOver ? 'border-blue-500 hover:shadow-md transform hover:scale-105' : ''}`}
        id="dropzone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center space-y-2">
          <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          {disp ? (
            <div>{disp}</div>
          ) : (
            <div>
              <span className="text-gray-200">Drag and drop your files here</span><br />
              <span className="text-gray-500 text-sm">(or click to select)</span>
            </div>
          )}
        </label>
        <input type="file" id="fileInput" className="hidden" accept="image/png, image/jpeg" onChange={handleInputChange1} />
      </div>
    </div>

  );
}

export default DndPic