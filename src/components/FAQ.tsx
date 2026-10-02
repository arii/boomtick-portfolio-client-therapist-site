import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { tinaField } from "../lib/useTina";
import type { FAQContent } from "../types/content";

const DEFAULT_FAQS = [
  {
    question: "How does the free 30-minute consultation call work?",
    answer:
      "Our initial 30-minute consultation is a relaxed conversation by phone or video. It gives us a chance to connect, briefly discuss what you are looking for in therapy, answer your questions, and ensure my holistic, relational approach feels like a comfortable fit for your goals.",
  },
  {
    question: "What does 'Pre-Licensed Professional' mean?",
    answer:
      "As a Marriage and Family Therapist (MFT) Trainee and Professional Clinical Counselor (PCC) Trainee at Church Street Integral Counseling Center in Noe Valley, I have over a decade of experience studying psychology and human behavior at NLP Marin. Under California law, I practice under the direct clinical supervision of Dr. Derek Pehle, PsyD (CA License #21361), ensuring the highest ethical and clinical standards.",
  },
  {
    question: "What are your session rates and do you accept insurance?",
    answer:
      "Standard session fees are $80 per 50-minute appointment for both individual and couples therapy. I do not bill health insurance directly; however, upon request, I can provide a monthly Superbill statement that you can submit to your insurance provider for potential out-of-network reimbursement.",
  },
  {
    question: "Where are sessions located and do you offer Telehealth?",
    answer:
      "In-person sessions take place Mondays through Thursdays at 1782 Church Street in San Francisco (Church Street Integral Counseling Center, located in the Noe Valley neighborhood). Secure Telehealth video sessions are also available for individuals and couples residing anywhere in the state of California.",
  },
  {
    question: "How do existing clients book recurring appointments?",
    answer:
      "To protect client confidentiality and guarantee your weekly time slot, full paid sessions are scheduled directly with Marcella following your initial 30-minute consultation. Established clients can easily reschedule or coordinate times via direct text, phone call, or secure email.",
  },
];

export function FAQ({ content }: { content?: FAQContent }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const title = content?.sectionTitle || "Frequently Asked Questions";
  const faqs =
    content?.faqList && content.faqList.length > 0
      ? content.faqList
      : DEFAULT_FAQS;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="py-20 md:py-24 bg-stone-50 border-b border-stone-200 scroll-mt-16"
      id="faq"
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 font-sans">
            Have Questions?
          </span>
          <h2
            data-tina-field={
              content ? tinaField(content, "sectionTitle") : undefined
            }
            className="mt-2 text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight"
          >
            {title}
          </h2>
          {content?.sectionSubtitle && (
            <p className="mt-2 text-stone-600 text-xs sm:text-sm font-sans max-w-xl mx-auto">
              {content.sectionSubtitle}
            </p>
          )}
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-2xs hover:border-stone-300 transition duration-150"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left font-serif font-bold text-stone-900 hover:text-stone-950 transition gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span
                      data-tina-field={
                        content && content.faqList?.[index]
                          ? tinaField(content.faqList[index], "question")
                          : undefined
                      }
                      className="text-sm md:text-base font-semibold"
                    >
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen
                      ? "max-h-[500px] border-t border-stone-100"
                      : "max-h-0"
                  }`}
                >
                  <p
                    data-tina-field={
                      content && content.faqList?.[index]
                        ? tinaField(content.faqList[index], "answer")
                        : undefined
                    }
                    className="p-5 text-stone-600 text-xs md:text-sm font-sans leading-relaxed whitespace-pre-line"
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
