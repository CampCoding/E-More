import React, { useRef, useEffect } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ src }) => {
  const videoRef = useRef();

  
  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource("https://vz-7e09b3fd-ad4.b-cdn.net/6ce46262-5407-4448-b99f-cf611b27cb56/playlist.m3u8?token=JAzTqNj3FpZNbldJcYGtlxWgGXmywHXi1zd0k6LZuVw&expires=3.6E+31&token_path=%2F6ce46262-5407-4448-b99f-cf611b27cb56%2F"); // src = your .m3u8 signed URL
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0.1;
        }
      });
      
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = "https://vz-7e09b3fd-ad4.b-cdn.net/6ce46262-5407-4448-b99f-cf611b27cb56/playlist.m3u8?token=JAzTqNj3FpZNbldJcYGtlxWgGXmywHXi1zd0k6LZuVw&expires=3.6E+31&token_path=%2F6ce46262-5407-4448-b99f-cf611b27cb56%2F";
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      style={{ width: "100%", maxWidth: "800px" }}
    />
  );
};

export default VideoPlayer;
