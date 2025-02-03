import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';

const VideoPlayer = ({ videoUrl, onEnded }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

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

    // Xử lý lỗi phát video
    playerRef.current.on('error', () => {
      const error = playerRef.current.error();
      console.error('Video playback error:', error);

      // Nếu gặp lỗi 423, thử lại tối đa 3 lần
      if (error && error.code === 4 && retryCount < MAX_RETRIES) {
        console.log(`Retrying... Attempt ${retryCount + 1}`);
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          playerRef.current.src({
            type: 'application/x-mpegURL',
            src: videoUrl,
          });
          playerRef.current.load();
          playerRef.current
            .play()
            .catch((err) => console.error('Retry failed:', err));
        }, 1000);
      }
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
