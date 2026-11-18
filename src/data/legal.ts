// Text of the Privacy Policy and the Terms & Conditions pages.
// To change the wording, edit the text below: every entry is one section of the page.
// Contact details at the bottom of each page come from CONTACT in src/data/site.ts.

export const LEGAL_UPDATED = "November 2026";

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Paragraph shown after the bullets. */
  after?: string;
}

export const PRIVACY_INTRO =
  'Ashadeep Computer Institute ("we", "us") is a computer training institute in Bhandup West, Mumbai, and an official MKCL partner. This policy explains what personal information we collect through this website and at the institute, how we use it, and the choices you have.';

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: "Information we collect",
    bullets: [
      "Enquiry form: your name, mobile number, the course you are interested in, and the message you type (optional).",
      "When you call, WhatsApp, email or visit us: the details you share, such as your name, phone number and the course you want to know about.",
      "At admission (in person, at the institute): details needed to enrol you, such as contact details, education details and an ID where it is required for course registration or certificates. We collect these at the institute, not through this website.",
      "Basic technical data: when you visit the website, our hosting provider (Cloudflare) processes technical information such as your IP address, browser type and the pages you open, to deliver the website and protect it from attacks and spam.",
    ],
    after: "We do not ask for card details, bank details or passwords on this website.",
  },
  {
    heading: "How we use your information",
    bullets: [
      "To reply to your enquiry and to call or message you about courses, fees, batch timings and admission.",
      "To enrol you in a course, run classes, and register you for exams and certificates (for example with MKCL for MS-CIT).",
      "To keep records of enquiries and admissions.",
      "To keep the website safe and stop spam or misuse, for example with a security check before the enquiry form is sent.",
      "To improve our courses and this website.",
    ],
    after: "We do not sell your personal information and we do not give it to advertisers.",
  },
  {
    heading: "Where your information is stored and who can see it",
    bullets: [
      "Enquiries sent through the website are saved in a Google Sheet and emailed to the institute's Google account. Only authorised institute staff open them.",
      "The website is hosted on Cloudflare, which also provides the security check (Cloudflare Turnstile) used on the enquiry form.",
      "The website loads fonts from Google Fonts and shows our location with Google Maps. Google may receive your IP address and device details when these load.",
      "Links to WhatsApp, Instagram, Facebook and Google Maps take you to those services. They have their own privacy policies.",
    ],
    after: "This website does not use advertising or analytics cookies.",
  },
  {
    heading: "Sharing your information",
    paragraphs: [
      "We share personal information only when it is needed: with MKCL or another certification partner to register you for an exam or certificate, with service providers such as Google and Cloudflare that help us run this website, and when the law, a court or a government authority requires it.",
    ],
  },
  {
    heading: "How long we keep it",
    paragraphs: [
      'We keep enquiry details for as long as we need them to follow up with you and for our admission records. Admission and certificate records may be kept longer because students and exam bodies may need them later. You can ask us to delete your enquiry details at any time (see "Your choices and rights").',
    ],
  },
  {
    heading: "Security",
    paragraphs: [
      "We take reasonable steps to protect your information, such as encrypted connections (HTTPS), a security check on the enquiry form and limited access to our records. No website or storage system is completely secure, so we cannot promise absolute security.",
    ],
  },
  {
    heading: "Your choices and rights",
    paragraphs: [
      "You can ask us to tell you what personal information we hold about you, to correct it, to delete it, or to stop contacting you. Write to us or call us using the contact details below. We will reply within a reasonable time. We handle such requests in line with Indian law, including the Digital Personal Data Protection Act, 2023, as it applies to us.",
    ],
  },
  {
    heading: "Children",
    paragraphs: [
      "Our courses are open to students of many ages. If you are under 18, please ask a parent or guardian to send the enquiry or to contact us for you.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      'We may update this policy from time to time. The "Last updated" date at the top of this page shows the latest version.',
    ],
  },
];

export const TERMS_INTRO =
  "These terms apply when you use the Ashadeep Computer Institute website. By using the website you agree to them. If you do not agree, please do not use the website.";

export const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: "Information on this website",
    paragraphs: [
      "Course names, topics, schedules, fees, timings and other details are given for general information and may change. Please confirm the latest details with the institute before you take admission. Photos and course illustrations are for illustration only.",
    ],
  },
  {
    heading: "Enquiries",
    paragraphs: [
      "Sending the enquiry form does not book a seat or confirm your admission. Admission is confirmed only when the institute accepts it and you complete the admission process at the institute. Please give correct details. We may contact you by phone, WhatsApp or email about your enquiry.",
    ],
  },
  {
    heading: "Admission, fees and refunds",
    paragraphs: [
      "Fees, instalments, batch timings and the refund or transfer rules are explained by the institute at the time of admission and on your admission form or receipt. Please read them before you pay. Pay fees only at the institute or to the account details given by the institute, and always ask for a receipt.",
    ],
  },
  {
    heading: "MKCL courses and certificates",
    paragraphs: [
      "Some courses, such as MS-CIT, are MKCL courses. Exams, results and certificates for these courses follow MKCL's rules. Ashadeep Computer Institute is an official MKCL partner centre that teaches the course and helps students register, but we do not control MKCL's exam dates or results.",
    ],
  },
  {
    heading: "No guarantee of results or jobs",
    paragraphs: [
      "We teach practical skills and try to help every student. What a student achieves depends on their own attendance, practice and effort. We do not guarantee exam results, jobs or income.",
    ],
  },
  {
    heading: "Student conduct at the institute",
    paragraphs: [
      "Students are expected to follow the institute's rules, treat staff and other students with respect, take care of computers and equipment, and not install pirated software or misuse the internet in the lab. The institute may take action under its rules for serious misconduct.",
    ],
  },
  {
    heading: "Using this website",
    paragraphs: [
      "Please do not send false or spam enquiries, try to break into or overload the website, or copy it with automatic tools. We may block access to protect the website and our students.",
    ],
  },
  {
    heading: "Our content",
    paragraphs: [
      "The text, logo, photos, course illustrations and design of this website belong to Ashadeep Computer Institute or are used with permission. Please do not copy or reuse them for commercial purposes without our written permission.",
    ],
  },
  {
    heading: "Reviews and testimonials",
    paragraphs: [
      "Reviews and testimonials on this website are shared by students. Every student's experience is different, and yours may differ.",
    ],
  },
  {
    heading: "Links to other websites",
    paragraphs: [
      "This website links to services such as WhatsApp, Instagram, Facebook and Google Maps. We are not responsible for their content or privacy practices.",
    ],
  },
  {
    heading: "Limit of liability",
    paragraphs: [
      'We try to keep this website correct and available, but it is provided "as is". As far as the law allows, we are not liable for any loss from using the website, from short breaks in service, or from relying on information that has changed. Nothing in these terms limits your rights under Indian consumer law.',
    ],
  },
  {
    heading: "Privacy",
    paragraphs: [
      "Our Privacy Policy explains how we handle your personal information and is part of these terms.",
    ],
  },
  {
    heading: "Changes to these terms",
    paragraphs: [
      'We may update these terms from time to time. The "Last updated" date at the top of this page shows the latest version.',
    ],
  },
  {
    heading: "Governing law",
    paragraphs: [
      "These terms are governed by the laws of India. Courts in Mumbai, Maharashtra have jurisdiction, subject to any rights you have under consumer protection law.",
    ],
  },
];
