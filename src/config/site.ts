/**
 * Unified Site & Practice Configuration
 *
 * Single source of truth for SEO metadata, practice contact info,
 * canonical URLs, scheduling details, and dynamic Schema.org generation.
 */

import pageData from "../content/page.json";
import type {
  SiteContent,
  HeroContent,
  EventsContent,
  ServiceItem,
  PortfolioItem,
  PageContent,
  FAQContent,
} from "../types/content";

const rawPage = pageData as PageContent;

const SITE_CONTENT: SiteContent = rawPage.site;
export const HERO_CONTENT: HeroContent = rawPage.hero;
export const EVENTS_CONTENT: EventsContent = rawPage.events;
export const SERVICES_CONTENT: ServiceItem[] = rawPage.services.servicesList;
export const PORTFOLIO_CONTENT: PortfolioItem[] =
  rawPage.portfolio.portfolioList;

/**
 * Resolve deployment canonical URL for Cloudflare Pages and local dev.
 */
function resolveSiteUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  if (typeof process !== "undefined" && process.env) {
    if (
      process.env.VITE_SITE_URL &&
      !process.env.VITE_SITE_URL.includes("localhost")
    ) {
      return process.env.VITE_SITE_URL;
    }
    if (process.env.CF_PAGES_URL) {
      const cf = process.env.CF_PAGES_URL;
      return cf.startsWith("http") ? cf : `https://${cf}`;
    }
  }
  return "https://marcellamissiontherapy.pages.dev";
}

const DEFAULT_DEPLOYMENT_ID =
  "AKfycbzcKzeTp7qNkMgNk_MJkj9zjPpkkU3CI8QmJsTbIM6eY-SNEcr0V4lUVEE5xwRzdBD7Ag";

const deploymentId =
  (typeof process !== "undefined" && process.env && process.env.DEPLOYMENT_ID
    ? process.env.DEPLOYMENT_ID.trim()
    : "") ||
  (typeof import.meta !== "undefined" && import.meta.env
    ? (
        (import.meta.env.VITE_DEPLOYMENT_ID as string) ||
        (import.meta.env.DEPLOYMENT_ID as string) ||
        ""
      ).trim()
    : "") ||
  DEFAULT_DEPLOYMENT_ID;

const webhookUrl = deploymentId
  ? `https://script.google.com/macros/s/${deploymentId}/exec`
  : `https://script.google.com/macros/s/${DEFAULT_DEPLOYMENT_ID}/exec`;

const cleanSiteUrl = resolveSiteUrl().replace(/\/+$/, "");
const canonicalUrl = `${cleanSiteUrl}/`;

const basePhone = SITE_CONTENT.phone;
const cleanPhoneDigits = basePhone.replace(/[^0-9]/g, "");

// ==========================================
// UNIFIED BRAND & PRACTICE CONFIGURATION (SSOT)
// ==========================================
export const SITE_CONFIG = {
  // URLs & Domains
  siteUrl: cleanSiteUrl,
  canonicalUrl,

  // Practice Identity
  studioName: SITE_CONTENT.studioName,
  stylistName: SITE_CONTENT.stylistName,
  therapistName: SITE_CONTENT.stylistName,
  credentials: HERO_CONTENT.badge,
  supervisorDisclaimer: "Supervised by Derek Pehle, PsyD Lic 21361",
  practiceLocation: "1782 Church Street, San Francisco, CA 94131",
  title: SITE_CONTENT.title,
  description: SITE_CONTENT.description,
  keywords: SITE_CONTENT.keywords,

  // Contact Info
  email: SITE_CONTENT.email,
  phone: basePhone,
  phoneDisplay: basePhone,
  phoneTel: `tel:${cleanPhoneDigits}`,
  telephoneSchema: `+1-${cleanPhoneDigits.slice(0, 3)}-${cleanPhoneDigits.slice(3, 6)}-${cleanPhoneDigits.slice(6)}`,

  // Social & Profiles
  instagram: SITE_CONTENT.instagramHandle
    ? `@${SITE_CONTENT.instagramHandle.replace(/^@/, "")}`
    : "",
  instagramUrl: SITE_CONTENT.instagramHandle
    ? `https://www.instagram.com/${SITE_CONTENT.instagramHandle.replace(/^@/, "")}/`
    : "",

  // Integrations & Logistics
  calUsername: SITE_CONTENT.calUsername || "marcellamission",
  calDefaultSlug: SITE_CONTENT.calDefaultSlug || "consultation-15min",
  deploymentId,
  webhookUrl,
  locationDisplay: SITE_CONTENT.locationDisplay,
  logisticsNotice:
    HERO_CONTENT.availabilityNotice ||
    "In-Person Sessions at Church St Integral Counseling Center (Mon–Thu) & Telehealth across California.",

  // Emergency Disclaimer
  emergencyDisclaimer:
    "If this is a life-threatening emergency, please call 911 or go to your nearest emergency room. You can also reach the National Suicide Prevention Lifeline by calling or texting 988 (available 24/7).",

  // Address & Hours
  address: SITE_CONTENT.address,
  geo: SITE_CONTENT.geo,
  areaServed: SITE_CONTENT.areaServed,
  openingDays: SITE_CONTENT.openingDays,
  openingHours: SITE_CONTENT.openingHours,
  priceRange: SITE_CONTENT.priceRange,

  // Hero Copy
  heroHeading: HERO_CONTENT.headline,
  heroSubtext: HERO_CONTENT.subheading,

  // Media
  heroImage: rawPage.portfolio.heroImage || "/assets/marcella-headshot.jpeg",
  heroPreloadImage:
    rawPage.portfolio.heroImage || "/assets/marcella-headshot.jpeg",
  ogImage: `${cleanSiteUrl}${rawPage.portfolio.ogImage || "/assets/og-cover.png"}`,
  ogImageAlt: rawPage.portfolio.ogImageAlt || SITE_CONTENT.title,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  portfolioImages: rawPage.portfolio.portfolioList.map(
    (p) => `${cleanSiteUrl}${p.image}`
  ),
};

