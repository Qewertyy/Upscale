import React, { useRef, useState } from 'react';
import { Card, CardContent } from './card';


interface DropzoneProps {
  onChange: React.Dispatch<React.SetStateAction<FileList | []>>;
  className?: string;
  fileTypes?: Array<string>;
  multiple?: boolean;
}


export function Dropzone({
  onChange,
  className,
  fileTypes,
  multiple,
  ...props
}: DropzoneProps) {

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileInfo, setFileInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;
    handleFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    const uploadedFile = files[0];

    if (fileTypes && !fileTypes.includes(uploadedFile.type)) {
        setError(`Invalid file type. Expected: ${fileTypes.join(", ")}`);
        return;
    }

    const fileSizeInKB = Math.round(uploadedFile.size / 1024);
    onChange(files as FileList);

    setFileInfo(`Selected file: ${uploadedFile.name} (${fileSizeInKB} KB)`);
    setError(null);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card
      className={`border-solid hover:cursor-pointer input hover:scale-105 transition-transform ${className}`}
      {...props}
      onClick={handleButtonClick}
    >
      <CardContent
        className="flex flex-col items-center justify-center space-y-2 px-2 py-4 text-xs"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-center text-muted-foreground">
          <span className="font-medium text-base">Drag Files to Upload</span>
          <input
            ref={fileInputRef}
            type="file"
            accept={fileTypes?.join(", ")} // Set accepted file type
            onChange={handleFileInputChange}
            className="hidden"
            multiple={multiple}
          />
        </div>
        {fileInfo && <p className="text-muted-foreground">{fileInfo}</p>}
        {error && <span className="text-red-500">{error}</span>}
      </CardContent>
    </Card>
  );
}