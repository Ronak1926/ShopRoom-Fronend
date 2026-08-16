/**
 * features/notifications/icons.tsx — Safe MUI icon registry. The design JSON
 * stores an icon NAME (content.icon); the renderer maps it to the corresponding
 * @mui/icons-material component. No JSX/SVG is ever stored in the database.
 */

import type { ElementType } from "react";
import AutoAwesome from "@mui/icons-material/AutoAwesome";
import Inventory2 from "@mui/icons-material/Inventory2";
import Replay from "@mui/icons-material/Replay";
import HourglassBottom from "@mui/icons-material/HourglassBottom";
import Sell from "@mui/icons-material/Sell";
import FlashOn from "@mui/icons-material/FlashOn";
import LocalOffer from "@mui/icons-material/LocalOffer";
import Event from "@mui/icons-material/Event";
import Campaign from "@mui/icons-material/Campaign";
import Notifications from "@mui/icons-material/Notifications";
import Tune from "@mui/icons-material/Tune";
import CardGiftcard from "@mui/icons-material/CardGiftcard";
import Assignment from "@mui/icons-material/Assignment";
import ImageIcon from "@mui/icons-material/Image";
import AccessTime from "@mui/icons-material/AccessTime";
import Star from "@mui/icons-material/Star";
import Verified from "@mui/icons-material/Verified";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import Favorite from "@mui/icons-material/Favorite";
import Celebration from "@mui/icons-material/Celebration";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Storefront from "@mui/icons-material/Storefront";
import LocalFireDepartment from "@mui/icons-material/LocalFireDepartment";

export const ICON_REGISTRY: Record<string, ElementType> = {
  AutoAwesome, Inventory2, Replay, HourglassBottom, Sell, FlashOn, LocalOffer,
  Event, Campaign, Notifications, Tune, CardGiftcard, Assignment, Image: ImageIcon,
  AccessTime, Star, Verified, CheckCircleOutlined, Favorite, Celebration,
  ArrowForward, Storefront, LocalFireDepartment,
};

export function getIcon(name?: string): ElementType | null {
  return name ? ICON_REGISTRY[name] ?? null : null;
}
