export type HireMeTabId =
  | "Services"
  | "Pricing"
  | "Case Studies"
  | "Book a Call";

export type HireMeServiceIcon = "cuboid" | "monitorSmartphone" | "layers";

export interface HireMeTabItem {
  id: HireMeTabId;
  label: string;
}

export interface HireMeServiceCard {
  title: string;
  description: string;
  price: string;
  icon: HireMeServiceIcon;
}

export interface HireMePricingPlan {
  title: string;
  price: string;
  description: string;
  featured?: boolean;
}

export interface HireMeCaseStudy {
  title: string;
  type: string;
  stack: string;
  problem: string;
  solution: string;
}

export const HIRE_ME_TABS: HireMeTabItem[] = [
  { id: "Services", label: "Services" },
  { id: "Pricing", label: "Pricing" },
  { id: "Case Studies", label: "Case Studies" },
  { id: "Book a Call", label: "Book a Call" },
];

export const HIRE_ME_SERVICE_CARDS: HireMeServiceCard[] = [
  {
    title: "Premium Brand Websites",
    description:
      "Custom websites designed to help your brand look premium, feel memorable, and leave a stronger first impression.",
    price: "Starting from $1,500",
    icon: "cuboid",
  },
  {
    title: "Landing Pages That Convert",
    description:
      "Focused landing pages built to present your offer clearly, build trust quickly, and turn more visitors into enquiries or customers.",
    price: "Starting from $800",
    icon: "monitorSmartphone",
  },
  {
    title: "Business Web Applications",
    description:
      "Custom client portals, dashboards, and web platforms built to simplify operations and support your business as it grows.",
    price: "Starting from $1,200",
    icon: "layers",
  },
];

export const HIRE_ME_PRICING_PLANS: HireMePricingPlan[] = [
  {
    title: "Performance Landing",
    price: "From $300",
    description:
      "A polished landing page for a product, campaign, or service with mobile-ready design and a clear conversion path.",
  },
  {
    title: "Interactive & 3D",
    price: "From $1000",
    description:
      "A standout interactive experience for brands that want something more memorable than a standard website.",
    featured: true,
  },
  {
    title: "Full Web Application",
    price: "From $1,200",
    description:
      "A custom web app with the key pages, user flows, and functionality needed to support your product or internal workflow.",
  },
];

export const HIRE_ME_CASE_STUDIES: HireMeCaseStudy[] = [
  {
    title: "MacOS Web Experience",
    type: "Interactive Experience • Product Showcase",
    stack: "Next.js 16 • React 19 • GSAP • Tailwind CSS",
    problem:
      "The goal was to create an experience people would remember instantly instead of presenting work in a standard portfolio layout.",
    solution:
      "The result was a highly interactive website experience that made the portfolio feel unique, polished, and worth exploring.",
  },
  {
    title: "Interactive 3D Room",
    type: "Immersive Website • Brand Experience",
    stack: "Three.js • React Three Fiber • Blender",
    problem:
      "The challenge was to create a rich visual experience without making the website feel heavy or difficult to use.",
    solution:
      "The final experience combined strong visuals with smooth performance, helping the concept feel premium and easy to navigate.",
  },
  {
    title: "GTA VI Inspired Experience",
    type: "Campaign Landing Page • Visual Storytelling",
    stack: "React • GSAP",
    problem:
      "The page needed to feel bold, cinematic, and exciting from the very first scroll.",
    solution:
      "The result was a high-impact landing page that used motion and pacing to keep visitors engaged and reinforce the brand mood.",
  },
  {
    title: "Creative Overflow",
    type: "Startup Product • Knowledge Platform",
    stack: "Next.js • Node.js • Express • MongoDB",
    problem:
      "Users needed a simpler way to find useful answers quickly without digging through scattered sources.",
    solution:
      "The platform made it easier to search, discover, and act on answers in one clean experience.",
  },
];
