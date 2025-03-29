import './YouTubePlayer.css';

import { useEffect, useRef, useState } from 'react';
import {
  FaPause,
  FaPlay,
  FaVolumeMute,
  FaVolumeUp,
  FaYoutube,
} from 'react-icons/fa';
import { FiMaximize, FiMinimize } from 'react-icons/fi'; // Import icon
import YouTube from 'react-youtube';

const YouTubePlayer = ({ videoUrl, onEnded }) => {
  const [hide, setHide] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef(null);

  const options = {
    width: '120%',
    height: '100%',
    playerVars: {
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      disablekb: 1,
    },
  };
  const getYouTubeVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([^"&?\/\s]+)/
    );
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  const onPlay = () => {
    setHide(false);
    if (playerRef.current) {
      const currentQuality = playerRef.current.getPlaybackQuality();
      if (
        currentQuality !== 'hd1080' &&
        playerRef.current.getAvailableQualityLevels().includes('hd1080')
      ) {
        playerRef.current.setPlaybackQuality('hd1080');
      }
    }
  };

  const handleOnClick = () => {
    if (playerRef.current) {
      const playerState = playerRef.current.getPlayerState();
      if (playerState === 1) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        setCurrentTime(playerRef.current.getCurrentTime());
        setDuration(playerRef.current.getDuration());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const togglePlayPause = () => {
    if (playerRef.current) {
      const playerState = playerRef.current.getPlayerState();
      if (playerState === 1) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
    }
  };

  const handleSeek = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime);
    }
  };

  const handleFullScreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const onReady = (event) => {
    playerRef.current = event.target;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        alert('🚫 Không thể mở DevTools');
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const onQualityChange = (event) => {
    if (
      event.target.getPlaybackQuality() !== 'hd1080' &&
      event.target.getAvailableQualityLevels().includes('hd1080')
    ) {
      event.target.setPlaybackQuality('hd1080');
    }
  };

  return (
    <div
      className={`w-full h-full flex justify-center items-center video-container ${
        isFullscreen ? 'fullscreen' : ''
      }`}
    >
      <div className="youtube-overlay-top"></div>{' '}
      <div className="overlay-container" onClick={handleOnClick}>
        {!isPlaying && (
          <div className="play-icon">
            <FaYoutube size={60} color="red" />
          </div>
        )}
      </div>
      <YouTube
        videoId={videoId}
        opts={options}
        onEnd={onEnded}
        onPlay={onPlay}
        className="youtube-container"
        onReady={onReady}
        onPlaybackQualityChange={onQualityChange}
      />
      {/* Custom Controls */}
      {!hide && (
        <div
          className={`controls ${isFullscreen ? 'controls-fullscreen' : ''}`}
        >
          <button onClick={togglePlayPause} className="control-btn">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>

          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="progress-bar"
          />

          <span className="time">
            {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60)} /{' '}
            {Math.floor(duration / 60)}:{Math.floor(duration % 60)}
          </span>

          <button onClick={toggleMute} className="control-btn">
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-bar"
          />

          <button onClick={handleFullScreen} className="control-btn">
            {isFullscreen ? <FiMinimize size={24} /> : <FiMaximize size={24} />}
          </button>
        </div>
      )}
      {hide && <div className="youtube-overlay-bottom"></div>}
      <div className="youtube-overlay-youtube"></div>
    </div>
  );
};

export default YouTubePlayer;
