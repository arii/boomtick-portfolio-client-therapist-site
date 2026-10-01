import React from "react";
import { ShieldCheck, Calendar, MessageSquare } from "lucide-react";
import { tinaField } from "../lib/useTina";
import { TOKENS } from "../styles/tokens";
import { HERO_CONTENT, SITE_CONFIG } from "../config/site";
import type { HeroContent } from "../types/content";

interface HeroProps {
  onBookAppointment: () => void;
  heroContent?: HeroContent;
  heroImage?: string;
}

export const Hero: React.FC<HeroProps> = ({
  onBookAppointment,
  heroContent = HERO_CONTENT,
  heroImage = SITE_CONFIG.heroPreloadImage,
}) => {
  const cleanPhoneDigits = SITE_CONFIG.phone.replace(/[^0-9]/g, "");

  return (
    <section
      id="hero"
      className="relative min-h-[80vh] flex items-center bg-stone-50 py-16 md:py-24 border-b border-stone-200"
    >
      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Credentials Badge */}
            <div
              data-tina-field={tinaField(heroContent, "badge")}
              className={TOKENS.badge.credentials}
            >
              <ShieldCheck
                className={`w-4 h-4 ${TOKENS.accent.icon} shrink-0`}
              />
              <span>{heroContent.badge}</span>
            </div>

            {/* Primary Heading */}
            <h1
              data-tina-field={tinaField(heroContent, "headline")}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-[1.14]"
            >
              {heroContent.headline}
            </h1>

            {/* Subtext */}
            <p
              data-tina-field={tinaField(heroContent, "subheading")}
              className="text-base md:text-lg text-stone-600 font-sans leading-relaxed max-w-xl"
            >
              {heroContent.subheading}
            </p>

            {/* Availability Notice Callout */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-950 font-sans leading-relaxed max-w-xl">
              <strong className="font-semibold text-emerald-900 block mb-0.5">
                Practice Location &amp; Format:
              </strong>
              {heroContent.availabilityNotice}
            </div>

            {/* Primary CTA Block: Paired Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-start gap-3 pt-2">
              {/* Primary Action: Free Consultation Modal */}
              <button
                id="hero-book-consultation-btn"
                onClick={onBookAppointment}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-stone-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-stone-800 transition shadow-sm text-center font-sans inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Free 15-Min Call</span>
              </button>

              {/* Secondary Action: Direct Call / Text */}
              <a
                href={`sms:${cleanPhoneDigits}?body=Hi%20Marcella!%20I'm%20interested%20in%20learning%20more%20about%20therapy...`}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-stone-300 text-stone-800 font-bold text-xs uppercase tracking-wider hover:bg-stone-100 transition text-center font-sans inline-flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-stone-500" />
                <span>Text / Call ({SITE_CONFIG.phoneDisplay})</span>
              </a>
            </div>
          </div>

          {/* Minimalist Visual Column (High-Priority LCP Element) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-[400px]">
              <div className="relative rounded-2xl overflow-hidden bg-stone-200 border border-stone-200/80 shadow-md aspect-[4/5]">
                <img
                  id="hero-lcp-image"
                  src={heroImage}
                  alt={`${SITE_CONFIG.therapistName}, Pre-Licensed Professional therapist`}
                  width={480}
                  height={600}
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
