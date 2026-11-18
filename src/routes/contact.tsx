// Contact page: map, contact methods and a short FAQ.

import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { FaqSection } from "@/components/Faq";
import { CONTACT } from "@/data/site";
import { CONTACT_FAQS } from "@/data/faqs";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: { course?: string }) => ({
    course: search.course,
  }),
  head: () => ({
    meta: [
      { title: "Contact Us — Ashadeep Computer Institute" },
      {
        name: "description",
        content:
          "Visit Ashadeep Computer Institute in Bhandup West, Mumbai. Call +91 8452003841 or WhatsApp us for any of our computer courses.",
      },
      { property: "og:title", content: "Contact Us — Ashadeep Computer Institute" },
      {
        property: "og:description",
        content:
          "Visit us in Bhandup West, Mumbai — Mon to Sat, 9:00 AM to 8:00 PM. Call or WhatsApp us today.",
      },
      { property: "og:url", content: "/contact" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const INFO: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  wide?: boolean;
}[] = [
  {
    icon: MapPin,
    label: "Visit Us",
    value: CONTACT.address,
    href: CONTACT.mapLink,
    external: true,
    wide: true,
  },
  {
    icon: Phone,
    label: "Call Us",
    value: CONTACT.phoneDisplay,
    href: CONTACT.phoneHref,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with us",
    href: CONTACT.whatsapp,
    external: true,
  },
  { icon: Mail, label: "Email Us", value: CONTACT.email }, // 👈 Yahan se href hata diya hai
  { icon: Clock, label: "Our Timings", value: CONTACT.hours },
];

function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Call or message us, or visit the institute in Bhandup West, Mumbai."
        crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      />

      <section className="container-site section-y grid gap-8 lg:grid-cols-2 lg:gap-10">
        {/* ---- Map + contact info (below the buttons on phones, beside them on desktop) ---- */}
        <div className="min-w-0">
          <Reveal direction="left">
            <iframe
              title="Map showing the location of Ashadeep Computer Institute in Bhandup West, Mumbai"
              src={CONTACT.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-64 w-full rounded-3xl border-0 shadow-lg shadow-navy/10 sm:h-80"
              allowFullScreen
            />
            <a
              href={CONTACT.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-4 w-full sm:w-auto"
            >
              <Navigation className="h-4 w-4" aria-hidden />
              Open in Google Maps
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </Reveal>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {INFO.map((item, i) => (
              <Reveal
                key={item.label}
                delay={i * 60}
                direction={i % 2 === 0 ? "up" : "right"}
                className={item.wide ? "sm:col-span-2" : ""}
              >
                <div className="flex h-full items-start gap-3 rounded-2xl bg-tint p-4 sm:p-5">
                  <span className="icon-circle bg-brand text-primary-foreground">
                    <item.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-navy">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="mt-0.5 block break-words text-xs text-navy/75 underline-offset-2 hover:text-brand hover:underline sm:text-sm"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-0.5 break-words text-xs text-navy/75 sm:text-sm">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ---- Direct Call / WhatsApp Box ---- */}
        <Reveal direction="right" delay={100} className="min-w-0 max-lg:order-first">
          <div className="rounded-3xl border border-border bg-white p-5 shadow-xl shadow-navy/10 sm:p-8">
            <h2 className="text-xl font-bold text-navy sm:text-2xl">Talk to us directly</h2>
            <p className="mt-2 text-sm text-navy/75">
              Call or WhatsApp us, or visit the institute. We will guide you to the right course.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <a href={CONTACT.phoneHref} className="btn-primary w-full">
                <Phone className="h-4 w-4" aria-hidden />
                Call {CONTACT.phoneDisplay}
              </a>
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                WhatsApp us
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <FaqSection
        id="contact-faq"
        title="Before You Reach Out"
        intro="Quick answers about timings, replies and choosing a course."
        items={CONTACT_FAQS}
      />
    </>
  );
}