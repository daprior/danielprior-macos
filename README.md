# 🍎 macOS Portfolio

A stunning, interactive macOS-inspired portfolio website built with Next.js and Tailwind CSS.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-13%2B-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)](https://tailwindcss.com/)

![macOS Portfolio Demo](public/macos-portfolio-demo.png)

## 👨‍💻 Demo

Demo Link: [http://danielprior.dev](http://danielprior.dev)

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
- 🎛️ Working Control Center with brightness and volume controls
- 🔄 Boot, login, sleep, and shutdown sequences
- 📱 Almost fully responsive design
- ⚡ Fast and optimized performance

#### 🚀 Getting Started

##### Prerequisites

- Node.js 16.x or higher
- npm or yarn

##### Installation

1. Clone the repository:

```bash
git clone https://github.com/daprior/danielprior-macos.git
cd macos-portfolio

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
- `components/apps/terminal.tsx` - Custom terminal commands and responses

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

## 🙏 Acknowledgments

- Special thanks to [Renovamen](https://github.com/Renovamen/playground-macos) for the original inspiration for this macOS-themed portfolio concept.
- Icons from [Lucide React](https://lucide.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Initial layout jump-started with v0 — [V0/Vercel](https://v0.dev/)
- Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/daprior/danielprior-macos/issues).

## 📧 Contact

Daniel Prior - [mail@danielprior.dk](mailto:mail@danielprior.dk)

Project Link: [https://github.com/daprior/danielprior-macos](https://github.com/daprior/danielprior-macos)

---

<p align="center"><sub>Made with ❤️ by Daniel</sub></p>
