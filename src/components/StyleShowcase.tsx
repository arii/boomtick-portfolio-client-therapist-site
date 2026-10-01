import React, { useState, useEffect, useMemo } from "react";
import { PORTFOLIO_CONTENT } from "../config/site";
import { TOKENS } from "../styles/tokens";
import {
  Sparkles,
  Heart,
  Compass,
  CheckCircle2,
  ExternalLink,
  Quote,
  Flower2,
  ShieldCheck,
} from "lucide-react";
import { tinaField } from "../lib/useTina";
import type { PortfolioItem, AboutContent } from "../types/content";

interface StyleShowcaseProps {
  images?: PortfolioItem[];
  about?: AboutContent;
}

const DEFAULT_BIO_PARAGRAPHS = [
  "I have been studying psychology and working with clients at NLP Marin for over a decade. I'm a Professional Clinical Counselor and Marriage and Family Therapist Trainee at Church St Integral Counseling Center in Noe Valley, San Francisco, supervised by Derek Pehle, PsyD (CA License #21361).",
  "By focusing on the here and now, we start to gently engage the internal structures that keep unwanted experiences in place. I work with individuals and couples seeking support around life transitions, depression, anxiety, ADHD, polyamory, kink, addiction, and trauma.",
  "I am currently taking on new clients who live in California for online sessions or in-person sessions Mondays through Thursdays in San Francisco. Our work together will be holistic, relational, integrative, and tailored for what works best for you.",
];

const DEFAULT_SPECIALTIES = [
  "Life Transitions",
  "Depression & Anxiety",
  "ADHD & Neurodivergence",
  "Polyamory & Ethical Non-Monogamy (ENM)",
  "Kink & Sex-Positive Therapy",
  "Trauma & Somatic Exploration",
  "Addiction & Recovery",
  "Relational Dynamics & Couples",
];

const DEFAULT_PILLARS = [
  {
    title: "Relational & Present",
    description:
      "We explore feelings and relational patterns as they arise in real time, creating genuine space for insight, self-compassion, and meaningful transformation.",
    icon: "Heart",
  },
  {
    title: "Holistic & Somatic",
    description:
      "Bridging cognitive understanding with bodily sensations and somatic wisdom to help release stress, navigate trauma, and ground your nervous system.",
    icon: "Compass",
  },
  {
    title: "Inclusive & Affirming",
    description:
      "Actively affirming LGBTQIA+, polyamorous, ethically non-monogamous, kink, and neurodivergent individuals and relationships in a safe, non-judgmental container.",
    icon: "Sparkles",
  },
];

