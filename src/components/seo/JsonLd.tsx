import { serializeJsonLd } from "./serializeJsonLd";

/** Renders schema.org structured data (see serializeJsonLd for why the output is safe inside a script tag). */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
