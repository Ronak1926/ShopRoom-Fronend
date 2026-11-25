export const authInputCls = (hasErr: boolean) =>
  `w-full h-12 rounded-lg bg-(--color-auth-input-bg) text-sm text-(--color-auth-ink) placeholder:text-(--color-auth-ink-muted) outline-none focus:ring-2 focus:ring-(--color-auth-primary)/30 transition-shadow border border-transparent ${
    hasErr ? "ring-2 ring-(--color-danger)" : ""
  }`;

export const authLabelCls = "text-[10px] tracking-[1px] uppercase font-bold text-(--color-auth-ink)";
