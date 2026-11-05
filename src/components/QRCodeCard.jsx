import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Scan, Maximize2, X, Sun, ShieldCheck } from 'lucide-react';

export default function QRCodeCard({ qrData, ticketId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <>
      {/* On-card QR Box */}
      <div className="flex flex-col items-center">
        <div
          onClick={() => setIsModalOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsModalOpen(true);
            }
          }}
          className="group relative bg-white p-3.5 rounded-2xl shadow-md border border-slate-100 cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-95"
          title="Tap to enlarge QR Code for BMTC Conductor"
        >
          <div className="relative">
            <QRCodeSVG
              value={qrData}
              size={155}
              level="H"
              includeMargin={false}
              className="rounded-lg"
            />
            {/* Subtle center logo overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-7 h-7 bg-white rounded-md p-1 shadow-sm border border-red-200 flex items-center justify-center">
                <span className="text-[9px] font-black text-[#C8102E]">BMTC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tap to Enlarge button / label matching screenshot */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white transition-colors cursor-pointer"
        >
          <Scan className="w-3.5 h-3.5 text-red-200" />
          <span>Tap to enlarge for Conductor</span>
        </button>
      </div>

      {/* Fullscreen Enlarge Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className={`relative rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl transition-all ${
              highContrast ? 'bg-white text-black' : 'bg-slate-900 text-white'
            }`}
          >
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/20 hover:bg-slate-800/40 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="inline-block bg-[#C8102E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                BMTC ELECTRONIC PASS
              </span>
              <h4 className="text-base font-extrabold">Scan Digital Ticket</h4>
              <p className="text-xs opacity-70">
                Ticket ID: <span className="font-mono font-bold">{ticketId}</span>
              </p>
            </div>

            {/* High Resolution QR */}
            <div className="bg-white p-5 rounded-2xl inline-block shadow-inner mx-auto mb-4 border-2 border-slate-200">
              <QRCodeSVG
                value={qrData}
                size={230}
                level="H"
                includeMargin={false}
              />
            </div>

            {/* Controls */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setHighContrast(!highContrast)}
                className={`w-full py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-colors ${
                  highContrast
                    ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Toggle Bright Screen for Easy Scanning</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] opacity-70">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cryptographically Signed Commuter Token</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

