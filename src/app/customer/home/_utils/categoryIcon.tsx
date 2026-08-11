import type { ReactElement } from "react";
import CheckroomOutlinedIcon from "@mui/icons-material/CheckroomOutlined";
import WeekendOutlinedIcon from "@mui/icons-material/WeekendOutlined";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";

const ICON_SX = { fontSize: 16 } as const;

export function getCategoryIcon(category: string): ReactElement {
  const c = category.toLowerCase();
  if (c === "all" || c === "all categories") return <AppsOutlinedIcon sx={ICON_SX} />;
  if (c.includes("cloth") || c.includes("fashion") || c.includes("apparel"))
    return <CheckroomOutlinedIcon sx={ICON_SX} />;
  if (c.includes("home") || c.includes("decor") || c.includes("furniture"))
    return <WeekendOutlinedIcon sx={ICON_SX} />;
  if (c.includes("food") || c.includes("grocery") || c.includes("grocer"))
    return <ShoppingBasketOutlinedIcon sx={ICON_SX} />;
  if (c.includes("beauty") || c.includes("wellness") || c.includes("spa"))
    return <SpaOutlinedIcon sx={ICON_SX} />;
  if (c.includes("electronic") || c.includes("gadget") || c.includes("tech"))
    return <DevicesOutlinedIcon sx={ICON_SX} />;
  return <StorefrontOutlinedIcon sx={ICON_SX} />;
}
