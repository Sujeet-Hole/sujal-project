// Terms & Conditions page. The wording lives in src/data/legal.ts.

import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { TERMS_INTRO, TERMS_SECTIONS } from "@/data/legal";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Ashadeep Computer Institute" },
      {
        name: "description",
        content:
          "Terms for using the Ashadeep Computer Institute website, enquiries, admissions, MKCL courses and certificates.",
      },
      { property: "og:title", content: "Terms & Conditions — Ashadeep Computer Institute" },
      {
        property: "og:description",
        content:
          "Terms for using the Ashadeep Computer Institute website, enquiries, admissions, MKCL courses and certificates.",
      },
      { property: "og:url", content: "/terms" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: Page,
});

function Page() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro={TERMS_INTRO}
      sections={TERMS_SECTIONS}
      current="terms"
    />
  );
}
