export const metadata = {
  title: "API Documentation",
  description:
    "API discovery and integration references for this portfolio site.",
};

const API_BASE = "https://macos.maenababneh.dev";

export default function ApiDocsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold">API Documentation</h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        This site publishes machine-readable discovery metadata to support
        crawlers, AI agents, and client integrations.
      </p>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-medium">Discovery Endpoints</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            API Catalog: <code>{API_BASE}/.well-known/api-catalog</code>
          </li>
          <li>
            OpenAPI Spec: <code>{API_BASE}/openapi.json</code>
          </li>
          <li>
            Health: <code>{API_BASE}/api/health</code>
          </li>
        </ul>
      </section>
    </main>
  );
}
