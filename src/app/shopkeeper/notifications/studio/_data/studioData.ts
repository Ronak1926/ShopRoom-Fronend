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

// Timeline tracks and ruler marks are now derived from the design's real
// animated elements — see TimelinePanel.tsx.
