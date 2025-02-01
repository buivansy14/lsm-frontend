import { useEffect, useRef } from 'react';
import videojs from 'video.js';

const VideoPlayer = ({ videoUrl, onEnded }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize video.js player
    playerRef.current = videojs(videoRef.current, {
      autoplay: true,
      controls: true,
      preload: 'auto',
      fluid: true,
      fill: true,
    });

    // Handle 'ended' event
    playerRef.current.on('ended', () => {
      onEnded();
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose(); // Dispose player on cleanup
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (playerRef.current && videoUrl) {
      playerRef.current.src({ type: 'application/x-mpegURL', src: videoUrl });

      playerRef.current.one('canplay', () => {
        playerRef.current.play().catch((error) => {
          console.error('Error playing the video:', error);
        });
      });
    }
  }, [videoUrl]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin"
        controls
        preload="auto"
      />
    </div>
  );
};

export default VideoPlayer;
