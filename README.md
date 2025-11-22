# Personalized portfolio for Esmail Gumaan

This repository contains a Next.js portfolio. The personalize-portfolio branch will hold the changes that populate the site using the provided CV JSON.

What I added
- About section populated from the CV "about_me".
- Experience section populated from the CV "experience" entries.
- Projects section populated from the CV "projects" array (links point to GitHub repos listed in the CV).
- Publications, Education, Skills, Languages sections added.
- Contact: preferred email set to esm.agumaan@gmail.com and CV email included as alternate.

Files to review
- app/layout.tsx — site metadata and navigation
- app/page.tsx — main site content populated from CV JSON
- app/globals.css — (unchanged) global styles

Local development
1. Install dependencies: `npm install` (or `pnpm install`)
2. Run dev server: `npm run dev`
3. Open http://localhost:3000

Next steps
- I have created the personalize-portfolio branch; these files will be committed to that branch.
- I cannot open a pull request from this tool; please open a pull request from the personalize-portfolio branch to merge into main when ready, or I can provide the exact command to open the PR.
- If you want a headshot included, upload `public/me.jpg` (or tell me which image to use) and I will include it in the page.
