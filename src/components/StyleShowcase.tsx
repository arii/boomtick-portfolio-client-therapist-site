import React, { useState, useEffect, useMemo } from "react";
import { PORTFOLIO_CONTENT } from "../config/site";
import { TOKENS } from "../styles/tokens";
import { Sparkles, Heart, Compass, CheckCircle2 } from "lucide-react";
import type { PortfolioItem } from "../types/content";

interface StyleShowcaseProps {
  images?: PortfolioItem[];
}

function PortfolioShowcaseCard({
  item,
  index = 0,
  usedImageUrls = [],
}: {
  item: PortfolioItem;
  index: number;
  usedImageUrls?: string[];
}) {
  const [isHovered, setIsHovered] = useState(false);

  const photos = useMemo(() => {
    const seen = new Set<string>();
    const originalPhotos = [item.image, ...(item.images || [])].filter(Boolean);

    const available = originalPhotos.filter((img) => {
      if (seen.has(img) || usedImageUrls.includes(img)) {
        return false;
      }
      seen.add(img);
      return true;
    });

    if (available.length === 0) {
      const fallbackSeen = new Set<string>();
      return originalPhotos.filter((img) => {
        if (fallbackSeen.has(img)) return false;
        fallbackSeen.add(img);
        return true;
      });
    }

    return available;
  }, [item.image, item.images, usedImageUrls]);

  const initialIndex = photos.length > 0 ? index % photos.length : 0;
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    if (photos.length <= 1) return;

    const initialDelayMs = (index * 1200) % 5000;
    let intervalId: NodeJS.Timeout;

    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % photos.length);

      intervalId = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % photos.length);
      }, 5500);
    }, initialDelayMs);

    return () => {
      clearTimeout(timer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [photos.length, index]);

  useEffect(() => {
    if (photos.length > 1 && isHovered) {
      const hoverTimer = setTimeout(() => {
        setActiveIndex((initialIndex + 1) % photos.length);
      }, 50);
      return () => clearTimeout(hoverTimer);
    }
  }, [isHovered, photos.length, initialIndex]);

  if (photos.length === 0) return null;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${TOKENS.card.showcase} relative group cursor-pointer overflow-hidden rounded-2xl border border-stone-200 shadow-2xs aspect-5/4 md:aspect-4/3`}
    >
      {photos.map((photo, idx) => (
        <div
          key={photo + idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === activeIndex
              ? "opacity-100 z-10"
              : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <img
            src={photo}
            alt={item.alt || item.title || "Therapy Practice Space"}
            className="w-full h-full object-cover object-top transition-transform duration-[4000ms] ease-out select-none"
            style={{
              transform:
                isHovered && idx === activeIndex ? "scale(1.04)" : "scale(1)",
            }}
            loading="lazy"
          />
        </div>
      ))}

      {/* Content overlay with title & tag */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-12 z-20 transition-opacity duration-300">
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block font-sans">
          {item.tag}
        </span>
        <h3 className="text-lg md:text-xl font-serif font-bold text-white tracking-wide mt-1">
          {item.title}
        </h3>
      </div>

      {photos.length > 1 && (
        <div className="absolute top-4 right-4 flex space-x-1.5 z-20 bg-black/35 backdrop-blur-[4px] px-2.5 py-1.5 rounded-full border border-white/10 shadow-xs">
          {photos.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full bg-white transition-opacity duration-300 ${
                i === activeIndex
                  ? "opacity-100 ring-2 ring-white/30"
                  : "opacity-40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const StyleShowcase: React.FC<StyleShowcaseProps> = ({
  images = PORTFOLIO_CONTENT,
}) => {
  const specialties = [
    "Life Transitions",
    "Depression & Anxiety",
    "ADHD & Neurodivergence",
    "Polyamory & Ethical Non-Monogamy (ENM)",
    "Kink & Sex-Positive Therapy",
    "Trauma & Somatic Exploration",
    "Addiction & Recovery",
    "Relational Dynamics & Couples",
  ];

  return (
    <section
      id="about"
      className="relative py-20 md:py-28 bg-stone-100/70 border-b border-stone-200 scroll-mt-16"
    >
      <span id="showcase" className="absolute -top-16" />
      <div className="max-w-6xl mx-auto px-6">
        {/* About Marcella Introduction Block */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider font-sans border border-emerald-200/80">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About Marcella</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Relational, Somatic &amp; Integrative Support
          </h2>
          <p className="text-stone-600 font-sans text-base md:text-lg leading-relaxed pt-2">
            I have been studying psychology and working with clients at NLP
            Marin for over a decade. As a Pre-Licensed Professional, I work to
            honor what is and embrace what can be by bringing gentle awareness
            to the present moment.
          </p>
        </div>

        {/* Practice Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Relational &amp; Present
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm font-sans leading-relaxed">
              We explore feelings and relational patterns as they arise in real
              time, creating genuine space for insight, self-compassion, and
              meaningful transformation.
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Holistic &amp; Somatic
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm font-sans leading-relaxed">
              Bridging cognitive understanding with bodily sensations and
              somatic wisdom to help release stress, navigate trauma, and ground
              your nervous system.
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Inclusive &amp; Affirming
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm font-sans leading-relaxed">
              Actively affirming LGBTQIA+, polyamorous, ethically
              non-monogamous, kink, and neurodivergent individuals and
              relationships in a safe, judgment-free container.
            </p>
          </div>
        </div>

        {/* Clinical Specialties Pill Grid */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 md:p-10 mb-16 shadow-2xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-sans mb-4 text-center">
            Areas of Clinical Focus &amp; Specialty
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {specialties.map((spec, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs sm:text-sm font-medium font-sans hover:bg-stone-100 transition"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{spec}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Peaceful Space & Office Gallery */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 font-sans">
            Our San Francisco Setting
          </span>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mt-1">
            Church Street Integral Counseling Center
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {(() => {
            const renderedImageUrls: string[] = [];
            return images.map((item, index) => {
              const currentUsed = [...renderedImageUrls];
              const primaryImage = item.image;
              if (primaryImage) {
                renderedImageUrls.push(primaryImage);
              }
              if (item.images) {
                item.images.forEach((img) => {
                  if (img) renderedImageUrls.push(img);
                });
              }

              return (
                <PortfolioShowcaseCard
                  key={item.id || `portfolio-${index}`}
                  item={item}
                  index={index}
                  usedImageUrls={currentUsed}
                />
              );
            });
          })()}
        </div>
      </div>
    </section>
  );
};
