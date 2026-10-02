import { defineConfig } from "tinacms";

// Your hosting provider will set these environment variables automatically in production
const branch =
  (typeof process !== "undefined"
    ? process.env?.VITE_TINA_BRANCH
    : undefined) ||
  import.meta.env?.VITE_TINA_BRANCH ||
  (typeof process !== "undefined" ? process.env?.CF_PAGES_BRANCH : undefined) ||
  (typeof process !== "undefined" ? process.env?.HEAD : undefined) ||
  "main";

const clientId =
  (typeof process !== "undefined"
    ? process.env?.VITE_TINA_CLIENT_ID
    : undefined) ||
  import.meta.env?.VITE_TINA_CLIENT_ID ||
  "cc29fe7b-9d48-4d53-83f1-115a9f5f48b8";

const token =
  (typeof process !== "undefined" ? process.env?.TINA_TOKEN : undefined) ||
  import.meta.env?.TINA_TOKEN ||
  null;

const searchToken =
  (typeof process !== "undefined"
    ? process.env?.TINA_SEARCH_TOKEN
    : undefined) ||
  import.meta.env?.TINA_SEARCH_TOKEN ||
  import.meta.env?.VITE_TINA_SEARCH_TOKEN ||
  null;

export default defineConfig({
  branch,
  clientId,
  token,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "assets",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      // SINGLE UNIFIED PAGE SCHEMA (Single Source of Truth for the Single-Page Site)
      {
        name: "page",
        label: "Home Page",
        path: "src/content",
        match: { include: "page" },
        format: "json",
        ui: {
          router: () => "/",
          allowedActions: { create: false, delete: false },
        },
        fields: [
          // 1. HERO SECTION
          {
            type: "object",
            name: "hero",
            label: "Hero Section",
            fields: [
              {
                type: "string",
                name: "badge",
                label: "Credentials Badge",
                description:
                  "Credentials and clinical supervision notice displayed above the headline",
              },
              {
                type: "string",
                name: "headline",
                label: "Main Headline",
                description:
                  "Primary attention-grabbing headline for the hero section",
                required: true,
              },
              {
                type: "string",
                name: "subheading",
                label: "Subheading Copy",
                description:
                  "Secondary explanatory copy detailing your specialty, therapeutic philosophy, and locations",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "availabilityNotice",
                label: "Availability Notice Banner",
                description:
                  "Practice location, scheduling details, and availability notice",
                required: true,
                ui: { component: "textarea" },
              },
            ],
          },

          // 1.5 ABOUT & CLINICAL PHILOSOPHY SECTION
          {
            type: "object",
            name: "about",
            label: "About Marcella & Clinical Philosophy",
            fields: [
              {
                type: "string",
                name: "badge",
                label: "Section Badge Tag",
                description:
                  "Small badge displayed above the bio (e.g. 'About Marcella Mission')",
              },
              {
                type: "string",
                name: "psychologyTodayText",
                label: "Psychology Today Verification Label",
                description: "Label for the Psychology Today link",
              },
              {
                type: "string",
                name: "psychologyTodayUrl",
                label: "Psychology Today Profile URL",
                description: "Direct link to verified profile",
              },
              {
                type: "string",
                name: "quoteHeadline",
                label: "Opening Philosophy Quote",
                description:
                  "Featured quote setting the therapeutic tone and orientation",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "bioParagraphs",
                label: "Narrative Biography Paragraphs",
                list: true,
                description:
                  "Paragraphs detailing psychology study at NLP Marin, training at Church St ICC, supervised by Derek Pehle PsyD #21361, and session formats",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "closingAffirmationQuote",
                label: "Closing Affirmation Callout Quote",
                description:
                  "Affirmation acknowledging the energy it takes to reach out for support",
                ui: { component: "textarea" },
              },
              {
                type: "object",
                name: "pillars",
                label: "Therapy Pillars (3 Cards)",
                list: true,
                ui: {
                  itemProps: (item: any) => ({
                    label: item?.title || "Philosophy Pillar",
                  }),
                },
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "Pillar Title (e.g. Relational & Present)",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "description",
                    label: "Pillar Description",
                    required: true,
                    ui: { component: "textarea" },
                  },
                  {
                    type: "string",
                    name: "icon",
                    label: "Icon Name",
                    options: [
                      "Heart",
                      "Compass",
                      "Sparkles",
                      "Flower2",
                      "ShieldCheck",
                    ],
                  },
                ],
              },
              {
                type: "string",
                name: "specialtiesTitle",
                label: "Specialties Section Title",
                description:
                  "Section title for clinical specialties and focus areas",
              },
              {
                type: "string",
                name: "specialties",
                label: "Areas of Clinical Focus & Specialty",
                list: true,
                description:
                  "List of specialties (Life Transitions, Depression & Anxiety, ADHD & Neurodivergence, Polyamory & ENM, Kink & Sex-Positive, Trauma, Addiction, Couples)",
              },
              {
                type: "string",
                name: "locationHeader",
                label: "Space Gallery Subheader",
              },
              {
                type: "string",
                name: "locationTitle",
                label: "Space Gallery Practice Title",
              },
              {
                type: "string",
                name: "locationSubtitle",
                label: "Space Gallery Physical Address Subtitle",
              },
            ],
          },

          // 2. SERVICES & PRICING
          {
            type: "object",
            name: "services",
            label: "Services & Fees",
            fields: [
              {
                type: "string",
                name: "sectionTitle",
                label: "Section Title",
                description:
                  "Main section heading displayed above the service pricing cards",
              },
              {
                type: "string",
                name: "pricingNote",
                label: "Pricing Note / Location Notice",
                description:
                  "Location and format notice regarding service fees",
              },
              {
                type: "object",
                name: "servicesList",
                label: "Therapy Services",
                list: true,
                ui: {
                  itemProps: (item: any) => ({
                    label: `${item?.name || "New Service"} (${item?.price || "$80"})`,
                  }),
                },
                fields: [
                  {
                    type: "string",
                    name: "name",
                    label: "Service Name",
                    description:
                      "Client-facing therapy offering name (e.g. Individual Therapy)",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "price",
                    label: "Fee Display (e.g. $80 / Session)",
                    description: "Published session fee",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "duration",
                    label: "Estimated Duration",
                    description: "Standard appointment duration (e.g. 60 mins)",
                    options: [
                      "45 mins",
                      "50 mins",
                      "60 mins",
                      "75 mins",
                      "90 mins",
                    ],
                  },
                  {
                    type: "string",
                    name: "description",
                    label: "Short Description",
                    description:
                      "Overview of therapeutic approach, goals, and session format",
                    ui: { component: "textarea" },
                  },
                  {
                    type: "string",
                    name: "deliverables",
                    label: "Key Features & Focus",
                    list: true,
                    description:
                      "Bullet points detailing clinical focus and format",
                  },
                  {
                    type: "object",
                    name: "examples",
                    label: "Photo Examples",
                    list: true,
                    ui: {
                      itemProps: (item: any) => ({
                        label: item?.styleLabel || "Example Image",
                      }),
                    },
                    fields: [
                      {
                        type: "image",
                        name: "image",
                        label: "Photo",
                      },
                      {
                        type: "string",
                        name: "styleLabel",
                        label: "Image Label",
                      },
                      {
                        type: "string",
                        name: "alt",
                        label: "Alt Text",
                      },
                    ],
                  },
                  {
                    type: "string",
                    name: "id",
                    label: "Service Slug ID (Locked)",
                    description:
                      "Permanent system identifier used for URL anchors & Cal.com integration.",
                    required: true,
                    ui: {
                      component: "hidden",
                    },
                  },
                  {
                    type: "string",
                    name: "calSlug",
                    label: "Cal.com Scheduling Slug Override",
                    description:
                      "Optional override slug for this specific service.",
                  },
                ],
              },
            ],
          },

          // 3. PORTFOLIO & MEDIA SHOWCASE
          {
            type: "object",
            name: "portfolio",
            label: "Practice Space & Photos",
            fields: [
              {
                type: "image",
                name: "heroImage",
                label: "Hero Headshot Image (Preloaded)",
                description:
                  "Main hero image displayed on initial page load (optimized for LCP)",
              },
              {
                type: "image",
                name: "ogImage",
                label: "Social Share Image (OpenGraph / Twitter)",
                description:
                  "Image displayed when sharing links on social media / iMessage",
              },
              {
                type: "string",
                name: "ogImageAlt",
                label: "Social Share Image Alt Text",
                description:
                  "Descriptive accessibility and OpenGraph alt text for the social share card",
              },
              {
                type: "object",
                name: "portfolioList",
                label: "Showcase Gallery",
                list: true,
                ui: {
                  itemProps: (item: any) => ({
                    label:
                      item?.title || item?.alt || item?.id || "Gallery Item",
                  }),
                },
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "Title / Caption",
                    description:
                      "Human-readable title (e.g. 'Peaceful Session Room')",
                  },
                  {
                    type: "string",
                    name: "id",
                    label: "Image ID (slug)",
                    description: "System anchor identifier",
                    required: true,
                  },
                  {
                    type: "image",
                    name: "image",
                    label: "Photo",
                    description: "High-resolution photograph",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "alt",
                    label: "Alt Text Description",
                    description: "Descriptive accessibility and image SEO text",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "tag",
                    label: "Category",
                    description: "Category classification",
                    options: [
                      "Practice Space",
                      "Office Setting",
                      "Therapeutic Approach",
                      "About Marcella",
                    ],
                  },
                  {
                    type: "image",
                    name: "images",
                    label: "Additional Photos",
                    list: true,
                    description:
                      "Add multiple photos to enable smooth auto-cycling slideshows",
                  },
                ],
              },
            ],
          },

          // 3.5 FAQ SECTION
          {
            type: "object",
            name: "faq",
            label: "Frequently Asked Questions",
            fields: [
              {
                type: "string",
                name: "sectionTitle",
                label: "Section Title",
                description: "Main section heading for FAQs",
              },
              {
                type: "string",
                name: "sectionSubtitle",
                label: "Section Subtitle",
                description: "Subtitle shown under the title",
              },
              {
                type: "object",
                name: "faqList",
                label: "FAQs List",
                list: true,
                ui: {
                  itemProps: (item: any) => ({
                    label: item?.question || "FAQ Question",
                  }),
                },
                fields: [
                  {
                    type: "string",
                    name: "question",
                    label: "Question",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "answer",
                    label: "Answer",
                    required: true,
                    ui: { component: "textarea" },
                  },
                ],
              },
            ],
          },

          // 4. INQUIRY FORM
          {
            type: "object",
            name: "events",
            label: "Consultation Inquiry Form",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Form Section Title",
                description:
                  "Main section heading for consultation inquiry form",
              },
              {
                type: "string",
                name: "description",
                label: "Form Section Description",
                description: "Header copy explaining consultation details",
                ui: { component: "textarea" },
              },
              {
                type: "boolean",
                name: "showForm",
                label: "Display Inquiry Form on Site?",
                description:
                  "Toggle off to completely remove the form from the public website",
              },
              {
                type: "object",
                name: "formFields",
                label: "Form Fields",
                list: true,
                ui: {
                  itemProps: (item: any) => ({
                    label:
                      item?.label ||
                      item?.fieldName ||
                      item?.name ||
                      "Form Field",
                  }),
                } as any,
                templates: [
                  {
                    name: "inputField",
                    label: "Text / Contact Input",
                    ui: {
                      itemProps: (item: any) => ({
                        label: item?.label || "Text / Contact Input",
                      }),
                    },
                    fields: [
                      {
                        type: "string",
                        name: "label",
                        label: "Field Label",
                        required: true,
                      },
                      {
                        type: "string",
                        name: "fieldType",
                        label: "Input Type",
                        options: ["text", "email", "tel", "date", "number"],
                      },
                      {
                        type: "string",
                        name: "placeholder",
                        label: "Placeholder Hint",
                      },
                      {
                        type: "boolean",
                        name: "required",
                        label: "Required Field?",
                      },
                    ],
                  },
                  {
                    name: "selectField",
                    label: "Dropdown Select Menu",
                    ui: {
                      itemProps: (item: any) => ({
                        label: item?.label || "Dropdown Select Menu",
                      }),
                    },
                    fields: [
                      {
                        type: "string",
                        name: "label",
                        label: "Field Label",
                        required: true,
                      },
                      {
                        type: "string",
                        name: "options",
                        label: "Dropdown Options",
                        list: true,
                      },
                      {
                        type: "boolean",
                        name: "required",
                        label: "Required Field?",
                      },
                    ],
                  },
                  {
                    name: "textareaField",
                    label: "Multi-line Text Area",
                    ui: {
                      itemProps: (item: any) => ({
                        label: item?.label || "Multi-line Text Area",
                      }),
                    },
                    fields: [
                      {
                        type: "string",
                        name: "label",
                        label: "Field Label",
                        required: true,
                      },
                      {
                        type: "string",
                        name: "placeholder",
                        label: "Placeholder Hint",
                      },
                      {
                        type: "boolean",
                        name: "required",
                        label: "Required Field?",
                      },
                    ],
                  },
                ],
              },
              {
                type: "object",
                name: "formOptions",
                label: "Form Options",
                fields: [
                  {
                    type: "string",
                    name: "submitButtonText",
                    label: "Submit Button Text",
                  },
                ],
              },
            ],
          },

          // 5. PRACTICE SETTINGS & SEO
          {
            type: "object",
            name: "site",
            label: "Practice Settings & SEO",
            fields: [
              {
                type: "string",
                name: "studioName",
                label: "Practice Name",
                description: "Official therapy practice brand name",
                required: true,
              },
              {
                type: "string",
                name: "stylistName",
                label: "Therapist Name",
                description: "Full name of the clinician",
                required: true,
              },
              {
                type: "string",
                name: "title",
                label: "Browser Title (SEO)",
                description:
                  "Primary SEO browser page title displayed on search engine results",
              },
              {
                type: "string",
                name: "description",
                label: "Meta Description (SEO)",
                description:
                  "Meta description snippet for search engines (approx. 150-160 characters)",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "keywords",
                label: "SEO Keywords",
                description:
                  "Target search phrases and keywords for local SEO indexing",
                list: true,
              },
              {
                type: "string",
                name: "email",
                label: "Contact Email Address",
              },
              {
                type: "string",
                name: "phone",
                label: "Direct Phone Number",
              },
              {
                type: "string",
                name: "instagramHandle",
                label: "Instagram Handle (Optional)",
              },
              {
                type: "string",
                name: "locationDisplay",
                label: "Location Display Text",
              },
              {
                type: "string",
                name: "calUsername",
                label: "Cal.com Username",
              },
              {
                type: "string",
                name: "calDefaultSlug",
                label: "Cal.com Default Event Slug",
              },
              {
                type: "object",
                name: "address",
                label: "Office Address",
                fields: [
                  {
                    type: "string",
                    name: "locality",
                    label: "City / Locality",
                  },
                  {
                    type: "string",
                    name: "region",
                    label: "State / Region",
                  },
                  {
                    type: "string",
                    name: "country",
                    label: "Country Code",
                  },
                ],
              },
              {
                type: "object",
                name: "geo",
                label: "Geographic Coordinates",
                fields: [
                  {
                    type: "number",
                    name: "latitude",
                    label: "Latitude",
                  },
                  {
                    type: "number",
                    name: "longitude",
                    label: "Longitude",
                  },
                ],
              },
              {
                type: "string",
                name: "areaServed",
                label: "Areas Served",
                list: true,
              },
              {
                type: "string",
                name: "openingDays",
                label: "Opening Days",
                list: true,
              },
              {
                type: "object",
                name: "openingHours",
                label: "Opening Hours",
                fields: [
                  {
                    type: "string",
                    name: "opens",
                    label: "Opening Time (HH:MM)",
                  },
                  {
                    type: "string",
                    name: "closes",
                    label: "Closing Time (HH:MM)",
                  },
                ],
              },
              {
                type: "string",
                name: "priceRange",
                label: "Price Range",
              },
              {
                type: "string",
                name: "bbsNoticeTitle",
                label: "BBS Credential Notice Title",
                description:
                  "Title for California BBS Professional Credential & Supervision Notice",
              },
              {
                type: "string",
                name: "bbsNoticeText",
                label: "BBS Credential & Practice Notice",
                description:
                  "Notice regarding trainee status, credentials, and counseling center",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "supervisionNoticeText",
                label: "Clinical Supervision Notice",
                description:
                  "Supervising clinical psychologist name, degree, and CA license number",
              },
              {
                type: "string",
                name: "emergencyDisclaimer",
                label: "Emergency & Crisis Disclaimer",
                description:
                  "Emergency instructions, 911 notice, and 988 Suicide & Crisis Lifeline notice",
                ui: { component: "textarea" },
              },
            ],
          },
        ],
      },
    ],
  },

  search: searchToken
    ? {
        tina: {
          indexerToken: searchToken,
          stopwordLanguages: ["eng"],
          fuzzyEnabled: true,
          fuzzyOptions: {
            maxDistance: 2,
            minSimilarity: 0.6,
            maxTermExpansions: 10,
            useTranspositions: true,
          },
        },
        indexBatchSize: 100,
        maxSearchIndexFieldLength: 100,
      }
    : undefined,
});
