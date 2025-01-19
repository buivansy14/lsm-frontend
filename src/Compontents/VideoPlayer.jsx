import { useEffect, useRef } from 'react';
import videojs from 'video.js';

const VideoPlayer = ({ videoUrl, onEnded }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    let playerInstance;
    console.log({ videoUrl });

    if (videoRef.current) {
      // Nếu chưa có instance, khởi tạo
      playerInstance = videojs(videoRef.current, {
        autoplay: true,
        controls: true,
        preload: 'auto',
        fluid: true,
        fill: true,
      });

      // Lắng nghe sự kiện kết thúc
      playerInstance.on('ended', onEnded);
    }

    // Cập nhật nguồn video mỗi khi `videoUrl` thay đổi
    if (playerInstance && videoUrl) {
      playerInstance.src({ type: 'application/x-mpegURL', src: videoUrl });
      playerInstance.play(); // Tự động phát video mới
    }

    return () => {
      if (playerInstance) {
        playerInstance.dispose(); // Dọn dẹp instance khi unmount
      }
    };
  }, [videoUrl, onEnded]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin"
        controls
        preload="auto"
      >
        <source src={videoUrl} type="application/x-mpegURL" />
      </video>
    </div>
  );
};

export default VideoPlayer;
