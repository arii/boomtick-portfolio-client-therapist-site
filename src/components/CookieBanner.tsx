import React, { useState, useEffect } from "react";
import { ShieldAlert, X } from "lucide-react";

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent-marcella");
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent-marcella", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent-marcella", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 bg-stone-900 text-stone-100 rounded-xl p-5 shadow-2xl border border-stone-800 animate-fade-in flex flex-col gap-3 font-sans">
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-semibold text-sm text-white">
            Cookie Permissions &amp; Privacy Notice
          </h4>
          <p className="text-stone-300 text-xs leading-relaxed">
            We use essential cookies and state tracking to provide online booking
            and scheduling features. By accepting, you consent to our use of
            functional cookies and verify you agree to our confidential handling
            of inquiries.
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-stone-400 hover:text-white p-1 transition rounded-lg hover:bg-stone-800"
          aria-label="Close privacy notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-1.5 border-t border-stone-800">
        <button
          onClick={handleDecline}
          className="px-3 py-1.5 text-stone-400 hover:text-stone-200 text-[11px] font-bold uppercase tracking-wider transition rounded-lg hover:bg-stone-800/50 cursor-pointer"
        >
          Essential Only
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold font-sans text-[11px] uppercase tracking-wider rounded-lg transition shadow-sm cursor-pointer"
        >
          Accept &amp; Verify
        </button>
      </div>
    </div>
  );
};
