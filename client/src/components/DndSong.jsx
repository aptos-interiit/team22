
import React, { useState } from 'react';


const DndSong = ({handleSn}) => {
    const [isDraggedOver, setIsDraggedOver] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [disp,setDisp]=useState(false)

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDraggedOver(true);
      };
    
      const handleDragLeave = () => {
        setIsDraggedOver(false);
      };
    
      const handleDrop = (e) => {
        e.preventDefault();
        setIsDraggedOver(false);
        handleSn(e.dataTransfer.files[0])
        setDisp(e.dataTransfer.files[0].name)
        const files = e.dataTransfer.files;
        handleFiles(files);
      };

      const handleInputChange = (e) => {
        console.log('song input');
        const files = e.target.files;
        handleSn(files[0])
        setDisp(files[0].name)
        // console.log(files[0]);
        // handleFiles(files);
      };
      const handleFiles = (files) => {
        const newFileList = [];
    
        for (const file of files) {
          newFileList.push(`${file.name} (${formatBytes(file.size)})`);
        }
    
        setFileList(newFileList);
      };

      const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
    
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
    
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };
    

      return (
        
          <div className="w-full  bg-transparent rounded-lg shadow-lg">
            
            <div
              className={`bg-gray-700 p-8 text-center rounded-lg border-dashed border-2 border-gray-300 ${
                isDraggedOver ? 'border-blue-500 hover:shadow-md transform hover:scale-105' : ''
              }`}
              id="dropzone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <label htmlFor="songInput" className="cursor-pointer flex flex-col items-center space-y-2">
                <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                {disp ?(
                  <div>{disp}</div>
                ):(
                  <div>
                    <span className="text-gray-200">Drag and drop your files here</span><br />
                <span className="text-gray-500 text-sm">(or click to select)</span>
                  </div>
                )}
              </label>
              <input type="file" id="songInput" className="hidden" accept=".mp3" onChange={handleInputChange} />
            </div>
            {/* <div className="mt-6 text-center text-white" id="fileList">
              {fileList.map((file, index) => (
                <div key={index}>{file}</div>
              ))}
            </div> */}
          </div>
      
      );
}

export default DndSong