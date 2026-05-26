import Image from "next/image";

interface ContinueWithGoogleProps {
  disabled?: boolean;
}

export function ContinueWithGoogle({ disabled }: ContinueWithGoogleProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="w-full h-[50px] rounded-[8px] border border-[#C9C4D7]/30 px-6 py-[14px] flex items-center justify-center gap-3 bg-white hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <Image
        src="/Google.svg"
        alt="Google"
        width={20}
        height={20}
        className="shrink-0"
      />
      <span className="text-[14px] leading-[20px] font-medium text-[var(--color-auth-ink)]">
        Continue with Google
      </span>
    </button>
  );
}
