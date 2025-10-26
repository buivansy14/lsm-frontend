let setLoadingState;

export const registerLoadingSetter = (fn) => {
  setLoadingState = fn;
};

export const showLoading = () => {
  if (setLoadingState) setLoadingState(true);
};

export const hideLoading = () => {
  if (setLoadingState) setLoadingState(false);
};
