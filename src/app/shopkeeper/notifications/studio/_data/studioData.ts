// Static content for the Notification Studio customizer UI.
// Icon components are resolved from these string keys inside each component.

export interface ToolItem {
  id: string;
  label: string;
  iconKey: string;
}

// Left vertical icon rail (Add / Templates / Elements / …)
export const TOOLBAR_ITEMS: ToolItem[] = [
  { id: "add", label: "Add", iconKey: "add" },
  { id: "templates", label: "Templates", iconKey: "templates" },
  { id: "elements", label: "Elements", iconKey: "elements" },
  { id: "text", label: "Text", iconKey: "text" },
  { id: "images", label: "Images", iconKey: "images" },
  { id: "buttons", label: "Buttons", iconKey: "buttons" },
  { id: "icons", label: "Icons", iconKey: "icons" },
  { id: "shapes", label: "Shapes", iconKey: "shapes" },
  { id: "background", label: "Background", iconKey: "background" },
  { id: "animation", label: "Animation", iconKey: "animation" },
  { id: "layers", label: "Layers", iconKey: "layers" },
];

// "Add Elements" panel groups
export const BASIC_ELEMENTS: ToolItem[] = [
  { id: "text", label: "Text", iconKey: "text" },
  { id: "image", label: "Image", iconKey: "images" },
  { id: "button", label: "Button", iconKey: "buttons" },
  { id: "icon", label: "Icon", iconKey: "icons" },
  { id: "shape", label: "Shape", iconKey: "shapes" },
  { id: "divider", label: "Divider", iconKey: "divider" },
];

export const PRODUCT_ELEMENTS: ToolItem[] = [
  { id: "product-image", label: "Product Image", iconKey: "productImage" },
  { id: "product-name", label: "Product Name", iconKey: "productName" },
  { id: "price", label: "Price", iconKey: "price" },
  { id: "old-price", label: "Old Price", iconKey: "oldPrice" },
  { id: "discount", label: "Discount", iconKey: "discount" },
  { id: "stock", label: "Stock", iconKey: "stock" },
];

export const GENERAL_ELEMENTS: ToolItem[] = [
  { id: "badge", label: "Badge", iconKey: "badge" },
  { id: "timer", label: "Timer", iconKey: "timer" },
  { id: "rating", label: "Rating", iconKey: "rating" },
];

// Timeline animation tracks (bottom-center). offset/width are 0–100 percent
// across the 0s–4s ruler; tone maps to a token-backed colour in the component.
export interface TimelineTrack {
  id: string;
  label: string;
  tone: "blue" | "purple" | "green" | "yellow" | "pink";
  offset: number;
  width: number;
}

export const TIMELINE_TRACKS: TimelineTrack[] = [
  { id: "t1", label: "Fade In", tone: "blue", offset: 0, width: 22 },
  { id: "t2", label: "Fade In", tone: "blue", offset: 0, width: 40 },
  { id: "t3", label: "Slide Up", tone: "purple", offset: 18, width: 55 },
  { id: "t4", label: "Zoom In", tone: "green", offset: 18, width: 40 },
  { id: "t5", label: "Fade In", tone: "yellow", offset: 30, width: 42 },
  { id: "t6", label: "Pop", tone: "pink", offset: 12, width: 82 },
  { id: "t7", label: "Fade In", tone: "blue", offset: 0, width: 55 },
];

export const RULER_MARKS = ["0s", "1s", "2s", "3s", "4s"];
