import Link from "next/link";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";

const platform = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#shopkeepers" },
  { label: "For Shopkeepers", href: "/shopkeeper/signup" },
];

const legal = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
];

export default function LandingFooter() {
  return (
    <footer className="w-full bg-(--color-bg-sidebar)">
      <div className="max-w-[1100px] mx-auto px-6 pt-14">
        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-12 pb-12">
          {/* Brand block */}
          <div className="flex flex-col gap-4 max-w-[280px]">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-(--color-brand-primary)">
                <StorefrontOutlinedIcon sx={{ fontSize: 18, color: "var(--color-text-on-brand)" }} />
              </span>
              <span className="text-[18px] font-bold text-white">ShopRoom</span>
            </Link>
            <p className="text-[13px] text-(--color-text-sidebar-muted) leading-relaxed">
              Curating the world&apos;s finest physical shop news for a modern,
              proximity-focused audience.
            </p>
          </div>

          {/* Link columns */}
          <div className="lg:ml-auto flex gap-16 flex-wrap">
            <div>
              <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-(--color-text-hint) mb-5">
                Platform
              </p>
              <ul className="flex flex-col gap-3">
                {platform.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[13px] text-(--color-text-sidebar-muted) hover:text-white transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-(--color-text-hint) mb-5">
                Legal
              </p>
              <ul className="flex flex-col gap-3">
                {legal.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[13px] text-(--color-text-sidebar-muted) hover:text-white transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-4 flex items-center justify-between flex-wrap gap-3">
          <span className="text-[11px] font-medium tracking-[0.06em] uppercase text-white/35">
            © 2024 ShopRoom. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <button
              className="text-(--color-text-sidebar-muted) hover:text-white transition-colors duration-150"
              aria-label="Change language"
            >
              <LanguageOutlinedIcon sx={{ fontSize: 18 }} />
            </button>
            <button
              className="text-(--color-text-sidebar-muted) hover:text-white transition-colors duration-150"
              aria-label="Share"
            >
              <ShareOutlinedIcon sx={{ fontSize: 18 }} />
            </button>
            <a
              href="/contact"
              className="text-[11px] tracking-[0.06em] uppercase text-white/35 hover:text-white transition-colors duration-150"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
