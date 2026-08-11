"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { getCookie } from "@/utils/cookieUtils";
import { slideDown, SPRING } from "./motion";
import AnimatedButton from "./ui/AnimatedButton";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Success Stories", href: "#testimonials" },
  { label: "Resources", href: "#faq" },
] as const;

type LoggedInState = { href: string } | null;

function readLoggedInState(): LoggedInState {
  if (getCookie("token")) return { href: "/customer/home" };
  if (getCookie("shopkeeper_token")) return { href: "/shopkeeper/dashboard" };
  return null;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState<LoggedInState>(null);

  // Match the server's logged-out HTML, then read the cookie after mount.
  useEffect(() => {
    const id = setTimeout(() => setLoggedIn(readLoggedInState()), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      variants={slideDown}
      initial="hidden"
      animate="visible"
      className={`fixed top-0 inset-x-0 z-(--z-sticky) transition-all duration-300 ${
        scrolled
          ? "bg-(--color-bg-surface)/80 backdrop-blur-lg border-b border-(--color-border-default) shadow-(--shadow-xs)"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-[1200px] mx-auto h-16 px-6 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-(--color-brand-primary)">
            <StorefrontOutlinedIcon
              sx={{ fontSize: 20, color: "var(--color-text-on-brand)" }}
            />
          </span>
          <span className="text-[19px] font-extrabold text-(--color-text-primary) tracking-tight">
            ShopRoom
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="text-[14px] font-medium text-(--color-text-secondary) hover:text-(--color-brand-primary) transition-colors duration-200"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden sm:flex items-center gap-2.5">
          {loggedIn ? (
            <AnimatedButton href={loggedIn.href} variant="primary">
              Go to Dashboard
            </AnimatedButton>
          ) : (
            <>
              <AnimatedButton href="/customer/login" variant="outline">
                Login
              </AnimatedButton>
              <AnimatedButton href="/shopkeeper/signup" variant="primary">
                Create Shop
              </AnimatedButton>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl text-(--color-text-primary) hover:bg-(--color-bg-surface-hover) transition-colors"
        >
          {open ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={SPRING}
            className="sm:hidden overflow-hidden bg-(--color-bg-surface) border-b border-(--color-border-default)"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="py-2.5 text-[15px] font-medium text-(--color-text-secondary) hover:text-(--color-brand-primary) transition-colors"
                >
                  {label}
                </a>
              ))}
              <div className="flex flex-col gap-2.5 pt-3">
                <AnimatedButton href="/customer/login" variant="outline">
                  Login
                </AnimatedButton>
                <AnimatedButton href="/shopkeeper/signup" variant="primary">
                  Create Shop
                </AnimatedButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
