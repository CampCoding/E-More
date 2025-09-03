// LazyLoadedVideo.js

import React from 'react';

const LazyLoadedVideo = () => {
  return (
    <video id="loadingVideo" autoPlay muted>
      <source
        src={require('../../assets/videos/Logo Animation - 3.mp4')}
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
  );
};

export default LazyLoadedVideo;