export type SiteConfig = typeof SITE_CONFIG;

/**
 * Dynamically builds a Schema.org MedicalBusiness / MentalHealth / LocalBusiness JSON-LD structure.
 */
export function generateSiteSchema(
  config: Partial<SiteContent> & Partial<SiteConfig> = SITE_CONFIG,
  services: ServiceItem[] = SERVICES_CONTENT,
  portfolioList: PortfolioItem[] = PORTFOLIO_CONTENT,
  faq?: FAQContent
) {
  const merged = {
    ...SITE_CONFIG,
    ...config,
    address: {
      ...SITE_CONFIG.address,
      ...(config.address || {}),
    },
    geo: {
      ...SITE_CONFIG.geo,
      ...(config.geo || {}),
    },
    openingHours: {
      ...SITE_CONFIG.openingHours,
      ...(config.openingHours || {}),
    },
    openingDays: config.openingDays || SITE_CONFIG.openingDays,
    areaServed: config.areaServed || SITE_CONFIG.areaServed,
  };

  const baseUrl = (merged.canonicalUrl || SITE_CONFIG.canonicalUrl).replace(
    /\/+$/,
    ""
  );

  const rawPhone = merged.phone || SITE_CONFIG.phone;
  const cleanPhoneDigits = rawPhone.replace(/[^0-9]/g, "");
  const telephoneSchema =
    cleanPhoneDigits.length >= 10
      ? `+1-${cleanPhoneDigits.slice(0, 3)}-${cleanPhoneDigits.slice(3, 6)}-${cleanPhoneDigits.slice(6)}`
      : SITE_CONFIG.telephoneSchema;

  const itemListElement = (services || SERVICES_CONTENT)
    .filter((service) => service && (service.name || service.id))
    .map((service) => {
      const name = service.name || "Therapy Session";
      const description =
        service.description ||
        "Holistic, relational therapy session tailored to your individual needs and goals.";
      const rawPrice = service.price
        ? service.price.replace(/[^0-9]/g, "")
        : "80";

      return {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: name,
          description: description,
          provider: {
            "@type": "Person",
            name: "Marcella Mission",
            jobTitle: "Pre-Licensed Professional, MFT/PCC Trainee",
          },
        },
        price: rawPrice || "80",
        priceCurrency: "USD",
      };
    });

  const schemaImages = (portfolioList || PORTFOLIO_CONTENT).map(
    (p) => `${baseUrl}${p.image}`
  );

  const medicalBusinessSchema = {
    "@type": "MedicalBusiness",
    "@id": `${baseUrl}/#practice`,
    name: merged.studioName || SITE_CONFIG.studioName,
    image:
      schemaImages.length > 0
        ? schemaImages
        : [
            `${baseUrl}/assets/marcella-headshot.jpeg`,
            `${baseUrl}/assets/session-room-1.jpeg`,
            `${baseUrl}/assets/session-room-2.jpeg`,
            `${baseUrl}/assets/tea-room.jpeg`,
          ],
    description: merged.description || SITE_CONFIG.description,
    telephone: telephoneSchema,
    email: merged.email || SITE_CONFIG.email,
    url: merged.canonicalUrl || SITE_CONFIG.canonicalUrl,
    priceRange: merged.priceRange || SITE_CONFIG.priceRange,
    medicalSpecialty: [
      "https://schema.org/Psychiatric",
      "Counseling",
      "Psychotherapy",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "1782 Church Street",
      addressLocality: merged.address.locality,
      addressRegion: merged.address.region,
      postalCode: "94131",
      addressCountry: merged.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: merged.geo.latitude,
      longitude: merged.geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek:
          merged.openingDays.length === 1
            ? merged.openingDays[0]
            : merged.openingDays,
        opens: merged.openingHours.opens,
        closes: merged.openingHours.closes,
      },
    ],
    areaServed: Array.isArray(merged.areaServed)
      ? merged.areaServed.map((area) => ({
          "@type": "AdministrativeArea",
          name: area,
        }))
      : {
          "@type": "AdministrativeArea",
          name: merged.locationDisplay || "San Francisco, CA",
        },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Therapy Services",
      itemListElement,
    },
  };

  const faqListToUse =
    faq?.faqList && faq.faqList.length > 0
      ? faq.faqList
      : [
          {
            question: "How does the free 15-minute consultation call work?",
            answer:
              "Our initial 15-minute consultation is a relaxed conversation by phone or video to connect, briefly discuss your therapy goals, and ensure my relational approach is a great fit.",
          },
          {
            question: "What does Pre-Licensed Professional mean?",
            answer:
              "As an MFT and PCC Trainee at Church Street Integral Counseling Center, I practice under the direct clinical supervision of Dr. Derek Pehle, PsyD (CA License #21361).",
          },
          {
            question:
              "What are your session rates and do you accept insurance?",
            answer:
              "Standard session fees are $80 per 50-minute appointment. Monthly Superbill statements are provided upon request for out-of-network insurance reimbursement.",
          },
        ];

  const faqPageSchema = {
    "@type": "FAQPage",
    "@id": `${baseUrl}/#faq`,
    mainEntity: faqListToUse.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [medicalBusinessSchema, faqPageSchema],
  };
}
