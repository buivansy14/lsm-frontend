import { useRef } from 'react';
import YouTube from 'react-youtube';

import Modal from './Modal';

const SettingVideoHD = ({ isOpen, closeModal }) => {
  const playerRef = useRef(null);

  const getYouTubeVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([^"&?\/\s]+)/
    );
    return match ? match[1] : null;
  };
  const videoId = getYouTubeVideoId(
    'https://www.youtube.com/watch?v=CEDTEQt5d7k'
  );

  const options = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      disablekb: 1,
    },
  };
  const onReady = (event) => {
    playerRef.current = event.target;
    event.target.mute();
  };
  return (
    <div height={600}>
      <Modal
        title="Chỉnh sửa độ phân giải video (Chỉ setting lần đầu tiên)"
        isOpen={isOpen}
        onClose={closeModal}
        height={400}
      >
        <>
          <YouTube
            videoId={videoId}
            opts={options}
            className="youtube-container"
            onReady={onReady}
          />
        </>
      </Modal>
    </div>
  );
};

export default SettingVideoHD;
