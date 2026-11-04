interface Section {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

const JURISDICTION = "Ethiopia";
const COMPANY = "HueEstate";

export const sections: Section[] = [
  {
    id: "acceptance",
    title: "Acceptance of terms",
    paragraphs: [
      `These Terms of Service ("Terms") govern your use of the ${COMPANY} website and services. By accessing the site or creating an account, you agree to be bound by these Terms and our Privacy Policy.`,
      "If you do not agree, please do not use our services.",
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility",
    paragraphs: [
      "You must be at least 18 years old, or the age of legal majority where you live, to create an account. By registering, you confirm that the information you provide is accurate and complete.",
    ],
  },
  {
    id: "accounts",
    title: "Your account",
    bullets: [
      "You are responsible for keeping your password secure and for all activity under your account.",
      "Notify us right away if you suspect unauthorized access.",
      "You may not share your account or create accounts for others without permission.",
      "We may suspend or close accounts that provide false information or break these Terms.",
    ],
  },
  {
    id: "services",
    title: "Our services",
    paragraphs: [
      `${COMPANY} lets you explore residences, test room palettes, and receive AI generated design suggestions. We may add, change, or remove features at any time.`,
    ],
  },
  {
    id: "ai-tools",
    title: "AI design tools",
    paragraphs: [
      "Suggestions and visuals from our design assistant are provided for inspiration and planning. They are generated automatically and may not be accurate, complete, or suitable for your situation.",
      "Colors and finishes on screen can differ from real life. Please verify measurements, materials, and costs with a qualified professional before making decisions or purchases.",
    ],
  },
  {
    id: "properties",
    title: "Property information",
    paragraphs: [
      "Listings, images, sizes, and prices are provided for general information and may change without notice. A listing is not an offer or a binding contract. Any purchase or rental is subject to a separate written agreement.",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    paragraphs: ["When using our services, you agree not to:"],
    bullets: [
      "Break any law or infringe the rights of others.",
      "Attempt to access accounts, systems, or data you are not authorized to use.",
      "Upload malicious code or interfere with the site's operation.",
      "Scrape, copy, or resell our content or tools without written permission.",
      "Submit false, misleading, or abusive content.",
    ],
  },
  {
    id: "your-content",
    title: "Your content",
    paragraphs: [
      "You keep ownership of anything you submit, such as saved palettes and messages. You give us a limited license to store, process, and display that content only as needed to run and improve the services for you.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    paragraphs: [
      `The site, including its design, text, images, logos, and software, belongs to ${COMPANY} or its licensors and is protected by intellectual property laws. You may use it for personal, non commercial purposes. You may not copy, modify, or distribute it without our permission.`,
    ],
  },
  {
    id: "third-party",
    title: "Third party services",
    paragraphs: [
      "Our site may link to or rely on third party services, such as Google sign in. We do not control these services and are not responsible for their content or practices. Your use of them is subject to their own terms.",
    ],
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    paragraphs: [
      'The services are provided "as is" and "as available," without warranties of any kind, whether express or implied. We do not guarantee that the services will be uninterrupted, error free, or secure.',
    ],
  },
  {
    id: "liability",
    title: "Limitation of liability",
    paragraphs: [
      `To the fullest extent permitted by law, ${COMPANY} will not be liable for indirect, incidental, or consequential damages, or for loss of profits or data, arising from your use of the services. Our total liability for any claim will not exceed the amount you paid us, if any, in the 12 months before the claim.`,
    ],
  },
  {
    id: "termination",
    title: "Termination",
    paragraphs: [
      "You can stop using the services or delete your account at any time. We may suspend or end your access if you break these Terms or if needed to protect the services or other users. Sections that by their nature should continue, such as intellectual property and liability, will survive termination.",
    ],
  },
  {
    id: "governing-law",
    title: "Governing law",
    paragraphs: [
      `These Terms are governed by the laws of ${JURISDICTION}, without regard to conflict of law rules. Any disputes will be handled by the courts of ${JURISDICTION}, unless the law requires otherwise.`,
    ],
  },
  {
    id: "changes",
    title: "Changes to these terms",
    paragraphs: [
      "We may update these Terms from time to time. We will change the date at the top of this page, and for significant changes we will notify you by email or on the site. Continuing to use the services after changes take effect means you accept the new Terms.",
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    paragraphs: [
      "If you have questions about these Terms, get in touch and we will respond as soon as we can.",
    ],
  },
];
