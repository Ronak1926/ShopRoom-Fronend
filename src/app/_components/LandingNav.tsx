"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { getCookie } from "@/utils/cookieUtils";

type LoggedInState = { href: string } | null;

function readLoggedInState(): LoggedInState {
  if (getCookie("token")) return { href: "/customer/home" };
  if (getCookie("shopkeeper_token")) return { href: "/shopkeeper/dashboard" };
  return null;
}

export default function LandingNav() {
  const [loggedIn, setLoggedIn] = useState<LoggedInState>(null);
  const [scrolled, setScrolled] = useState(false);

  // This is a real landing page hit via SSR + hydration (unlike an
  // already-authenticated dashboard shell reached by client-side nav), so
  // the initial render must match the server's logged-out HTML exactly —
  // read the cookie after mount instead of in a lazy useState initializer,
  // deferred a tick so the state update isn't synchronous within the effect.
  useEffect(() => {
    const id = setTimeout(() => setLoggedIn(readLoggedInState()), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-20 w-full flex items-center justify-between px-6 transition-all duration-300 ${
        scrolled
          ? "h-14 bg-(--color-landing-nav-scrolled) backdrop-blur-md border-b border-white/8"
          : "h-16 bg-transparent border-b border-transparent"
      }`}
    >
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-(--color-brand-primary)">
          <StorefrontOutlinedIcon
            sx={{ fontSize: 18, color: "var(--color-text-on-brand)" }}
          />
        </span>
        <span className="text-[18px] font-bold text-white tracking-tight">
          ShopRoom
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <a
          href="#how-it-works"
          className="text-[14px] text-white/55 hover:text-white transition-colors duration-200"
        >
          How it works
        </a>
        <a
          href="#features"
          className="text-[14px] text-white/55 hover:text-white transition-colors duration-200"
        >
          For Shopkeepers
        </a>
        <a
          href="#shopkeepers"
          className="text-[14px] text-white/55 hover:text-white transition-colors duration-200"
        >
          Pricing
        </a>
      </div>

      <div className="flex items-center gap-3">
        {loggedIn ? (
          <Link
            href={loggedIn.href}
            className="h-9 px-5 flex items-center text-[14px] font-semibold text-white bg-(--color-brand-primary) rounded-full hover:bg-(--color-brand-primary-hover) transition-colors duration-150"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/customer/login"
              className="h-9 px-4 flex items-center text-[14px] text-white/70 hover:text-white transition-colors duration-200"
            >
              Log In
            </Link>
            <Link
              href="/customer/signup"
              className="h-9 px-5 flex items-center text-[14px] font-semibold text-white bg-(--color-brand-primary) rounded-full hover:bg-(--color-brand-primary-hover) transition-colors duration-150"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
