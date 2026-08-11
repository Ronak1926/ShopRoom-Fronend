"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { fadeUp, VIEWPORT } from "./motion";
import NewsletterForm from "./NewsletterForm";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it Works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Updates", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "Guides", href: "#" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Success Stories", href: "#testimonials" },
      { label: "Community", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Security", href: "#" },
    ],
  },
] as const;

const SOCIALS = [
  { Icon: FacebookIcon, label: "Facebook" },
  { Icon: InstagramIcon, label: "Instagram" },
  { Icon: TwitterIcon, label: "Twitter" },
  { Icon: YouTubeIcon, label: "YouTube" },
  { Icon: LinkedInIcon, label: "LinkedIn" },
] as const;

export default function Footer() {
  return (
    <motion.footer
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className="w-full bg-(--color-bg-surface) border-t border-(--color-border-default)"
    >
      <div className="max-w-[1200px] mx-auto px-6 pt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 pb-12">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-4 max-w-[280px]">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-(--color-brand-primary)">
                <StorefrontOutlinedIcon
                  sx={{ fontSize: 20, color: "var(--color-text-on-brand)" }}
                />
              </span>
              <span className="text-[19px] font-extrabold text-(--color-text-primary)">
                ShopRoom
              </span>
            </Link>
            <p className="text-[13px] text-(--color-text-secondary) leading-relaxed">
              Connecting shopkeepers and customers to build stronger communities
              together.
            </p>
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-(--color-bg-page) text-(--color-text-secondary) hover:bg-(--color-brand-primary) hover:text-(--color-text-on-brand) transition-colors duration-150"
                >
                  <Icon sx={{ fontSize: 18 }} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map(({ title, links }) => (
            <nav key={title} aria-label={title}>
              <p className="text-[13px] font-bold text-(--color-text-primary) mb-4">
                {title}
              </p>
              <ul className="flex flex-col gap-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[13px] text-(--color-text-secondary) hover:text-(--color-brand-primary) transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Newsletter band */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8 border-t border-(--color-border-default)">
          <div className="max-w-[420px]">
            <p className="text-[15px] font-bold text-(--color-text-primary)">
              Subscribe to our newsletter
            </p>
            <p className="text-[13px] text-(--color-text-secondary) mt-1">
              Get the latest updates and tips to grow your business.
            </p>
          </div>
          <div className="w-full md:w-[360px]">
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-(--color-border-default) py-6 text-center">
          <span className="text-[12px] text-(--color-text-hint)">
            © 2026 ShopRoom. All rights reserved.
          </span>
        </div>
      </div>
    </motion.footer>
  );
}
