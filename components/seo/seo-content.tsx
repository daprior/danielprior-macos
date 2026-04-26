import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { initialNotes } from "@/constants/initial-notes";
import {
  CALENDLY_URL,
  PERSONAL_WEBSITES,
  PHONE_NUMBER,
  PHONE_URL,
} from "@/constants/media-links";

export default function SeoContent() {
  return (
    <>
      <main className="sr-only" aria-label="SEO content">
        <h1>Maen Ababneh — Web Developer</h1>
        <p>
          A macOS-style portfolio with clear project highlights and an easy way
          to get in touch.
        </p>

        <section aria-label="About and notes">
          {initialNotes.map((note) => (
            <article key={note.id}>
              <h2>{note.title}</h2>
              <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
                {note.content}
              </ReactMarkdown>
            </article>
          ))}
        </section>

        <section aria-label="Projects">
          <h2>Projects</h2>
          <ul>
            {PERSONAL_WEBSITES.map((site) => (
              <li key={site.githubUrl}>
                <h3>{site.title}</h3>
                <p>{site.description}</p>
                <p>
                  <a href={site.demoUrl}>Live demo</a>
                  {" — "}
                  <a href={site.githubUrl}>Source code</a>
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Contact">
          <h2>Contact</h2>
          <p>
            Ready to talk about a website or a custom build? Book a quick call
            or reach out by phone.
          </p>
          <p>
            <a href={CALENDLY_URL}>Book a call</a>
            {" — "}
            <a href={PHONE_URL}>Call {PHONE_NUMBER}</a>
          </p>
        </section>
      </main>

      <noscript>
        <main aria-label="Portfolio content">
          <h1>Maen Ababneh — Web Developer</h1>
          <p>
            JavaScript is required for the full macOS experience. Here is a
            text-based version of the portfolio.
          </p>

          {initialNotes.map((note) => (
            <section key={note.id}>
              <h2>{note.title}</h2>
              <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
                {note.content}
              </ReactMarkdown>
            </section>
          ))}

          <section>
            <h2>Projects</h2>
            <ul>
              {PERSONAL_WEBSITES.map((site) => (
                <li key={site.githubUrl}>
                  <strong>{site.title}</strong>: {site.description} ({" "}
                  <a href={site.demoUrl}>Demo</a>,{" "}
                  <a href={site.githubUrl}>GitHub</a>)
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Ready to talk about a website or a custom build? Book a quick call
              or reach out by phone.
            </p>
            <p>
              <a href={CALENDLY_URL}>Book a call</a>
              {" — "}
              <a href={PHONE_URL}>Call {PHONE_NUMBER}</a>
            </p>
          </section>
        </main>
      </noscript>
    </>
  );
}
