"use client";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import TextFieldsOutlinedIcon from "@mui/icons-material/TextFieldsOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import SmartButtonOutlinedIcon from "@mui/icons-material/SmartButtonOutlined";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import type { ElementType } from "react";
import { flattenNodes, nodeLabel } from "@/features/notifications/tree";
import type { CompositionNode, NotificationDesign } from "@/features/notifications/types";
import { AssetThumb } from "./LibraryGrid";

const TYPE_ICON: Record<string, ElementType> = {
  GROUP: FolderOutlinedIcon,
  CONTAINER: FolderOutlinedIcon,
  TEXT: TextFieldsOutlinedIcon,
  VARIABLE_TEXT: TextFieldsOutlinedIcon,
  STOCK: TextFieldsOutlinedIcon,
  DISCOUNT: TextFieldsOutlinedIcon,
  PRICE: TextFieldsOutlinedIcon,
  PRODUCT_IMAGE: ImageOutlinedIcon,
  IMAGE: ImageOutlinedIcon,
  BUTTON: SmartButtonOutlinedIcon,
  ICON: EmojiEmotionsOutlinedIcon,
  DECORATION: AutoAwesomeOutlinedIcon,
  PARTICLES: AutoAwesomeOutlinedIcon,
  BADGE: SellOutlinedIcon,
  LABEL: LabelOutlinedIcon,
};

interface Props {
  width: number;
  design: NotificationDesign | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleVisible: (id: string) => void;
  onToggleLock: (id: string) => void;
}

export default function LayersPanel({
  width,
  design,
  selectedId,
  onSelect,
  onToggleVisible,
  onToggleLock,
}: Props) {
  const rows = design ? flattenNodes(design.elements) : [];

  return (
    <aside
      // width is drag-controlled, so it must be an inline style
      style={{ width }}
      className="shrink-0 flex flex-col bg-(--color-bg-surface) border-t border-(--color-border-default) overflow-hidden"
    >
      <div className="px-4 pt-3 pb-2">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint)">
          Layers {rows.length ? `(${rows.length})` : ""}
        </p>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-2 flex flex-col gap-0.5">
        {rows.map(({ node, depth }) => {
          const active = selectedId === node.id;
          const hidden = node.visible === false;
          const locked = !!node.locked;
          return (
            <div
              key={node.id}
              onClick={() => onSelect(node.id)}
              // depth indent is data-driven, so it must be an inline style
              style={{ paddingLeft: 8 + depth * 12 }}
              className={`group flex items-center gap-2 h-8 shrink-0 pr-1 rounded-lg cursor-pointer transition-colors ${
                active ? "bg-(--color-brand-primary-light)" : "hover:bg-(--color-bg-surface-hover)"
              }`}
            >
              <RowIcon node={node} active={active} />
              <span
                className={`text-[12px] truncate ${
                  active
                    ? "font-semibold text-(--color-brand-primary)"
                    : hidden
                      ? "text-(--color-text-hint) line-through"
                      : "text-(--color-text-secondary)"
                }`}
              >
                {nodeLabel(node)}
              </span>
              <button
                type="button"
                title={locked ? "Unlock" : "Lock"}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLock(node.id);
                }}
                className={`ml-auto w-6 h-6 flex items-center justify-center rounded-md cursor-pointer transition-colors ${
                  locked
                    ? "text-(--color-brand-primary)"
                    : "text-(--color-text-hint) opacity-0 group-hover:opacity-100 hover:text-(--color-text-primary)"
                }`}
              >
                {locked ? (
                  <LockOutlinedIcon sx={{ fontSize: 14 }} />
                ) : (
                  <LockOpenOutlinedIcon sx={{ fontSize: 14 }} />
                )}
              </button>
              <button
                type="button"
                title={hidden ? "Show" : "Hide"}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisible(node.id);
                }}
                className="w-6 h-6 flex items-center justify-center rounded-md text-(--color-text-hint) hover:text-(--color-text-primary) cursor-pointer"
              >
                {hidden ? (
                  <VisibilityOffOutlinedIcon sx={{ fontSize: 15 }} />
                ) : (
                  <VisibilityOutlinedIcon sx={{ fontSize: 15 }} />
                )}
              </button>
            </div>
          );
        })}
        {!rows.length && (
          <div className="px-2 py-6 text-[12px] text-(--color-text-hint)">No layers yet.</div>
        )}
      </div>
    </aside>
  );
}

/**
 * Decorations show the real asset glyph (the actual cloud/leaf/sparkle art,
 * tinted to match), not a generic catch-all icon — everything else falls
 * back to its type icon.
 */
function RowIcon({ node, active }: { node: CompositionNode; active: boolean }) {
  const color = active ? "var(--color-brand-primary)" : "var(--color-text-secondary)";
  if (node.asset?.assetId) {
    return (
      <span className="w-4 h-4 shrink-0 flex items-center justify-center" style={{ color: node.style?.color ?? color }}>
        <AssetThumb
          item={{
            assetId: node.asset.assetId,
            name: "",
            width: 16,
            height: 16,
            color: node.style?.color,
            opacity: node.style?.opacity,
          }}
        />
      </span>
    );
  }
  const Icon = TYPE_ICON[node.type] ?? LayersOutlinedIcon;
  return <Icon sx={{ fontSize: 15, color }} />;
}
