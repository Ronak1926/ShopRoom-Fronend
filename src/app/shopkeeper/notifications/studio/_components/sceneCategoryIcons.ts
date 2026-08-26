import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import ParkOutlinedIcon from "@mui/icons-material/ParkOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import CropSquareOutlinedIcon from "@mui/icons-material/CropSquareOutlined";
import FlareOutlinedIcon from "@mui/icons-material/FlareOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import type { ElementType } from "react";
import type { SceneCategory } from "@/features/notifications/scenes";

/** MUI icon per scene category — used by the category tiles (never plain text). */
export const SCENE_CATEGORY_ICONS: Record<SceneCategory, ElementType> = {
  All: AppsOutlinedIcon,
  Nature: ParkOutlinedIcon,
  Clouds: CloudOutlinedIcon,
  Abstract: AutoAwesomeOutlinedIcon,
  Geometric: CategoryOutlinedIcon,
  Sale: SellOutlinedIcon,
  Retail: StorefrontOutlinedIcon,
  Festive: CelebrationOutlinedIcon,
  Seasonal: CalendarMonthOutlinedIcon,
  Minimal: CropSquareOutlinedIcon,
  Glow: FlareOutlinedIcon,
  Premium: WorkspacePremiumOutlinedIcon,
  Night: DarkModeOutlinedIcon,
};
