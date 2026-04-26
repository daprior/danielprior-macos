export const MAIL_TO_URL = "mailto:hi@maenababneh.dev";
export const CALENDLY_URL = "https://calendly.com/ababnh21/30min";
export const PHONE_NUMBER = "0779631006";
export const PHONE_URL = "tel:0779631006";
export const WHATSAPP_NUMBER = "962779631006";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@thecompasstech";
export const WEBSITE_URL = "https://maenababneh.dev";
export const RESUME_URL = "/resume.pdf";

export const LINKEDIN_URL = "https://www.linkedin.com/in/maenababneh/";
export const GITHUB_URL = "https://github.com/maenababneh";

export interface WebsiteLink {
  title: string;
  demoUrl: string;
  githubUrl: string;
  description: string;
  image: string;
}

export const PERSONAL_WEBSITES: WebsiteLink[] = [
  {
    title: "CreativeFlow",
    demoUrl: "https://creative-overflow.maenababneh.dev/",
    githubUrl: "https://github.com/MaenAbabneh/creativeflow",
    description:
      "A clean product experience designed to help users find useful answers faster and with less friction.",
    image:
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "GTA VI Landing Page",
    demoUrl: "https://gta.maenababneh.dev/",
    githubUrl: "https://github.com/MaenAbabneh/gta-landingPage",
    description:
      "A cinematic landing page concept focused on bold presentation, smooth storytelling, and high visual impact.",
    image:
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "3D Interactive Portfolio",
    demoUrl: "https://maenababneh.dev/",
    githubUrl: "https://github.com/MaenAbabneh/3d-portfolio",
    description:
      "An interactive portfolio experience created to present work in a more memorable, premium, and engaging way.",
    image:
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop",
  },
];

export interface SafariQuickLink {
  title: string;
  url: string;
  icon: string;
}

export const SAFARI_SOCIAL_LINKS: SafariQuickLink[] = [
  {
    title: "LinkedIn",
    url: LINKEDIN_URL,
    icon: "/linkedin.png",
  },
  {
    title: "GitHub",
    url: GITHUB_URL,
    icon: "/github.png",
  },
  {
    title: "YouTube",
    url: YOUTUBE_CHANNEL_URL,
    icon: "/youtube.png",
  },
  {
    title: "Email",
    url: MAIL_TO_URL,
    icon: "/mail.png",
  },
];

export const SAFARI_FREQUENTLY_VISITED: SafariQuickLink[] = [
  {
    title: "GitHub",
    url: "https://github.com",
    icon: "/github.png",
  },
  {
    title: "LinkedIn",
    url: "https://linkedin.com",
    icon: "/linkedin.png",
  },
  {
    title: "YouTube",
    url: "https://youtube.com",
    icon: "/youtube.png",
  },
  {
    title: "Reddit",
    url: "https://reddit.com",
    icon: "/reddit.png",
  },
  {
    title: "ChatGPT",
    url: "https://chatgpt.com",
    icon: "/chatgpt.png",
  },
  {
    title: "Stack Overflow",
    url: "https://stackoverflow.com",
    icon: "/stackoverflow.png",
  },
];
