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
import VerticalAlignBottomOutlinedIcon from "@mui/icons-material/VerticalAlignBottomOutlined";
import RotateLeftOutlinedIcon from "@mui/icons-material/RotateLeftOutlined";
import FormatItalicOutlinedIcon from "@mui/icons-material/FormatItalicOutlined";
import UnfoldMoreOutlinedIcon from "@mui/icons-material/UnfoldMoreOutlined";
import UnfoldLessOutlinedIcon from "@mui/icons-material/UnfoldLessOutlined";
import CompareArrowsOutlinedIcon from "@mui/icons-material/CompareArrowsOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import KeyboardDoubleArrowUpOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowUpOutlined";
import ViewInArOutlinedIcon from "@mui/icons-material/ViewInArOutlined";
import FlashOnOutlinedIcon from "@mui/icons-material/FlashOnOutlined";
import GestureOutlinedIcon from "@mui/icons-material/GestureOutlined";
import SwipeOutlinedIcon from "@mui/icons-material/SwipeOutlined";
import TransformOutlinedIcon from "@mui/icons-material/TransformOutlined";
import ThreeSixtyOutlinedIcon from "@mui/icons-material/ThreeSixtyOutlined";

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
  spinY: ThreeSixtyOutlinedIcon,
  blur: BlurOnOutlinedIcon,
  drop: VerticalAlignBottomOutlinedIcon,
  roll: RotateLeftOutlinedIcon,
  skew: FormatItalicOutlinedIcon,
  unfold: UnfoldMoreOutlinedIcon,
  fold: UnfoldLessOutlinedIcon,
  split: CompareArrowsOutlinedIcon,
  tilt: ViewInArOutlinedIcon,
  back: KeyboardDoubleArrowUpOutlinedIcon,
  circle: CircleOutlinedIcon,
  flash: FlashOnOutlinedIcon,
  jello: GestureOutlinedIcon,
  wobble: SwipeOutlinedIcon,
  rubber: TransformOutlinedIcon,
};
