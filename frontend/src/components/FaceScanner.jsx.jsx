import React, { useRef, useEffect, useState } from "react";

const FaceScanner = ({ onRecognized }) => {
  const videoRef = useRef(null);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const startVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    };

    startVideo();

    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleRecognition = async () => {
    if (!scanning) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg");
    const response = await fetch("http://127.0.0.1:5000/api/auth/recognize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: imageData }),
    });

    const data = await response.json();
    if (data.success) {
      setScanning(false);
      onRecognized(data.user, data.similarity_score); // Pass user and score
    }
  };

  useEffect(() => {
    const interval = setInterval(handleRecognition, 1000); // Check every second
    return () => clearInterval(interval);
  }, [scanning]);

  return (
    <div>
      <video ref={videoRef} className="w-full h-auto" />
      {scanning && <p>Scanning for your face...</p>}
    </div>
  );
};

export default FaceScanner;
