import React, { useState } from "react";
import { Menu, X, Flower2, Phone } from "lucide-react";
import { TOKENS } from "../styles/tokens";
import { SITE_CONFIG } from "../config/site";

interface NavbarProps {
  onBookAppointment: () => void;
  studioName?: string;
  phone?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onBookAppointment,
  studioName = SITE_CONFIG.studioName,
  phone = SITE_CONFIG.phone,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Services & Fees", href: "#services" },
    { label: "FAQs", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  const cleanPhoneDigits = phone.replace(/[^0-9]/g, "");
  const formattedPhone = cleanPhoneDigits.length === 10
    ? `(${cleanPhoneDigits.slice(0, 3)}) ${cleanPhoneDigits.slice(3, 6)}-${cleanPhoneDigits.slice(6)}`
    : phone;

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 box-border w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between w-full box-border">
        {/* Left Pillar: Brand Logo */}
        <div className="flex-1 flex justify-start">
          <a href="#" className="flex items-center gap-2 group">
            <span
              className={`p-1.5 rounded-lg bg-emerald-800 text-white ${TOKENS.accent.bgHover} transition shadow-2xs`}
            >
              <Flower2 className="w-4 h-4 text-emerald-100" />
            </span>
            <span className="font-serif text-lg font-bold tracking-tight text-stone-900">
              {studioName}
            </span>
          </a>
        </div>

        {/* Center Pillar: Desktop Nav Items */}
        <div className="hidden md:flex items-center justify-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[14px] font-medium text-stone-600 hover:text-stone-950 transition font-sans normal-case"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right Pillar: Action Button & Direct Phone */}
        <div className="hidden md:flex items-center justify-end flex-1 gap-4">
          <a
            href={`tel:${cleanPhoneDigits}`}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition flex items-center gap-1.5 font-sans"
            aria-label={`Call ${phone}`}
          >
            <Phone className="w-3.5 h-3.5 text-stone-400" />
            <span>{formattedPhone}</span>
          </a>
          <button
            id="nav-book-consultation-btn"
            onClick={onBookAppointment}
            className={TOKENS.button.navAction}
          >
            Free 30-Min Consultation
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-3">
          <a
            href={`tel:${cleanPhoneDigits}`}
            className={TOKENS.button.iconMobile}
            aria-label="Call Marcella"
          >
            <Phone className="w-4.5 h-4.5" />
          </a>
          <button
            id="mobile-menu-toggle-btn"
            onClick={toggleMenu}
            className={TOKENS.button.iconMobile}
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <X className="w-4.5 h-4.5" />
            ) : (
              <Menu className="w-4.5 h-4.5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 py-4 px-6 space-y-3 shadow-sm animate-fade-in">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-[14px] font-medium text-stone-700 hover:text-stone-950 transition font-sans py-2.5 min-h-[44px] flex items-center"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <button
                id="mobile-nav-book-consultation-btn"
                onClick={() => {
                  setIsOpen(false);
                  onBookAppointment();
                }}
                className={TOKENS.button.primaryFull}
              >
                Free 30-Min Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
