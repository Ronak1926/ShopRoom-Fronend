import { z } from "zod";

// Zod's default fast path compiles parsers with `new Function`, which a strict
// Content-Security-Policy (no 'unsafe-eval') blocks and reports as a violation.
// Must run before any schema is constructed, so every file that builds a schema
// imports this module first.
z.config({ jitless: true });
