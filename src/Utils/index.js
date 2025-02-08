export const convertSecondsToDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${hours}h${minutes}p`;
};

export const formatSecondsToMMSS = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const roundedSeconds = Math.round(seconds % 60);

  if (roundedSeconds === 60) {
    return `${String(minutes + 1).padStart(2, '0')}:00`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(roundedSeconds).padStart(
    2,
    '0'
  )}`;
};

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const insertDashEveryTwoChars = (id) => {
  return id.replace(/(\d{2})(?=\d)/g, '$1-');
};

export const removeDashes = (id) => {
  return id.replace(/-/g, '');
};

export const convertTimeToSeconds = (timeString) => {
  const [minutes, seconds] = timeString.split(':').map(Number);
  return minutes * 60 + seconds;
};
