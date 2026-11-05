import React, { useEffect, useState } from 'react';
import { Bus, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LoadingModal({ isOpen, onComplete, amount, paymentMethod }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      return;
    }

    // Progression through simulated steps
    const t1 = setTimeout(() => setStep(1), 700);
    const t2 = setTimeout(() => setStep(2), 1500);
    const t3 = setTimeout(() => {
      setStep(3);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#C8102E', '#10B981', '#FFD700', '#2563EB'],
        });
      } catch (e) {
        // ignore confetti errors
      }
    }, 2200);

    const t4 = setTimeout(() => {
      onComplete();
    }, 2900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  const steps = [
    'Connecting to BMTC Transit Gateway...',
    `Authorizing ₹${amount} via ${paymentMethod}...`,
    'Allocating non-duplicate commuter seats...',
    'Ticket Confirmed! Issuing QR Pass...',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-50 rounded-full blur-xl pointer-events-none" />

        {/* Animated Icon */}
        <div className="relative mx-auto w-20 h-20 mb-4 flex items-center justify-center">
          {step < 3 ? (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-red-100 border-t-[#C8102E] animate-spin" />
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#C8102E]">
                <Bus className="w-6 h-6 animate-pulse" />
              </div>
            </>
          ) : (
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center scale-110 transition-transform">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
          )}
        </div>

        {/* Status text */}
        <h3 className="text-lg font-extrabold text-slate-900 mb-1">
          {step < 3 ? 'Processing Digital Ticket' : 'Payment Approved!'}
        </h3>
        <p className="text-xs text-slate-500 font-medium mb-5 h-4 transition-all duration-200">
          {steps[step]}
        </p>

        {/* Progress bars */}
        <div className="grid grid-cols-4 gap-1.5 px-4 mb-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-[#C8102E]' : 'bg-slate-100'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Simulated 256-bit Secure Transit Auth</span>
        </div>
      </div>
    </div>
  );
}

