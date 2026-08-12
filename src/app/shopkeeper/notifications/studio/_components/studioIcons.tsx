import type { ElementType } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import TextFieldsOutlinedIcon from "@mui/icons-material/TextFieldsOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import SmartButtonOutlinedIcon from "@mui/icons-material/SmartButtonOutlined";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import HexagonOutlinedIcon from "@mui/icons-material/HexagonOutlined";
import WallpaperOutlinedIcon from "@mui/icons-material/WallpaperOutlined";
import MovieFilterOutlinedIcon from "@mui/icons-material/MovieFilterOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import HorizontalRuleOutlinedIcon from "@mui/icons-material/HorizontalRuleOutlined";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import TitleOutlinedIcon from "@mui/icons-material/TitleOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import MoneyOffOutlinedIcon from "@mui/icons-material/MoneyOffOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";

// Shared string-key → MUI icon map for every studio tool/element/layer chip.
export const STUDIO_ICONS: Record<string, ElementType> = {
  add: AddOutlinedIcon,
  templates: GridViewOutlinedIcon,
  elements: WidgetsOutlinedIcon,
  text: TextFieldsOutlinedIcon,
  images: ImageOutlinedIcon,
  buttons: SmartButtonOutlinedIcon,
  icons: EmojiEmotionsOutlinedIcon,
  shapes: HexagonOutlinedIcon,
  background: WallpaperOutlinedIcon,
  animation: MovieFilterOutlinedIcon,
  layers: LayersOutlinedIcon,
  divider: HorizontalRuleOutlinedIcon,
  productImage: PhotoOutlinedIcon,
  productName: TitleOutlinedIcon,
  price: AttachMoneyOutlinedIcon,
  oldPrice: MoneyOffOutlinedIcon,
  discount: LocalOfferOutlinedIcon,
  stock: Inventory2OutlinedIcon,
  badge: SellOutlinedIcon,
  timer: TimerOutlinedIcon,
  rating: StarBorderOutlinedIcon,
};
