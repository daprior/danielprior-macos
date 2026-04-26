# 🍎 macOS Portfolio

A stunning, interactive macOS-inspired portfolio website built with Next.js and Tailwind CSS.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-13%2B-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)](https://tailwindcss.com/)

![macOS Portfolio Demo](https://res.cloudinary.com/djy5oyivn/image/upload/q_auto/f_auto/v1775839278/macos-demo_ajjcda.png)
<!-- <img width="1920" height="1080" alt="macos-demo" src="https://github.com/user-attachments/assets/7b1211fb-48a4-48bc-8623-88bb4746c8b3" /> -->


## 👨‍💻 Demo

Demo Link: [https://macos.maenababneh.dev](https://macos.maenababneh.dev)

### ✨ Features

- 🖥️ Realistic macOS interface with dark/light mode
- 🚀 Interactive desktop experience with working windows
- 🔍 Spotlight search functionality
- 🧩 Multiple apps to showcase your skills and projects:
  - Safari (For browsing)
  - Notes (for bio/resume/about)
  - Terminal (interactive command line)
  - VSCode (code samples)
  - Mail (contact link)
  - GitHub (profile link)
  - Spotify (music player)
  - YouTube (video channel)
  - FaceTime (video chat demo)
  - Snake (just for fun)
  - Weather (mock data)
  - Projects (interactive GitHub portfolio showcase)
- 🎛️ Working Control Center with brightness and volume controls
- 🔄 Boot, login, sleep, and shutdown sequences
- 📱 Almost fully responsive design
- ⚡ Fast and optimized performance
- 📦 **Live GitHub Integration** - Draggable project folders that fetch real GitHub data (pinned repositories)
- 📝 **Markdown README Rendering** - Project READMEs displayed as formatted Markdown with syntax highlighting
- 🔗 **Interactive Project Cards** - Full project metadata including stars, language, last updated, and links

#### 🚀 Getting Started

##### Prerequisites

- Node.js 16.x or higher
- npm or yarn

##### Installation

1. Clone the repository:

```bash
git clone https://github.com/maenababneh/maenababneh-macos.git
cd maenababneh-macos

2. Install 

npm install
# or
yarn install

3. Run the development server:

npm run dev
# or
yarn dev

```
4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## ✅ Linting

- Run lint (fails on warnings):

```bash
npm run lint -- --max-warnings 0
```

- Auto-fix (formatting + some rule fixes):

```bash
npm run lint -- --fix
```

## 📌 Primary Changes Notes

See [docs/primary-changes.md](docs/primary-changes.md) for a summary of the primary repo changes (new dev deps, lint script change, and the main React/TypeScript refactors).

## 🎨 Customization

### Personal Information

Edit the following files to customize your portfolio:

- `components/apps/notes.tsx` - Your bio and personal information
- `components/apps/terminal/` - Custom terminal commands, output content, and behavior

### Social Links

Update your social media links in:

- `components/apps/github.tsx` - GitHub profile URL
- `components/apps/youtube.tsx` - YouTube channel URL
- `components/apps/mail.tsx` - Email address
- `components/apps/safari.tsx` - Featured websites and social links


### Appearance

- Replace wallpapers in `public/wallpaper-day.jpg` and `public/wallpaper-night.jpg`
- Update app icons in the `public` folder
- Modify the color scheme in `tailwind.config.ts`


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Important**: If you use this template for your own portfolio, you must include attribution to the original author. Please keep the attribution in the footer or about section of your site.

Original template by [Daniel Prior](https://github.com/daprior/danielprior-macos)

## 🙏 Acknowledgments

- Special thanks to [Renovamen](https://github.com/Renovamen/playground-macos) for the original inspiration for this macOS-themed portfolio concept.
- Icons from [Lucide React](https://lucide.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Initial layout jump-started with v0 — [V0/Vercel](https://v0.dev/)
- Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/maenababneh/maenababneh-macos/issues).

## 📧 Contact

Maen Ababneh - [hi@maenababneh.dev](mailto:hi@maenababneh.dev)

- **GitHub**: [github.com/maenababneh](https://github.com/maenababneh)
- **LinkedIn**: [linkedin.com/in/maenababneh](https://www.linkedin.com/in/maenababneh/)
- **YouTube**: [@thecompasstech](https://www.youtube.com/@thecompasstech)
- **Resume**: [/resume.pdf](/resume.pdf)

Project Link: [https://github.com/maenababneh/maenababneh-macos](https://github.com/maenababneh/maenababneh-macos)

---

<p align="center"><sub>Made with ❤️ by Maen Ababneh</sub></p>
