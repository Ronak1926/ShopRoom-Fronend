import Image from "next/image";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";

export function ShopkeeperLeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
      {/* Purple gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-active)]" />
      {/* Radial glow */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.4),transparent_60%)]" />

      {/* Background Illustration — subtle decorative overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <Image
          src="/Background%20Illustration%20Elements.svg"
          alt=""
          width={480}
          height={480}
          className="opacity-[0.18] rotate-[-8deg] scale-125"
          priority
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-white gap-8 py-10 px-8">
        {/* Shop icon */}
        <div className="w-[88px] h-[88px] rounded-[22px] bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          <StorefrontOutlinedIcon sx={{ fontSize: 44, color: "var(--color-text-on-brand)" }} />
        </div>

        {/* Tagline */}
        <div className="text-center max-w-[280px]">
          <p className="text-[22px] font-semibold leading-tight tracking-[-0.3px]">
            Power your shop.
            <br />
            Reach more customers.
          </p>
          <p className="mt-2 text-[13px] text-white/75 leading-relaxed">
            Register your shop on ShopRoom and start connecting with thousands
            of local customers.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-8 text-center">
          <div>
            <p className="text-[26px] font-bold tracking-[-0.5px]">2K+</p>
            <p className="text-[11px] text-white/65 font-medium uppercase tracking-[0.5px]">
              Shops
            </p>
          </div>
          <div className="w-px bg-white/20" />
          <div>
            <p className="text-[26px] font-bold tracking-[-0.5px]">50K+</p>
            <p className="text-[11px] text-white/65 font-medium uppercase tracking-[0.5px]">
              Customers
            </p>
          </div>
          <div className="w-px bg-white/20" />
          <div>
            <p className="text-[26px] font-bold tracking-[-0.5px] flex items-center justify-center gap-1">
              4.8
              <StarRateRoundedIcon sx={{ fontSize: 20 }} />
            </p>
            <p className="text-[11px] text-white/65 font-medium uppercase tracking-[0.5px]">
              Rating
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
