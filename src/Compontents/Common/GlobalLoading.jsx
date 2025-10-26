import { useEffect, useState } from 'react';

import { registerLoadingSetter } from '../../Helpers/loadingManager';

const GlobalLoading = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    registerLoadingSetter(setLoading);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999]">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default GlobalLoading;
