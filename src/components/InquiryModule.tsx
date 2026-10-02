import React, { useState } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Phone,
  MessageSquare,
} from "lucide-react";
import { TOKENS } from "../styles/tokens";
import { SITE_CONFIG, EVENTS_CONTENT } from "../config/site";
import type { FormFieldItem } from "../types/content";

interface InquiryModuleProps {
  formFields?: FormFieldItem[];
  submitButtonText?: string;
  recipientEmail?: string;
}

export const InquiryModule: React.FC<InquiryModuleProps> = ({
  formFields: propsFormFields,
  submitButtonText: propsSubmitButtonText,
  recipientEmail = SITE_CONFIG.email,
}) => {
  const defaultFields: FormFieldItem[] = [
    {
      _template: "inputField",
      label: "First Name",
      fieldType: "text",
      placeholder: "Your first name",
      required: true,
    },
    {
      _template: "inputField",
      label: "Last Name",
      fieldType: "text",
      placeholder: "Your last name",
      required: true,
    },
    {
      _template: "inputField",
      label: "Email Address",
      fieldType: "email",
      placeholder: "name@example.com",
      required: true,
    },
    {
      _template: "inputField",
      label: "Phone Number",
      fieldType: "tel",
      placeholder: "(415) 373-6223",
      required: true,
    },
    {
      _template: "selectField",
      label: "Preferred Session Format",
      options: [
        "Telehealth (Online Video across California)",
        "In-Person (1782 Church St, San Francisco)",
        "Either / Open to Discussion",
      ],
      required: true,
    },
    {
      _template: "textareaField",
      label: "What is bringing you to therapy at this moment?",
      placeholder:
        "Briefly share what you'd like support with (e.g., life transitions, anxiety, relationship communication)...",
      required: false,
    },
    {
      _template: "selectField",
      label: "Communication Consent",
      options: [
        "I consent to be contacted via text or email regarding this inquiry",
        "Please contact me by email only",
        "Please contact me by phone call only",
      ],
      required: true,
    },
  ];

  const formFields: FormFieldItem[] =
    propsFormFields && propsFormFields.length > 0
      ? propsFormFields
      : EVENTS_CONTENT.formFields?.length
        ? EVENTS_CONTENT.formFields
        : defaultFields;
  const submitButtonText =
    propsSubmitButtonText ||
    EVENTS_CONTENT.formOptions?.submitButtonText ||
    "Request 30-Min Consultation";

  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFieldChange = (label: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [label]: value }));
  };

  const cleanPhoneDigits = SITE_CONFIG.phone.replace(/[^0-9]/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const webhookUrl = SITE_CONFIG.webhookUrl;
    const recipient = recipientEmail || SITE_CONFIG.email;

    const payload = {
      recipient,
      submittedAt: new Date().toISOString(),
      fields: formFields.map((field) => ({
        label: field.label,
        value: fieldValues[field.label] || "N/A",
      })),
    };

    console.info("📬 [InquiryModule] Submitting consultation inquiry...", {
      recipient,
      deploymentId: SITE_CONFIG.deploymentId || "(empty)",
      webhookUrl: webhookUrl || "(not configured)",
      payload,
    });

    if (!webhookUrl) {
      const missingMsg =
        "Consultation request failed: DEPLOYMENT_ID is not configured in your environment.";
      console.error(`❌ [InquiryModule] ${missingMsg}`);
      setIsSubmitting(false);
      setSubmitError(
        "Consultation form is not connected to a backend. Please contact Marcella directly by phone or text."
      );
      return;
    }

    try {
      await fetch(webhookUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });
      console.info(
        "✅ [InquiryModule] Consultation request sent successfully."
      );
      setIsSubmitting(false);
      setSubmitted(true);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Network error transmitting inquiry to endpoint.";
      console.error("❌ [InquiryModule] Submission Error:", err);
      setIsSubmitting(false);
      setSubmitError(errorMsg);
    }
  };

  const clientNameField = Object.entries(fieldValues).find(([label]) =>
    label.toLowerCase().includes("name")
  );
  const clientName = clientNameField ? clientNameField[1] : "";

  return (
    <section
      id="inquiry"
      className="pt-8 pb-20 md:pb-24 bg-stone-50 border-b border-stone-200 scroll-mt-16"
    >
      <div className="max-w-3xl mx-auto px-6">
        {/* Direct Call / Text Callout Box */}
        <div className="mb-8 p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Prefer to Reach Out Directly?
            </h3>
            <p className="text-xs text-stone-600 font-sans">
              Feel free to call or text directly to coordinate consultation
              timing.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`tel:${cleanPhoneDigits}`}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider font-sans transition flex items-center gap-2 shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
            <a
              href={`sms:${cleanPhoneDigits}`}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider font-sans transition flex items-center gap-2 shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Text ({SITE_CONFIG.phoneDisplay})</span>
            </a>
          </div>
        </div>

        <div className={TOKENS.card.base}>
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-serif font-bold text-2xl text-stone-900">
                Consultation Request Received
              </h3>
              <p className="text-xs text-stone-600 font-sans max-w-md mx-auto leading-relaxed">
                Thank you{clientName ? `, ${clientName}` : ""}. Marcella will
                review your note and follow up shortly to confirm a convenient
                time for our 30-minute consultation call.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setSubmitError(null);
                  setFieldValues({});
                }}
                className={`mt-4 text-xs font-semibold uppercase tracking-wider text-stone-900 underline ${TOKENS.accent.iconHover} cursor-pointer`}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-start gap-3 animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="font-semibold block">
                      Submission Error: {submitError}
                    </strong>
                    <p className="text-stone-600 leading-relaxed">
                      Please reach out to Marcella directly at{" "}
                      <a
                        href={`tel:${cleanPhoneDigits}`}
                        className="underline font-semibold text-stone-900"
                      >
                        {SITE_CONFIG.phoneDisplay}
                      </a>
                      .
                    </p>
                  </div>
                </div>
              )}

              {formFields.map((field, idx) => {
                const fieldKey = `field_${idx}`;
                const isRequired = field.required !== false;

                if (field._template === "selectField") {
                  return (
                    <div key={fieldKey}>
                      <label
                        htmlFor={`field-input-${idx}`}
                        className={TOKENS.input.label}
                      >
                        {field.label} {isRequired && "*"}
                      </label>
                      <select
                        id={`field-input-${idx}`}
                        required={isRequired}
                        value={fieldValues[field.label] || ""}
                        onChange={(e) =>
                          handleFieldChange(field.label, e.target.value)
                        }
                        className={TOKENS.input.select}
                      >
                        <option value="" disabled>
                          Select an option...
                        </option>
                        {field.options?.map((opt, oIdx) => (
                          <option key={oIdx} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                if (field._template === "textareaField") {
                  return (
                    <div key={fieldKey}>
                      <label
                        htmlFor={`field-input-${idx}`}
                        className={TOKENS.input.label}
                      >
                        {field.label} {isRequired && "*"}
                      </label>
                      <textarea
                        id={`field-input-${idx}`}
                        rows={3}
                        required={isRequired}
                        value={fieldValues[field.label] || ""}
                        onChange={(e) =>
                          handleFieldChange(field.label, e.target.value)
                        }
                        placeholder={field.placeholder || ""}
                        className={TOKENS.input.base}
                      />
                    </div>
                  );
                }

                // Default inputField
                return (
                  <div key={fieldKey}>
                    <label
                      htmlFor={`field-input-${idx}`}
                      className={TOKENS.input.label}
                    >
                      {field.label} {isRequired && "*"}
                    </label>
                    <input
                      id={`field-input-${idx}`}
                      type={field.fieldType || "text"}
                      required={isRequired}
                      value={fieldValues[field.label] || ""}
                      onChange={(e) =>
                        handleFieldChange(field.label, e.target.value)
                      }
                      placeholder={field.placeholder || ""}
                      className={TOKENS.input.base}
                    />
                  </div>
                );
              })}

              {/* Privacy Notice Checkbox Verification */}
              <div className="flex items-start gap-2.5 py-1 flex-row">
                <input
                  id="privacy-notice-verification"
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-0.5 rounded border-stone-300 text-emerald-700 focus:ring-emerald-500 accent-emerald-700 cursor-pointer"
                />
                <label
                  htmlFor="privacy-notice-verification"
                  className="text-[11px] text-stone-600 font-sans leading-relaxed cursor-pointer select-none"
                >
                  I verify that I have read the privacy notice and consent to the confidential handling of my contact information. *
                </label>
              </div>

              <div className="pt-2">
                <button
                  id="submit-consultation-inquiry-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className={TOKENS.button.primaryFull}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{submitButtonText}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Privacy and Crisis Notice */}
              <div className="pt-3 border-t border-stone-100 flex items-start gap-2 text-[11px] text-stone-500 font-sans leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Confidentiality Notice:</strong> Please do not include
                  sensitive medical or psychiatric information in this form. This
                  form is for initial scheduling purposes only. Information submitted
                  is kept confidential and used solely to coordinate consultation timing.
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
