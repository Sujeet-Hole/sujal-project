// Shared layout for the Privacy Policy and Terms & Conditions pages.

import { Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { CONTACT } from "@/data/site";
import { LEGAL_UPDATED, type LegalSection } from "@/data/legal";

interface LegalPageProps {
  title: string;
  intro: string;
  sections: LegalSection[];
  current: "privacy" | "terms";
}

export function LegalPage({ title, intro, sections, current }: LegalPageProps) {
  return (
    <>
      <PageHero
        title={title}
        subtitle={`Last updated: ${LEGAL_UPDATED}`}
        crumbs={[{ label: "Home", to: "/" }, { label: title }]}
      />

      <section className="container-site section-y">
        <article className="mx-auto max-w-3xl">
          <p className="text-sm leading-relaxed text-navy/80 sm:text-base">{intro}</p>

          {sections.map((section, i) => (
            <div key={section.heading} className="mt-8">
              <h2 className="text-lg font-extrabold text-navy sm:text-xl">
                {i + 1}. {section.heading}
              </h2>
              {section.paragraphs?.map((text) => (
                <p key={text} className="mt-2 text-sm leading-relaxed text-navy/80 sm:text-base">
                  {text}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-navy/80 marker:text-brand sm:text-base">
                  {section.bullets.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              )}
              {section.after && (
                <p className="mt-2 text-sm leading-relaxed text-navy/80 sm:text-base">
                  {section.after}
                </p>
              )}
            </div>
          ))}

          <div className="mt-10 rounded-3xl bg-tint p-5 sm:p-6">
            <h2 className="text-lg font-extrabold text-navy sm:text-xl">Contact us</h2>
            <p className="mt-2 text-sm text-navy/80 sm:text-base">
              Questions about this page or your information? Reach us here:
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-navy/85 sm:text-base">
              <li className="font-semibold">Ashadeep Computer Institute</li>
              <li>{CONTACT.address}</li>
              <li>
                Phone:{" "}
                <a href={CONTACT.phoneHref} className="text-brand hover:underline">
                  {CONTACT.phoneDisplay}
                </a>{" "}
                |{" "}
                <a href={CONTACT.landlineHref} className="text-brand hover:underline">
                  {CONTACT.landlineDisplay}
                </a>
              </li>
              <li>
                Email:{" "}
                <a href={CONTACT.emailHref} className="break-all text-brand hover:underline">
                  {CONTACT.email}
                </a>
              </li>
              <li>Timings: {CONTACT.hours}</li>
            </ul>
          </div>

          <p className="mt-6 text-sm text-navy/70">
            {current === "privacy" ? (
              <>
                Also read our{" "}
                <Link to="/terms" className="font-semibold text-brand hover:underline">
                  Terms &amp; Conditions
                </Link>
                .
              </>
            ) : (
              <>
                Also read our{" "}
                <Link to="/privacy-policy" className="font-semibold text-brand hover:underline">
                  Privacy Policy
                </Link>
                .
              </>
            )}
          </p>
        </article>
      </section>
    </>
  );
}
