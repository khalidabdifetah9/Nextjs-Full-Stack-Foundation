interface Section {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

const COMPANY = "HueEstate";

export const sections: Section[] = [
  {
    id: "overview",
    title: "Overview",
    paragraphs: [
      `This Privacy Policy explains how ${COMPANY} collects, uses, and protects your personal information when you visit our website, create an account, or use our design tools.`,
      "By using our services, you agree to the practices described here. If you do not agree, please stop using the site.",
    ],
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    paragraphs: ["We collect only what we need to provide and improve our services."],
    bullets: [
      "Account details: your full name, email address, phone number, and password (stored in encrypted form).",
      "Sign in data: if you use Google to sign in, we receive your name, email, and profile picture from Google.",
      "Usage data: pages you visit, features you use, and your saved properties and room palettes.",
      "Device data: browser type, device type, IP address, and approximate location.",
      "Messages: anything you send us through the contact form.",
    ],
  },
  {
    id: "how-we-use-it",
    title: "How we use your information",
    bullets: [
      "To create and manage your account.",
      "To provide design tools, saved properties, and personalized recommendations.",
      "To respond to your questions and support requests.",
      "To send important service updates, such as security or policy notices.",
      "To improve performance, fix problems, and understand how the site is used.",
      "To detect and prevent fraud or misuse.",
    ],
  },
  {
    id: "sharing",
    title: "How we share information",
    paragraphs: [
      "We do not sell your personal information. We share it only in these limited cases:",
    ],
    bullets: [
      "Service providers who help us run the site, such as hosting, analytics, and email delivery. They may only use your data to work for us.",
      "Legal reasons, when required by law or to protect our rights, users, or safety.",
      "Business changes, such as a merger or acquisition, in which case we will notify you first.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    paragraphs: [
      "We use cookies and similar technologies to keep you signed in, remember your preferences, and measure how the site performs.",
      "You can block or delete cookies in your browser settings. Some features, such as staying signed in, may not work without them.",
    ],
  },
  {
    id: "retention",
    title: "Data retention",
    paragraphs: [
      "We keep your information for as long as your account is active or as needed to provide our services. When you delete your account, we remove or anonymize your personal data within a reasonable period, unless the law requires us to keep it longer.",
    ],
  },
  {
    id: "security",
    title: "Security",
    paragraphs: [
      "We use industry standard safeguards, including encryption in transit and access controls, to protect your data. No method of transmission or storage is completely secure, so we cannot guarantee absolute security. Please use a strong, unique password for your account.",
    ],
  },
  {
    id: "your-rights",
    title: "Your rights",
    paragraphs: ["Depending on where you live, you may have the right to:"],
    bullets: [
      "Access the personal data we hold about you.",
      "Correct information that is inaccurate or incomplete.",
      "Delete your data or close your account.",
      "Object to or limit certain uses of your data.",
      "Receive a copy of your data in a portable format.",
    ],
  },
  {
    id: "children",
    title: "Children's privacy",
    paragraphs: [
      "Our services are not directed to children under 13, and we do not knowingly collect their information. If you believe a child has given us personal data, contact us and we will delete it.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paragraphs: [
      "We may update this policy from time to time. When we do, we will change the date at the top of this page, and for significant changes we will notify you by email or on the site.",
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    paragraphs: [
      "If you have questions about this policy or want to use any of your rights, reach out and we will respond as soon as we can.",
    ],
  },
];
