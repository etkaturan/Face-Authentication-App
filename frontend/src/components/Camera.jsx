import React, { useRef, useState } from "react";

const Camera = ({ onCapture }) => {
  const videoRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.play();
  };

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg");
    onCapture(imageData);
    setIsCapturing(false);
    stopCamera();
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
  };

  return (
    <div className="flex flex-col items-center">
      {!isCapturing ? (
        <button
          onClick={() => {
            setIsCapturing(true);
            startCamera();
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Start Camera
        </button>
      ) : (
        <>
          <video ref={videoRef} className="w-full h-64 border rounded mb-4" />
          <button
            onClick={captureImage}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Capture Image
          </button>
        </>
      )}
    </div>
  );
};

export default Camera;
