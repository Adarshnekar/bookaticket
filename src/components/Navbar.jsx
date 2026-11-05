import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell, Bus, X, ShieldCheck } from 'lucide-react';

export default function Navbar({ title, showBack = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Bus 335E is on time',
      desc: 'Approaching Domlur TTMC bay at 08:35 AM.',
      time: '2 mins ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Digital Ticket Discount',
      desc: '₹0 convenience fees applied on all UPI bookings today.',
      time: '1 hour ago',
      unread: false,
    },
    {
      id: 3,
      title: 'Smart Card Pass Active',
      desc: 'Monthly Vajra Pass is active and eligible for express routes.',
      time: 'Yesterday',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#C8102E] text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          ) : (
            <div
              onClick={() => navigate('/')}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
            >
              <Bus className="w-5 h-5 text-white" />
            </div>
          )}

          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-base leading-none">
                  BMTC Namma Ride
                </span>
                <span className="bg-red-800/80 text-[10px] font-medium px-1.5 py-0.5 rounded text-amber-200 border border-amber-300/30">
                  ನಮ್ಮ ಬಸ್
                </span>
              </div>
              {title && (
                <p className="text-[11px] text-red-100 font-medium leading-tight mt-0.5 opacity-90">
                  {title}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1">
          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-[#C8102E]"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 text-slate-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Bell className="w-4 h-4 text-bmtc-red" />
                    <span>BMTC Alerts & Updates</span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-lg text-xs transition-colors ${
                        item.unread ? 'bg-red-50/70 border border-red-100' : 'bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{item.title}</span>
                        <span className="text-[10px] text-slate-400">{item.time}</span>
                      </div>
                      <p className="text-slate-600 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

