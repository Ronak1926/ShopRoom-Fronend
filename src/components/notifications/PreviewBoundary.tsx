"use client";

import { Component, type ReactNode } from "react";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";

interface PreviewBoundaryProps {
  children: ReactNode;
  /** When this changes (the design was edited), a failed preview tries again. */
  resetKey: unknown;
}

/** The neutral tile shown in place of a design that cannot be drawn. */
export function PreviewUnavailable() {
  return (
    <span
      role="img"
      aria-label="Preview unavailable"
      className="absolute inset-0 flex items-center justify-center bg-(--color-bg-surface-hover) text-(--color-text-hint)"
    >
      <BrokenImageOutlinedIcon sx={{ fontSize: 22 }} />
    </span>
  );
}

/**
 * Keeps one malformed design from taking down the page that lists it: the card shows a
 * neutral tile instead, and everything around it carries on.
 */
export default class PreviewBoundary extends Component<PreviewBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidUpdate(previous: PreviewBoundaryProps) {
    if (this.state.failed && previous.resetKey !== this.props.resetKey) this.setState({ failed: false });
  }

  render() {
    return this.state.failed ? <PreviewUnavailable /> : this.props.children;
  }
}
