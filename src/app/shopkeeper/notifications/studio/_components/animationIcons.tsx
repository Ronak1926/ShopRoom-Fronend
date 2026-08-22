import type { ElementType } from "react";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import OpacityOutlinedIcon from "@mui/icons-material/OpacityOutlined";
import ZoomInMapOutlinedIcon from "@mui/icons-material/ZoomInMapOutlined";
import ZoomOutMapOutlinedIcon from "@mui/icons-material/ZoomOutMapOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import AirOutlinedIcon from "@mui/icons-material/AirOutlined";
import RotateRightOutlinedIcon from "@mui/icons-material/RotateRightOutlined";
import FlipOutlinedIcon from "@mui/icons-material/FlipOutlined";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import SportsVolleyballOutlinedIcon from "@mui/icons-material/SportsVolleyballOutlined";
import VibrationOutlinedIcon from "@mui/icons-material/VibrationOutlined";
import WavesOutlinedIcon from "@mui/icons-material/WavesOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SyncOutlinedIcon from "@mui/icons-material/SyncOutlined";
import BlurOnOutlinedIcon from "@mui/icons-material/BlurOnOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

/**
 * Icon key → MUI component for the Animation panel's preset cards. UI-only:
 * these keys live in animationPresets.ts and are never stored in a design.
 */
export const ANIM_ICONS: Record<string, ElementType> = {
  none: BlockOutlinedIcon,
  fade: OpacityOutlinedIcon,
  fadeOut: VisibilityOffOutlinedIcon,
  zoomIn: ZoomInMapOutlinedIcon,
  zoomOut: ZoomOutMapOutlinedIcon,
  up: ArrowUpwardOutlinedIcon,
  down: ArrowDownwardOutlinedIcon,
  left: ArrowBackOutlinedIcon,
  right: ArrowForwardOutlinedIcon,
  pop: AutoAwesomeOutlinedIcon,
  float: AirOutlinedIcon,
  rotate: RotateRightOutlinedIcon,
  flipY: FlipOutlinedIcon,
  flipX: SwapVertOutlinedIcon,
  bounce: SportsVolleyballOutlinedIcon,
  swing: WavesOutlinedIcon,
  elastic: VibrationOutlinedIcon,
  heart: FavoriteBorderOutlinedIcon,
  spin: SyncOutlinedIcon,
  blur: BlurOnOutlinedIcon,
};
