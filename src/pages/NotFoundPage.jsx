import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Home } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9F9FF] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 text-[#C8102E] flex items-center justify-center mb-4">
        <Bus className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-1">Route Not Found</h1>
      <p className="text-xs text-slate-500 max-w-xs mb-6">
        The BMTC transit terminal or page you are trying to visit does not exist.
      </p>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="px-6 py-2.5 rounded-xl bg-[#C8102E] text-white font-bold text-xs flex items-center gap-2 hover:bg-red-700 shadow-md"
      >
        <Home className="w-4 h-4" />
        <span>Return to BMTC Home</span>
      </button>
    </div>
  );
}

