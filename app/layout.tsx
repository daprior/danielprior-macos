import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Esmail Gumaan — AI Research Engineer',
  description: 'Portfolio of Esmail Gumaan — AI Research Engineer working on neural networks, LLMs, PyTorch and CUDA.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900">
        <div className="min-h-screen max-w-4xl mx-auto px-6 py-12">
          <header className="mb-8">
            <nav className="flex items-center justify-between">
              <div className="text-lg font-semibold">Esmail Gumaan</div>
              <div className="space-x-4 text-sm">
                <a href="#about" className="hover:underline">About</a>
                <a href="#experience" className="hover:underline">Experience</a>
                <a href="#projects" className="hover:underline">Projects</a>
                <a href="#publications" className="hover:underline">Publications</a>
                <a href="#contact" className="hover:underline">Contact</a>
              </div>
            </nav>
          </header>

          <main>{children}</main>

          <footer className="mt-12 text-sm text-neutral-600">
            <hr className="my-6" />
            <div className="flex justify-between">
              <div>© {new Date().getFullYear()} Esmail Gumaan</div>
              <div>
                Built with Next.js · Source: <a className="underline" href="https://github.com/Esmail-ibraheem/danielprior-macos">repo</a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}