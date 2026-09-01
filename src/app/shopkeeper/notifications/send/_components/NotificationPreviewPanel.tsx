"use client";

import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import Avatar from "@/components/ui/Avatar";
import DesignPreview from "@/components/notifications/DesignPreview";
import type { SendableNotification } from "../_hooks/useSendableNotifications";
import type { ShopAudience } from "../_hooks/useShopAudience";

interface Props {
  item: SendableNotification | null;
  message: string;
  shop: ShopAudience | null;
}

/**
 * The notification as the phone will draw it: the app row the system owns, the
 * banner from the Studio, and the custom message underneath it.
 */
export default function NotificationPreviewPanel({ item, message, shop }: Props) {
  return (
    <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
      <h2 className="text-[13.5px] font-bold text-(--color-text-primary)">
        Notification Preview
      </h2>
      <p className="text-[11px] text-(--color-text-hint) mt-0.5">
        This is how your notification content will look.
      </p>

      <div className="mt-4 rounded-2xl border border-(--color-border-default) bg-(--color-bg-page) p-3">
        <div className="flex items-center gap-2">
          <Avatar
            name={shop?.shopName ?? "Your shop"}
            src={shop?.logoUrl}
            size="xs"
            shape="square"
          />
          <span className="text-[11px] font-semibold text-(--color-text-secondary) truncate">
            {shop?.shopName ?? "Your shop"}
          </span>
          <span className="text-[11px] text-(--color-text-hint)">· now</span>
        </div>

        <div className="mt-2 rounded-xl overflow-hidden bg-(--color-bg-surface)">
          {item ? (
            <DesignPreview design={item.design} />
          ) : (
            <div className="aspect-2/1 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-(--color-border-strong) text-center px-4">
              <ImageOutlinedIcon
                sx={{ fontSize: 22, color: "var(--color-text-hint)" }}
              />
              <p className="text-[11.5px] text-(--color-text-hint)">
                Choose a notification to see it here.
              </p>
            </div>
          )}
        </div>

        <div className="mt-2 rounded-xl bg-(--color-bg-surface) px-3 py-2.5">
          {message.trim() ? (
            <p className="text-[12px] leading-relaxed text-(--color-text-primary) whitespace-pre-wrap break-words">
              {message}
            </p>
          ) : (
            <p className="text-[11.5px] text-(--color-text-hint)">
              Your custom message appears here, under the banner.
            </p>
          )}
        </div>
      </div>

      <p className="mt-3 text-[10.5px] leading-relaxed text-(--color-text-hint)">
        The phone draws the app icon, name and time. The banner and the message under it are
        yours.
      </p>
    </section>
  );
}
