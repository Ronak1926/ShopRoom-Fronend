import Image from "next/image";

export function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-active)]" />
      {/* Subtle radial glow */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.4),transparent_60%)]" />

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-white gap-8 py-10 px-8">
        {/* Phone mockup — responsive: scales down when the panel is short */}
        <div className="flex-shrink min-h-0 flex items-center justify-center">
          <Image
            src="/phone_signup.svg"
            alt="ShopRoom app preview"
            width={256}
            height={548}
            priority
            className="w-auto h-auto max-h-[60vh] drop-shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
          />
        </div>

        {/* Tagline */}
        <div className="text-center max-w-[280px] shrink-0">
          <p className="text-[22px] font-semibold leading-tight tracking-[-0.3px]">
            Never miss a drop again.
          </p>
          <p className="mt-2 text-[13px] text-white/75 leading-relaxed">
            Join rooms from your favourite local shops.
          </p>
        </div>
      </div>
    </div>
  );
}
