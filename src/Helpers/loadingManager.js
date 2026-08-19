let setLoadingState;
let setServerWakingState;
let wakeupTimer = null;

export const registerLoadingSetter = (setLoading, setServerWaking) => {
  setLoadingState = setLoading;
  setServerWakingState = setServerWaking;
};

export const showLoading = () => {
  if (setLoadingState) setLoadingState(true);

  // Nếu request kéo dài hơn 3.5s (dấu hiệu Render cold start), hiện thông báo đánh thức server
  if (!wakeupTimer) {
    wakeupTimer = setTimeout(() => {
      if (setServerWakingState) setServerWakingState(true);
    }, 3500);
  }
};

export const hideLoading = () => {
  if (wakeupTimer) {
    clearTimeout(wakeupTimer);
    wakeupTimer = null;
  }
  if (setServerWakingState) setServerWakingState(false);
  if (setLoadingState) setLoadingState(false);
};
