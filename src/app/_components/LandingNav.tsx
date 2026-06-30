import Link from "next/link";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";

export default function LandingNav() {
  return (
    <nav className="relative z-20 w-full h-16 flex items-center justify-between px-6">
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-(--color-brand-primary)">
          <StorefrontOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />
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
      </div>
    </nav>
  );
}
