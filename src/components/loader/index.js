import React, { useEffect, useRef, useState } from 'react';
import './style.css';

const VideoLoader = ({ setAllLoading }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false); // New state to track video loading
  const videoRef = useRef();

  const handleVideoEnd = () => {
    setIsLoading(false);
    setAllLoading(false);
    document.body.style.overflow = "initial";
  };

  const handleVideoLoadStart = () => {
    setIsVideoLoaded(false); // Video loading started
  };

  const handleVideoLoadedData = () => {
    setIsVideoLoaded(true); // Video loaded
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setAllLoading(false);
    }, 10000);
  }, []);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "initial";
    }
  }, [isLoading]);

  return (
    <div className={`video-loader ${isLoading ? 'loading' : ''}`}>
      <img
        src={require("../../assets/gifs/output-onlinegiftools.gif")}
        alt=""
      />
    </div>
  );
};

export default VideoLoader;
