import React from "react";
import {
  Flower2,
  Phone,
  AlertTriangle,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { SITE_CONFIG } from "../config/site";
import { tinaField } from "../lib/useTina";
import type { SiteContent } from "../types/content";

interface FooterProps {
  onBookAppointment: () => void;
  liveSite: SiteContent;
  studioName?: string;
  email?: string;
  phone?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onBookAppointment,
  liveSite,
  studioName = liveSite?.studioName || SITE_CONFIG.studioName,
  phone = liveSite?.phone || SITE_CONFIG.phone,
}) => {
  const cleanPhoneDigits = phone.replace(/[^0-9]/g, "");
  const formattedPhone = cleanPhoneDigits.length === 10
    ? `(${cleanPhoneDigits.slice(0, 3)}) ${cleanPhoneDigits.slice(3, 6)}-${cleanPhoneDigits.slice(6)}`
    : phone;

  return (
    <footer className="bg-stone-900 text-stone-300 py-16 md:py-20 border-t border-stone-800">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        {/* Upper Functional Row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 pb-4">
          {/* Left Zone: Brand + Practice Location */}
          <div className="space-y-4 max-w-md">
            <div className="flex items-center gap-2.5 text-white">
              <span className="p-1.5 rounded-lg bg-emerald-800 text-white shadow-2xs">
                <Flower2 className={`w-4 h-4 text-emerald-100`} />
              </span>
              <span
                data-tina-field={tinaField(liveSite, "studioName")}
                className="font-serif text-lg font-bold tracking-tight"
              >
                {studioName}
              </span>
            </div>

            <p
              data-tina-field={tinaField(liveSite, "description")}
              className="text-xs text-stone-400 font-sans leading-relaxed"
            >
              {liveSite?.description || "Holistic, relational, and integrative psychotherapy for individuals, couples, and teens in San Francisco and across California via Telehealth."}
            </p>

            <div className="flex flex-col gap-2 text-[13px] text-stone-400 font-sans">
              <div
                data-tina-field={tinaField(liveSite, "locationDisplay")}
                className="flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-stone-500 shrink-0" />
                <span>
                  {liveSite?.locationDisplay || "1782 Church Street, San Francisco, CA 94131 (Noe Valley)"}
                </span>
              </div>
              <a
                id="footer-phone-link"
                href={`tel:${cleanPhoneDigits}`}
                data-tina-field={tinaField(liveSite, "phone")}
                className="hover:text-white transition w-fit flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-stone-500 shrink-0" />
                <span>Call or Text: {formattedPhone}</span>
              </a>
            </div>
          </div>

          {/* Right Zone: Primary Navigation Links */}
          <nav
            aria-label="Footer navigation"
            className="flex flex-col md:flex-row gap-4 md:gap-8 text-[13px] text-stone-400 font-sans items-start md:items-center"
          >
            <button
              id="footer-book-consultation-link"
              onClick={onBookAppointment}
              className="hover:text-white transition cursor-pointer text-left bg-transparent border-0 p-0 font-sans text-[13px] text-stone-400 font-semibold"
            >
              Free 30-Min Call
            </button>
            <a
              id="footer-about-link"
              href="#about"
              className="hover:text-white transition"
            >
              About Marcella
            </a>
            <a
              id="footer-services-pricing-link"
              href="#services"
              className="hover:text-white transition"
            >
              Services &amp; Fees
            </a>
            <a
              id="footer-faq-link"
              href="#faq"
              className="hover:text-white transition"
            >
              FAQs
            </a>
            <a
              id="footer-contact-link"
              href="#contact"
              className="hover:text-white transition"
            >
              Contact
            </a>
          </nav>
        </div>

        {/* BBS Credential & Clinical Supervision Box (MANDATORY BBS COMPLIANCE) */}
        <div className="p-5 rounded-xl bg-stone-950/80 border border-stone-800 text-xs text-stone-300 font-sans space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span data-tina-field={tinaField(liveSite, "bbsNoticeTitle")}>
              {liveSite?.bbsNoticeTitle ||
                "California BBS Professional Credential & Supervision Notice"}
            </span>
          </div>
          <p
            data-tina-field={tinaField(liveSite, "bbsNoticeText")}
            className="text-stone-300 leading-relaxed"
          >
            {liveSite?.bbsNoticeText ||
              "Marcella Mission is a Pre-Licensed Professional practicing as a Marriage and Family Therapist (MFT) Trainee and Professional Clinical Counselor (PCC) Trainee at Church Street Integral Counseling Center."}
          </p>
          <p
            data-tina-field={tinaField(liveSite, "supervisionNoticeText")}
            className="text-stone-100 font-medium tracking-wide"
          >
            {liveSite?.supervisionNoticeText ||
              "Supervised by Derek Pehle, PsyD (CA Licensed Psychologist #21361)."}
          </p>
        </div>

        {/* Emergency & Crisis Disclaimer Box */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-900/40 text-xs text-amber-200 font-sans flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p
            data-tina-field={tinaField(liveSite, "emergencyDisclaimer")}
            className="leading-relaxed"
          >
            <strong>Emergency &amp; Crisis Disclaimer:</strong>{" "}
            {liveSite?.emergencyDisclaimer ||
              "If you are experiencing a life-threatening medical or mental health emergency, please call 911 or go to your nearest emergency room immediately. You can also connect 24/7 with the Suicide & Crisis Lifeline by calling or texting 988."}
          </p>
        </div>

        {/* Bottom Bar: Copyright and developer credit */}
        <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400 font-sans">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span>
              &copy; {new Date().getFullYear()} {studioName}. All rights
              reserved.
            </span>
            <span className="text-stone-600 select-none">•</span>
            <a
              id="footer-admin-link"
              href="/admin/index.html"
              className="text-stone-400 hover:text-white transition cursor-pointer bg-transparent border-0 p-0 font-sans text-[11px]"
            >
              Admin Login
            </a>
          </div>
          <p className="text-stone-400">
            Developed by{" "}
            <a
              href="https://boomtick.blog/services"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-stone-300 hover:text-white transition font-semibold"
            >
              Ariel Anders Consulting
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};
