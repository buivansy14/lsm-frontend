import { useEffect } from 'react';

export const useLockBodyScroll = (isLocked = true) => {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [isLocked]);
};
