import './YouTubePlayer.css';

import YouTube from 'react-youtube';

const YouTubePlayer = ({ videoUrl, onEnded }) => {
  const getYouTubeVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([^"&?\/\s]+)/
    );
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  if (!videoId) {
    return <p className="text-red-500">Invalid YouTube URL</p>;
  }

  const options = {
    width: '90%',
    height: '80%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
      rel: 0,
      // disablekb: 1,
      showinfo: 0,
    },
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <YouTube
        videoId={videoId}
        opts={options}
        onEnd={onEnded}
        className="youtube-container"
      />
    </div>
  );
};

export default YouTubePlayer;
