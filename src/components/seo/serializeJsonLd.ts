// Built from code points: written as escapes in a regex literal they are easy to corrupt into
// real line breaks, which end the literal.
const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

/**
 * JSON for a <script type="application/ld+json"> tag. The browser ends the script at the
 * first "</script", so "<" is escaped (and the two line separators that older engines treat
 * as line breaks inside a string): no value in the data can break out of the tag.
 */
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .split(LINE_SEPARATOR)
    .join("\\u2028")
    .split(PARAGRAPH_SEPARATOR)
    .join("\\u2029");
}
