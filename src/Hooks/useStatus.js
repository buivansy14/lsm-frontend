import { useSelector } from 'react-redux';

export const useIsRequestPending = (sliceName, actionName) => {
  return useSelector(
    (state) => state.apiSlice?.[sliceName]?.[actionName]?.status === 'pending'
  );
};
