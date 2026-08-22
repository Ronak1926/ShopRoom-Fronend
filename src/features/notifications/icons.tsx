/**
 * features/notifications/icons.tsx — Safe MUI icon registry. The design JSON
 * stores an icon NAME (content.icon); the renderer maps it to the corresponding
 * @mui/icons-material component. No JSX/SVG is ever stored in the database.
 *
 * ⚠ Adding an icon here also requires adding it to ICON_NAMES in
 * ShopRoom-Backend/src/schemas/notification.schema.ts — the backend validates
 * content.icon against that list, so a name present here but missing there is
 * rejected on save.
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
// ── Icons tool library (see features/notifications/iconLibrary.ts) ────────────
import Person from "@mui/icons-material/Person";
import Settings from "@mui/icons-material/Settings";
import Bookmark from "@mui/icons-material/Bookmark";
import Close from "@mui/icons-material/Close";
import Info from "@mui/icons-material/Info";
import Help from "@mui/icons-material/Help";
import Delete from "@mui/icons-material/Delete";
import Lock from "@mui/icons-material/Lock";
import LockOpen from "@mui/icons-material/LockOpen";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Mail from "@mui/icons-material/Mail";
import Phone from "@mui/icons-material/Phone";
import LocationOn from "@mui/icons-material/LocationOn";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import Language from "@mui/icons-material/Language";
import Facebook from "@mui/icons-material/Facebook";
import Instagram from "@mui/icons-material/Instagram";
import Twitter from "@mui/icons-material/Twitter";
import YouTube from "@mui/icons-material/YouTube";
import LinkedIn from "@mui/icons-material/LinkedIn";
import WhatsApp from "@mui/icons-material/WhatsApp";
import Telegram from "@mui/icons-material/Telegram";
import Pinterest from "@mui/icons-material/Pinterest";
import Reddit from "@mui/icons-material/Reddit";
import ShoppingBag from "@mui/icons-material/ShoppingBag";
import Discount from "@mui/icons-material/Discount";
import CreditCard from "@mui/icons-material/CreditCard";
import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";
import RemoveShoppingCart from "@mui/icons-material/RemoveShoppingCart";
import LocalMall from "@mui/icons-material/LocalMall";
import Redeem from "@mui/icons-material/Redeem";
import Receipt from "@mui/icons-material/Receipt";
import Percent from "@mui/icons-material/Percent";
import QrCode from "@mui/icons-material/QrCode";
import Menu from "@mui/icons-material/Menu";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import GridView from "@mui/icons-material/GridView";
import Search from "@mui/icons-material/Search";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ChevronRight from "@mui/icons-material/ChevronRight";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import Refresh from "@mui/icons-material/Refresh";
import Share from "@mui/icons-material/Share";
import Edit from "@mui/icons-material/Edit";
import FilterList from "@mui/icons-material/FilterList";
import PlayArrow from "@mui/icons-material/PlayArrow";
import Pause from "@mui/icons-material/Pause";
import VolumeUp from "@mui/icons-material/VolumeUp";
import Analytics from "@mui/icons-material/Analytics";

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
  // Icons tool library — General / Social / Ecommerce / UI sets.
  Person, Settings, Bookmark, Close, Info, Help, Delete, Lock, LockOpen,
  Visibility, VisibilityOff, Mail, Phone, LocationOn, CalendarMonth, Language,
  Facebook, Instagram, Twitter, YouTube, LinkedIn, WhatsApp, Telegram, Pinterest, Reddit,
  ShoppingBag, Discount, CreditCard, AccountBalanceWallet, RemoveShoppingCart,
  LocalMall, Redeem, Receipt, Percent, QrCode,
  Menu, Add, Remove, GridView, Search, ArrowBack, ArrowUpward, ArrowDownward,
  ChevronRight, MoreHoriz, Refresh, Share, Edit, FilterList,
  PlayArrow, Pause, VolumeUp, Analytics,
};

export function getIcon(name?: string): ElementType | null {
  return name ? ICON_REGISTRY[name] ?? null : null;
}
