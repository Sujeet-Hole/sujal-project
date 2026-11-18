// Privacy Policy page. The wording lives in src/data/legal.ts.

import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { PRIVACY_INTRO, PRIVACY_SECTIONS } from "@/data/legal";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Ashadeep Computer Institute" },
      {
        name: "description",
        content:
          "How Ashadeep Computer Institute in Bhandup West, Mumbai collects, uses and protects your personal information.",
      },
      { property: "og:title", content: "Privacy Policy — Ashadeep Computer Institute" },
      {
        property: "og:description",
        content:
          "How Ashadeep Computer Institute in Bhandup West, Mumbai collects, uses and protects your personal information.",
      },
      { property: "og:url", content: "/privacy-policy" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/privacy-policy" }],
  }),
  component: Page,
});

function Page() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={PRIVACY_INTRO}
      sections={PRIVACY_SECTIONS}
      current="privacy"
    />
  );
}
