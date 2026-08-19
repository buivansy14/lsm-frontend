import { useEffect, useState } from 'react';
import { FiClock, FiServer, FiZap } from 'react-icons/fi';

import { registerLoadingSetter } from '../../Helpers/loadingManager';

const GlobalLoading = () => {
  const [loading, setLoading] = useState(false);
  const [serverWaking, setServerWaking] = useState(false);

  useEffect(() => {
    registerLoadingSetter(setLoading, setServerWaking);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[9999] p-4 transition-all duration-300 animate-fadeIn">
      <div className="flex flex-col items-center justify-center bg-[#131b2e]/95 border border-slate-700/80 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl space-y-5">
        
        {/* Spinner Animation */}
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 rounded-full border-4 border-slate-800 border-t-amber-400 border-r-yellow-500 animate-spin" />
          <FiServer className="absolute text-amber-400" size={20} />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h4 className="text-base font-bold text-white">
            {serverWaking ? 'Đang khởi động máy chủ...' : 'Đang xử lý...'}
          </h4>
          
          {serverWaking ? (
            <p className="text-xs text-slate-300 leading-relaxed bg-[#0b0f19]/70 p-3 rounded-xl border border-slate-800 text-start">
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                <FiZap size={13} />
                Lần truy cập đầu tiên
              </span>
              Máy chủ đang được đánh thức sau thời gian nghỉ. Quá trình này mất khoảng 20 - 30 giây, vui lòng đợi trong giây lát...
            </p>
          ) : (
            <p className="text-xs text-slate-400">
              Vui lòng chờ trong giây lát
            </p>
          )}
        </div>

        {serverWaking && (
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 h-full w-2/3 rounded-full animate-pulse" />
          </div>
        )}

      </div>
    </div>
  );
};

export default GlobalLoading;
