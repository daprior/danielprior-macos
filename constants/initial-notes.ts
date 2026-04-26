export type InitialNote = {
  id: number;
  title: string;
  content: string;
  date: string;
};

export const initialNotes: InitialNote[] = [
  {
    id: 1,
    title: "About Me",
    content: `# Maen Ababneh
Computer Science Student & Software Engineer

## Bio
Welcome to my digital workspace! I am a software engineer and CS student at Al-Balqa Applied University in Jordan. I specialize in crafting high-performance, immersive web experiences that bridge the gap between complex logic and exceptional UI design.

## Technical Arsenal
### Frontend & Architecture
- React.js / Next.js (App Router)
- TypeScript / JavaScript
- Tailwind CSS
- State Management (Zustand, Redux)
- Clean Architecture & Performance Optimization

### Animation & 3D Web
- GSAP (Timeline, ScrollTrigger, FLIP)
- Framer Motion
- Three.js / React Three Fiber
- WebGL

### Backend & Tools
- Node.js / Express
- Git / GitHub
- Vercel / Deployment pipelines

## Contact & Links
- **Email:** [hi@maenababneh.dev](mailto:hi@maenababneh.dev)
- **LinkedIn:** [linkedin.com/in/maenababneh](https://www.linkedin.com/in/maenababneh)
- **GitHub:** [github.com/maenababneh](https://github.com/maenababneh)
- **Website:** [maenababneh.dev](https://maenababneh.dev)
- **YouTube:** [The Compass Tech](https://www.youtube.com/@thecompasstech)`,
    date: "Today, 09:00 AM",
  },
  {
    id: 2,
    title: "Goals & Vision",
    content: `# My Learning Goals & Vision

## Technical Mastery
- **WebGPU & Advanced 3D:** Push the boundaries of 3D graphics on the web by mastering WebGPU and advanced GLSL shaders.
- **Micro-animations:** Perfect the art of micro-interactions that make UI feel alive without compromising performance.
- **Full-Stack Scaling:** Deepen knowledge in backend architecture to support massive scale applications.

## Career Aspirations
- **Freelance Growth:** Build a sustainable and premium freelance business, delivering top-tier web solutions to global clients.
- **Education:** Successfully fund and complete my Computer Science degree at Al-Balqa Applied University.
- **Community:** Share my knowledge in UI engineering and Next.js through "The Compass Tech" YouTube channel and open-source contributions.`,
    date: "Yesterday, 11:30 AM",
  },
  {
    id: 3,
    title: "Featured Projects",
    content: `# Featured Projects

Here are some of the projects I am most proud of. You can view the live demos in the **Safari** app!

## 🏎️ GTA VI Website Clone
A highly optimized, unofficial clone of the GTA VI website.
- **Focus:** Pixel-perfect UI, extremely complex animations, and 60fps performance.
- **Tech:** Next.js, GSAP, Tailwind CSS.

## 🍔 3D Interactive Restaurant Menu
An immersive web experience that replaces traditional menus with interactive 3D food models.
- **Focus:** 3D rendering in the browser, user interaction, spatial UI.
- **Tech:** React Three Fiber, Three.js, WebGL.

## 💡 Creative Overflow
An AI-powered Q&A platform tailored for creative problem-solving.
- **Focus:** Complex state management, AI integration, responsive design.
- **Tech:** Next.js, Zustand, API integrations.`,
    date: "March 15, 02:20 PM",
  },
  {
    id: 4,
    title: "Freelance Services",
    content: `# Let's Work Together 🤝

I am currently available for freelance opportunities. If you are looking to build a premium web product, I can help you with:

## 1. High-Performance Web Apps
Building fast, SEO-friendly, and highly scalable applications using Next.js and React.

## 2. Immersive UI & 3D Experiences
Transforming boring websites into interactive experiences using GSAP animations and Three.js 3D elements that captivate your users.

## 3. UI/UX Implementation
Turning your Figma designs into pixel-perfect, responsive code with a strong focus on accessibility and modern web standards.

**Interested?** Send me an email at [hi@maenababneh.dev](mailto:hi@maenababneh.dev) or open the **Mail** app!`,
    date: "March 10, 10:00 AM",
  },
];
