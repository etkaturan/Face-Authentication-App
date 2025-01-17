import React, { useRef, useEffect } from "react";

const FaceDetectionIcon = ({ onRecognize }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;

        // Wait for the video to be ready before playing
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startVideo();

    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg");
    onRecognize(imageData);
  };

  return (
    <div>
      <video
        ref={videoRef}
        className="hidden"
        onLoadedData={() => setTimeout(handleCapture, 2000)} // Simulate auto-capture
      />
      <div className="w-24 h-24 bg-blue-500 rounded-full animate-pulse flex items-center justify-center">
        <p className="text-white font-bold text-lg">Scanning...</p>
      </div>
    </div>
  );
};

export default FaceDetectionIcon;
