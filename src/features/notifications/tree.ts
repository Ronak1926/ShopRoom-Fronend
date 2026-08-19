/**
 * features/notifications/tree.ts — Immutable helpers for the composition tree.
 * Used by Layers, Properties and the canvas for selection, geometry, ordering
 * and duplication. Every function returns new nodes; nothing is mutated.
 */

import type { CompositionNode } from "./types";

export interface FlatNode {
  node: CompositionNode;
  depth: number;
  /** True when an ancestor lays this node out with flex (so it can't be dragged). */
  inFlow: boolean;
}

/** Depth-first flatten for the Layers panel (top-of-canvas first). */
export function flattenNodes(
  nodes: CompositionNode[],
  depth = 0,
  inFlow = false,
): FlatNode[] {
  const out: FlatNode[] = [];
  for (const node of nodes) {
    out.push({ node, depth, inFlow });
    if (node.children?.length) {
      out.push(...flattenNodes(node.children, depth + 1, !!node.layout?.direction));
    }
  }
  return out;
}

export function findNode(nodes: CompositionNode[], id: string): CompositionNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children?.length) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

export interface NodePath {
  node: CompositionNode;
  /** Ancestors, outermost first. */
  parents: CompositionNode[];
}

export function findPath(
  nodes: CompositionNode[],
  id: string,
  parents: CompositionNode[] = [],
): NodePath | null {
  for (const node of nodes) {
    if (node.id === id) return { node, parents };
    if (node.children?.length) {
      const found = findPath(node.children, id, [...parents, node]);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Canvas-space offset contributed by a node's ancestors. Returns null when any
 * ancestor uses flex layout — such a node is positioned by its parent, so it
 * cannot be dragged directly (edit it through Properties instead).
 */
export function absoluteOffset(parents: CompositionNode[]): { x: number; y: number } | null {
  let x = 0;
  let y = 0;
  for (const p of parents) {
    if (p.layout?.direction) return null;
    x += p.frame.x;
    y += p.frame.y;
  }
  return { x, y };
}

/** Returns a new tree with the matching node replaced by patch(node). */
export function updateNodeById(
  nodes: CompositionNode[],
  id: string,
  patch: (n: CompositionNode) => CompositionNode,
): CompositionNode[] {
  return nodes.map((node) => {
    if (node.id === id) return patch(node);
    if (node.children?.length) {
      return { ...node, children: updateNodeById(node.children, id, patch) };
    }
    return node;
  });
}

/** Returns a new tree with the matching node (at any depth) removed. */
export function removeNodeById(nodes: CompositionNode[], id: string): CompositionNode[] {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) =>
      node.children?.length ? { ...node, children: removeNodeById(node.children, id) } : node,
    );
}

let dupCounter = 0;
/** Deep copy with fresh ids (so the duplicate is independently selectable). */
export function cloneWithNewIds(node: CompositionNode): CompositionNode {
  dupCounter += 1;
  const suffix = `c${Date.now().toString(36).slice(-4)}${dupCounter}`;
  const walk = (n: CompositionNode): CompositionNode => ({
    ...n,
    id: `${n.id}-${suffix}`,
    children: n.children?.map(walk),
  });
  return walk(node);
}

/** Inserts `newNode` directly after `id` within the same sibling list. */
export function insertAfter(
  nodes: CompositionNode[],
  id: string,
  newNode: CompositionNode,
): CompositionNode[] {
  const idx = nodes.findIndex((n) => n.id === id);
  if (idx >= 0) {
    const next = [...nodes];
    next.splice(idx + 1, 0, newNode);
    return next;
  }
  return nodes.map((n) =>
    n.children?.length ? { ...n, children: insertAfter(n.children, id, newNode) } : n,
  );
}

export type LayerMove = "forward" | "front" | "backward" | "back";

/**
 * Re-stacks a node relative to its siblings by adjusting zIndex. Keeps the
 * design's deliberate z-bands intact instead of renumbering everything.
 */
export function reorderNode(
  nodes: CompositionNode[],
  id: string,
  move: LayerMove,
): CompositionNode[] {
  const path = findPath(nodes, id);
  if (!path) return nodes;
  const parent = path.parents[path.parents.length - 1];
  const siblings = parent ? (parent.children ?? []) : nodes;
  const own = path.node.frame.zIndex ?? 0;
  const zs = siblings.map((s) => s.frame.zIndex ?? 0);

  let target = own;
  if (move === "front") target = Math.max(...zs) + 1;
  else if (move === "back") target = Math.min(...zs) - 1;
  else if (move === "forward") {
    const above = zs.filter((z) => z > own).sort((a, b) => a - b)[0];
    target = above === undefined ? own : above + 1;
  } else {
    const below = zs.filter((z) => z < own).sort((a, b) => b - a)[0];
    target = below === undefined ? own : below - 1;
  }
  if (target === own) return nodes;
  return updateNodeById(nodes, id, (n) => ({ ...n, frame: { ...n.frame, zIndex: target } }));
}

/** True when the node is a direct child of the design's top-level elements. */
export function isTopLevel(elements: CompositionNode[], id: string): boolean {
  return elements.some((n) => n.id === id);
}

/** Display label for Layers/Properties. */
export function nodeLabel(node: CompositionNode): string {
  if (node.name) return node.name;
  const pretty = node.type.charAt(0) + node.type.slice(1).toLowerCase().replace(/_/g, " ");
  const text = node.content?.text ?? node.content?.label;
  if (!text) return pretty;
  // Badges/Labels stay unnamed at creation so this stays in sync with edits —
  // "Badge (30% OFF)" / "Label (FREE SHIPPING)" rather than going stale.
  return node.type === "BADGE" || node.type === "LABEL" ? `${pretty} (${text})` : `${pretty} · ${text}`;
}
