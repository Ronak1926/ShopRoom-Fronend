import Image from "next/image";

export function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-[58%] relative overflow-hidden">
      <Image
        src="/auth-sky.svg"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <Image
        src="/auth-illustration.png"
        alt="A welcoming local shop and community of happy customers"
        fill
        priority
        unoptimized
        className="object-contain p-6"
      />
    </div>
  );
}
