export type RoomCard = {
  roomId: string;
  shopName: string;
  category: string;
  logoUrl: string | null;
  coverUrl: string | null;
  membersCount: number;
  inviteCode: string;
  city: string;
  distanceKm: number | null;
  likes: number;
  activeNow: boolean;
  isJoined: boolean;
};

export type TrendingItem = {
  roomId: string;
  shopName: string;
  category: string;
  logoUrl: string | null;
  membersCount: number;
};

export type DiscoverResponse = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  rooms: RoomCard[];
  trending: TrendingItem[];
  categories: string[];
};

export type ViewMode = "grid" | "list";
export type SortOption = "nearest" | "popular";

export function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}
