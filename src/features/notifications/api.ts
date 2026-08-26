/**
 * features/notifications/api.ts — Typed client for the notification API.
 * Every call is shopkeeper-authenticated (token from the shopkeeper cookie).
 */

import { apiClient } from "@/utils/apiClient";
import { getCookie } from "@/utils/cookieUtils";
import type { DesignRecord, NotificationDesign } from "./types";

function authConfig() {
  return { headers: { Authorization: `Bearer ${getCookie("shopkeeper_token")}` } };
}

interface Envelope<T> {
  data: T;
  message?: string;
}

export interface TemplateSummary {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  /**
   * The full design. Carried in the listing on purpose — thumbnailUrl is never
   * populated, so cards render live through the same renderer the canvas uses
   * rather than a stored screenshot that could drift.
   */
  designJson: NotificationDesign;
  thumbnailUrl: string | null;
  requiredPlan: string | null;
  schemaVersion: number;
}

export interface DesignSummary {
  id: string;
  name: string;
  status: string;
  categoryId: string | null;
  version: number;
  isArchived: boolean;
  updatedAt: string;
  /** Included so a saved design renders a live card, same as a template. */
  designJson: NotificationDesign;
}

export interface DesignPage {
  items: DesignSummary[];
  total: number;
}

export interface ListDesignsParams {
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
  archived?: boolean;
  page?: number;
  limit?: number;
}

// ── Designs ──────────────────────────────────────────────────────────────────

export async function listDesigns(params: ListDesignsParams = {}): Promise<DesignPage> {
  const { data } = await apiClient.get<Envelope<DesignPage>>("/api/notifications/designs", {
    ...authConfig(),
    params: {
      ...params,
      ...(params.archived === undefined ? {} : { archived: String(params.archived) }),
    },
  });
  return data.data;
}

export async function getDesign(id: string): Promise<DesignRecord> {
  const { data } = await apiClient.get<Envelope<DesignRecord>>(
    `/api/notifications/designs/${id}`,
    authConfig(),
  );
  return data.data;
}

export async function createBlankDesign(name: string, category: string): Promise<DesignRecord> {
  const { data } = await apiClient.post<Envelope<DesignRecord>>(
    "/api/notifications/designs",
    { name, category },
    authConfig(),
  );
  return data.data;
}

export async function autosaveDesign(
  id: string,
  design: NotificationDesign,
): Promise<{ id: string; version: number; updatedAt: string; status: string }> {
  const { data } = await apiClient.patch<Envelope<{ id: string; version: number; updatedAt: string; status: string }>>(
    `/api/notifications/designs/${id}`,
    { design },
    authConfig(),
  );
  return data.data;
}

/**
 * Removes a design from the shopkeeper's lists.
 *
 * Archives rather than hard-deletes: the Studio autosaves continuously, so a
 * draft can hold real work that was never explicitly saved. The row stays
 * behind `isArchived` and POST /designs/:id/restore brings it back.
 */
export async function archiveDesign(id: string): Promise<void> {
  await apiClient.post(`/api/notifications/designs/${id}/archive`, {}, authConfig());
}

export async function saveVersion(id: string): Promise<{ id: string; version: number }> {
  const { data } = await apiClient.post<Envelope<{ id: string; version: number }>>(
    `/api/notifications/designs/${id}/versions`,
    {},
    authConfig(),
  );
  return data.data;
}

// ── Templates ────────────────────────────────────────────────────────────────

export interface TemplatePage {
  items: TemplateSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListTemplatesParams {
  categoryId?: string;
  q?: string;
  sort?: "popular" | "newest" | "name";
  page?: number;
  limit?: number;
}

export async function listTemplates(params: ListTemplatesParams = {}): Promise<TemplatePage> {
  const { data } = await apiClient.get<Envelope<TemplatePage>>("/api/notifications/templates", {
    ...authConfig(),
    params,
  });
  return data.data;
}

export interface NotificationCategory {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
}

export async function listCategories(): Promise<NotificationCategory[]> {
  const { data } = await apiClient.get<Envelope<NotificationCategory[]>>(
    "/api/notifications/categories",
    authConfig(),
  );
  return data.data;
}

export async function cloneTemplate(templateId: string): Promise<DesignRecord> {
  const { data } = await apiClient.post<Envelope<DesignRecord>>(
    `/api/notifications/templates/${templateId}/use`,
    {},
    authConfig(),
  );
  return data.data;
}

// ── Image assets ─────────────────────────────────────────────────────────────

export interface AssetSummary {
  id: string;
  secureUrl: string;
  width: number | null;
  height: number | null;
  createdAt: string;
}

export async function uploadAsset(
  imageDataUri: string,
  meta?: { width?: number; height?: number; sizeBytes?: number },
  onProgress?: (percent: number) => void,
): Promise<AssetSummary> {
  const { data } = await apiClient.post<Envelope<AssetSummary>>(
    "/api/notifications/assets",
    { image: imageDataUri, ...meta },
    {
      ...authConfig(),
      onUploadProgress: onProgress
        ? (e) => onProgress(e.total ? Math.round((e.loaded / e.total) * 100) : 0)
        : undefined,
    },
  );
  return data.data;
}

export async function listAssets(): Promise<AssetSummary[]> {
  const { data } = await apiClient.get<Envelope<AssetSummary[]>>(
    "/api/notifications/assets",
    authConfig(),
  );
  return data.data;
}

// ── Stock images ─────────────────────────────────────────────────────────────

export interface StockImageResult {
  id: string;
  provider: "PEXELS" | "UNSPLASH";
  thumbUrl: string;
  fullUrl: string;
  width: number;
  height: number;
  photographer: string;
  photographerUrl?: string;
  sourceUrl?: string;
}

export interface StockImageSearchResult {
  items: StockImageResult[];
  page: number;
  hasMore: boolean;
  /** Providers with an API key set — empty means stock search isn't set up yet. */
  configured: ("PEXELS" | "UNSPLASH")[];
}

export async function searchStockImages(params: {
  query: string;
  category?: string;
  provider?: "PEXELS" | "UNSPLASH";
  page?: number;
}): Promise<StockImageSearchResult> {
  const { data } = await apiClient.get<Envelope<StockImageSearchResult>>(
    "/api/notifications/stock-images",
    { ...authConfig(), params },
  );
  return data.data;
}
