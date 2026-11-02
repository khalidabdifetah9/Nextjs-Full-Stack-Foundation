export interface Step {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  ml: string;
}

export const howItWorksSection = {
  header: "How It Works",
  subheader:
    "A seamless journey from architectural concept to personalized living.",
  steps: [
    {
      id: 1,
      badge: "01",
      title: "Discover Your Home",
      subtitle: "Explore Canvas Residences",
      description:
        "Browse our curated collection of white canvas architectural properties featuring open floor plans and high resolution spatial models.",
      ml: "[0vw]",
    },
    {
      id: 2,
      badge: "02",
      title: "Customize Your Space",
      subtitle: "Interactive Color & Interior Tuning",
      description:
        "Experiment with dynamic wall color palettes, lighting setups, and room finishings in real time using our interactive studio visualizer.",
      ml: "21vw",
    },
    {
      id: 3,
      badge: "03",
      title: "Make It Yours",
      subtitle: "Move In with Confidence",
      description:
        "Save your custom room palettes, export full design specifications, and finalize your purchase knowing every detail reflects your taste.",
      ml: "0vw",
    },
  ] as Step[],
};
