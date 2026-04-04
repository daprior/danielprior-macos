export const MAIL_TO_URL = "mailto:mail@danielprior.dk";
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@DanielPrior0";

export interface WebsiteLink {
  title: string;
  url: string;
  description: string;
  image: string;
}

export const PERSONAL_WEBSITES: WebsiteLink[] = [
  {
    title: "Personal Blog",
    url: "https://blog.example.com",
    description:
      "My personal blog where I write about web development, technology, and more.",
    image: "/placeholder.svg?height=200&width=300&query=blog website",
  },
  {
    title: "Photography Portfolio",
    url: "https://photos.example.com",
    description: "A collection of my photography work from around the world.",
    image: "/placeholder.svg?height=200&width=300&query=photography portfolio",
  },
  {
    title: "Side Project",
    url: "https://project.example.com",
    description:
      "An experimental web application I built to explore new technologies.",
    image: "/placeholder.svg?height=200&width=300&query=web application",
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
    url: "https://www.linkedin.com/in/daniel-prior-53a679195/",
    icon: "/linkedin.png",
  },
  {
    title: "GitHub",
    url: "https://github.com/daprior",
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
