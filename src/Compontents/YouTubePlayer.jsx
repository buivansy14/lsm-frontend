import './YouTubePlayer.css';

import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';

const YouTubePlayer = ({ videoUrl, onEnded }) => {
  const [hide, setHide] = useState(true);
  const getYouTubeVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([^"&?\/\s]+)/
    );
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  const onPlay = () => {
    setHide(false);
  };

  if (!videoId) {
    return <p className="text-red-500">Invalid YouTube URL</p>;
  }

  const options = {
    width: '120%',
    height: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
      rel: 0,
      iv_load_policy: 3,
    },
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="youtube-overlay-top"></div>{' '}
      <YouTube
        videoId={videoId}
        opts={options}
        onEnd={onEnded}
        onPlay={onPlay}
        className="youtube-container"
      />
      {hide && <div className="youtube-overlay-bottom"></div>}
      <div className="youtube-overlay-youtube"></div>
    </div>
  );
};

export default YouTubePlayer;
