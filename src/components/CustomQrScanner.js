import React, { useRef, useEffect, useState } from 'react';
import jsQR from 'jsqr';

const CustomQrScanner = ({ onScan, onError, delay }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const scaleFactor = 2;
        canvas.width = video.videoWidth * scaleFactor;
        canvas.height = video.videoHeight * scaleFactor;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        try {
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            onScan(code.data);
          }
        } catch (error) {
          onError(error);
        }
      }
    };

    if (!isScanning) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
          setIsScanning(true);
        })
        .catch(onError);
    }

    const interval = setInterval(scan, delay);

    return () => {
      clearInterval(interval);
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [delay, onError, onScan, isScanning]);

  return (
    <div>
      <video ref={videoRef} style={{ width: '400px', height: '400px'}} playsInline muted />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CustomQrScanner;
