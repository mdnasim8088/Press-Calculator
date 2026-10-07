import {
  Bookmark,
  Calculator,
  FileText,
  Flag,
  FolderOpen,
  History,
  House,
  LayoutGrid,
  Layers,
  type LucideIcon,
  RotateCw,
  Scissors,
  Settings,
  Tag,
  Trash2,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { HelpKey } from "@/i18n/help";

export type ToolStatus = "ready" | "soon";
export type ToolGroup = "calculate" | "business" | "data";

export interface Tool {
  href: string;
  /** English title (always shown). */
  title: string;
  /** Small Bangla/Arabic explanation under the title. */
  help: HelpKey;
  icon: LucideIcon;
  status: ToolStatus;
  group: ToolGroup;
}

/** Shown on its own at the top of the home page. */
export const FEATURED_TOOL: Tool = {
  href: "/calculator",
  title: "Calculator",
  help: "tool.calculator",
  icon: Calculator,
  status: "ready",
  group: "calculate",
};

export const TOOLS: Tool[] = [
  FEATURED_TOOL,
  { href: "/sheet", title: "Sheet", help: "tool.sheet", icon: Scissors, status: "ready", group: "calculate" },
  { href: "/quantity", title: "Quantity", help: "tool.quantity", icon: Layers, status: "ready", group: "calculate" },
  { href: "/banner", title: "Banner", help: "tool.banner", icon: Flag, status: "ready", group: "calculate" },
  { href: "/packing", title: "Sticker Packing", help: "tool.packing", icon: LayoutGrid, status: "soon", group: "calculate" },
  { href: "/best-layout", title: "Best Layout", help: "tool.bestLayout", icon: RotateCw, status: "soon", group: "calculate" },
  { href: "/waste", title: "Waste", help: "tool.waste", icon: Trash2, status: "soon", group: "calculate" },
  { href: "/cost", title: "Cost", help: "tool.cost", icon: Wallet, status: "soon", group: "business" },
  { href: "/selling-price", title: "Selling Price", help: "tool.sellingPrice", icon: Tag, status: "soon", group: "business" },
  { href: "/profit", title: "Profit", help: "tool.profit", icon: TrendingUp, status: "soon", group: "business" },
  { href: "/quote", title: "Quote", help: "tool.quote", icon: FileText, status: "soon", group: "business" },
  { href: "/presets", title: "Presets", help: "tool.presets", icon: Bookmark, status: "soon", group: "data" },
  { href: "/history", title: "History", help: "tool.history", icon: History, status: "soon", group: "data" },
  { href: "/projects", title: "Projects", help: "tool.projects", icon: FolderOpen, status: "soon", group: "data" },
  { href: "/settings", title: "Settings", help: "tool.settings", icon: Settings, status: "ready", group: "data" },
];

export const GROUPS: { group: ToolGroup; title: string; help: HelpKey }[] = [
  { group: "calculate", title: "Calculators", help: "group.calculate" },
  { group: "business", title: "Business", help: "group.business" },
  { group: "data", title: "Data & Settings", help: "group.data" },
];

export function findTool(href: string): Tool | undefined {
  return TOOLS.find((t) => t.href === href);
}

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** Desktop left icon rail. */
export const RAIL_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/calculator", label: "Calculator", icon: Calculator },
  { href: "/sheet", label: "Sheet", icon: Scissors },
  { href: "/quantity", label: "Quantity", icon: Layers },
  { href: "/banner", label: "Banner", icon: Flag },
  { href: "/presets", label: "Presets", icon: Bookmark },
  { href: "/history", label: "History", icon: History },
  { href: "/projects", label: "Projects", icon: FolderOpen },
];

/** Mobile bottom bar (max 5). */
export const BOTTOM_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/calculator", label: "Calc", icon: Calculator },
  { href: "/sheet", label: "Sheet", icon: Scissors },
  { href: "/banner", label: "Banner", icon: Flag },
  { href: "/settings", label: "Settings", icon: Settings },
];

/** Category tabs above calculator pages. */
export const CATEGORY_TABS: NavItem[] = [
  { href: "/calculator", label: "Calc", icon: Calculator },
  { href: "/sheet", label: "Sheet", icon: Scissors },
  { href: "/quantity", label: "Quantity", icon: Layers },
  { href: "/banner", label: "Banner", icon: Flag },
  { href: "/packing", label: "Packing", icon: LayoutGrid },
  { href: "/cost", label: "Cost", icon: Wallet },
  { href: "/profit", label: "Profit", icon: TrendingUp },
];
