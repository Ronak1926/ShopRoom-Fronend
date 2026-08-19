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
import Whatshot from "@mui/icons-material/Whatshot";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import WorkspacePremium from "@mui/icons-material/WorkspacePremium";
import Bolt from "@mui/icons-material/Bolt";
import FiberManualRecord from "@mui/icons-material/FiberManualRecord";
import LocalShipping from "@mui/icons-material/LocalShipping";
import Schedule from "@mui/icons-material/Schedule";
import HighlightOff from "@mui/icons-material/HighlightOff";
import Spa from "@mui/icons-material/Spa";
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import EmojiEvents from "@mui/icons-material/EmojiEvents";
import ThumbUp from "@mui/icons-material/ThumbUp";
import NewReleases from "@mui/icons-material/NewReleases";
import TrendingUp from "@mui/icons-material/TrendingUp";
import FiberNew from "@mui/icons-material/FiberNew";
import Diamond from "@mui/icons-material/Diamond";
import Shield from "@mui/icons-material/Shield";
import RadioButtonUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import Warning from "@mui/icons-material/Warning";
import Devices from "@mui/icons-material/Devices";
import Checkroom from "@mui/icons-material/Checkroom";
import Home from "@mui/icons-material/Home";
import SportsSoccer from "@mui/icons-material/SportsSoccer";
import Toys from "@mui/icons-material/Toys";
import AcUnit from "@mui/icons-material/AcUnit";
import WbSunny from "@mui/icons-material/WbSunny";
import Autorenew from "@mui/icons-material/Autorenew";
import Download from "@mui/icons-material/Download";
import Build from "@mui/icons-material/Build";
import RocketLaunch from "@mui/icons-material/RocketLaunch";
import School from "@mui/icons-material/School";
import EditNote from "@mui/icons-material/EditNote";

export const ICON_REGISTRY: Record<string, ElementType> = {
  AutoAwesome, Inventory2, Replay, HourglassBottom, Sell, FlashOn, LocalOffer,
  Event, Campaign, Notifications, Tune, CardGiftcard, Assignment, Image: ImageIcon,
  AccessTime, Star, Verified, CheckCircleOutlined, Favorite, Celebration,
  ArrowForward, Storefront, LocalFireDepartment,
  // Badges & Labels icon set (persisted as MUI names — see features/notifications/badgeLabelPresets.ts)
  Whatshot, ShoppingCart, WorkspacePremium, Bolt, FiberManualRecord, LocalShipping,
  Schedule, HighlightOff, Spa, VerifiedUser, EmojiEvents, ThumbUp, NewReleases,
  TrendingUp, FiberNew, Diamond, Shield, RadioButtonUnchecked, Warning, Devices,
  Checkroom, Home, SportsSoccer, Toys, AcUnit, WbSunny, Autorenew, Download,
  Build, RocketLaunch, School, EditNote,
};

export function getIcon(name?: string): ElementType | null {
  return name ? ICON_REGISTRY[name] ?? null : null;
}