function renderPillarIcon(iconName?: string) {
  switch (iconName) {
    case "Heart":
      return <Heart className="w-5 h-5" />;
    case "Compass":
      return <Compass className="w-5 h-5" />;
    case "Flower2":
      return <Flower2 className="w-5 h-5" />;
    case "ShieldCheck":
      return <ShieldCheck className="w-5 h-5" />;
    case "Sparkles":
    default:
      return <Sparkles className="w-5 h-5" />;
  }
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
        <span
          data-tina-field={tinaField(item, "tag")}
          className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block font-sans"
        >
          {item.tag}
        </span>
        <h3
          data-tina-field={tinaField(item, "title")}
          className="text-lg md:text-xl font-serif font-bold text-white tracking-wide mt-1"
        >
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
  about,
}) => {
  const badge = about?.badge || "About Marcella Mission";
  const psychText =
    about?.psychologyTodayText || "Verified on Psychology Today";
  const psychUrl =
    about?.psychologyTodayUrl ||
    "https://www.psychologytoday.com/us/therapists/marcella-shehadeh-mission-san-francisco-ca/1615567";
  const quoteHeadline =
    about?.quoteHeadline ||
    "“I work to honor what is and embrace what can be by bringing awareness to the present moment.”";
  const bioParagraphs =
    about?.bioParagraphs && about.bioParagraphs.length > 0
      ? about.bioParagraphs
      : DEFAULT_BIO_PARAGRAPHS;
  const closingQuote =
    about?.closingAffirmationQuote ||
    "“Finally, I would like to acknowledge the energy it takes to reach for change and support. Sorting through helpers and healers is a big first reach; whether this is your first time in therapy or a continuation of your journey, you are on your way.”";
  const pillars =
    about?.pillars && about.pillars.length > 0
      ? about.pillars
      : DEFAULT_PILLARS;
  const specialtiesTitle =
    about?.specialtiesTitle || "Areas of Clinical Focus & Specialty";
  const specialties =
    about?.specialties && about.specialties.length > 0
      ? about.specialties
      : DEFAULT_SPECIALTIES;
  const locationHeader = about?.locationHeader || "Our San Francisco Setting";
  const locationTitle =
    about?.locationTitle || "Church Street Integral Counseling Center";
  const locationSubtitle =
    about?.locationSubtitle ||
    "1782 Church Street, San Francisco, CA 94131 (Noe Valley)";

  return (
    <section
      id="about"
      className="relative py-20 md:py-28 bg-stone-100/70 border-b border-stone-200 scroll-mt-16"
    >
      <span id="showcase" className="absolute -top-16" />
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        {/* About Marcella Introduction Block */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-stone-200/90 shadow-sm p-8 sm:p-10 md:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
            <div
              data-tina-field={about ? tinaField(about, "badge") : undefined}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider font-sans border border-emerald-200/80"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </div>
            <a
              href={psychUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-tina-field={
                about ? tinaField(about, "psychologyTodayText") : undefined
              }
              className="text-xs text-stone-500 hover:text-stone-900 transition inline-flex items-center gap-1.5 font-sans"
            >
              <span>{psychText}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-6 text-stone-700 font-sans text-base sm:text-lg leading-relaxed">
            <p
              data-tina-field={
                about ? tinaField(about, "quoteHeadline") : undefined
              }
              className="font-serif text-2xl sm:text-3xl text-stone-900 font-bold tracking-tight leading-snug"
            >
              {quoteHeadline}
            </p>

            <div
              data-tina-field={
                about ? tinaField(about, "bioParagraphs") : undefined
              }
              className="space-y-4"
            >
              {bioParagraphs.map((para, idx) => (
                <p key={idx} className="leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Reaching Out Affirmation Box */}
            <div
              data-tina-field={
                about ? tinaField(about, "closingAffirmationQuote") : undefined
              }
              className="p-6 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl flex items-start gap-4"
            >
              <Quote className="w-6 h-6 text-emerald-700 shrink-0 mt-1 rotate-180" />
              <p className="text-sm sm:text-base text-emerald-950 italic leading-relaxed">
                {closingQuote}
              </p>
            </div>
          </div>
        </div>

        {/* Practice Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={pillar.title || idx}
              data-tina-field={about ? tinaField(pillar) : undefined}
              className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                {renderPillarIcon(pillar.icon)}
              </div>
              <h3 className="font-serif font-bold text-xl text-stone-900">
                {pillar.title}
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm font-sans leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Clinical Specialties Pill Grid */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 md:p-10 shadow-2xs">
          <h3
            data-tina-field={
              about ? tinaField(about, "specialtiesTitle") : undefined
            }
            className="text-xs font-bold uppercase tracking-wider text-stone-500 font-sans mb-4 text-center"
          >
            {specialtiesTitle}
          </h3>
          <div
            data-tina-field={
              about ? tinaField(about, "specialties") : undefined
            }
            className="flex flex-wrap items-center justify-center gap-3"
          >
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
        <div className="space-y-8">
          <div className="text-center">
            <span
              data-tina-field={
                about ? tinaField(about, "locationHeader") : undefined
              }
              className="text-xs font-bold uppercase tracking-wider text-stone-500 font-sans"
            >
              {locationHeader}
            </span>
            <h3
              data-tina-field={
                about ? tinaField(about, "locationTitle") : undefined
              }
              className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mt-1"
            >
              {locationTitle}
            </h3>
            <p
              data-tina-field={
                about ? tinaField(about, "locationSubtitle") : undefined
              }
              className="text-xs text-stone-500 font-sans mt-1"
            >
              {locationSubtitle}
            </p>
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
      </div>
    </section>
  );
};
