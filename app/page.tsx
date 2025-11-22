import React from 'react';

type Experience = {
  title: string;
  company: string;
  location?: string;
  period: string;
  bullets: string[];
  link?: string;
};

type Project = {
  name: string;
  description: string;
  tech?: string[];
  link?: string;
};

const EXPERIENCES: Experience[] = [
  {
    title: 'ML Engineer',
    company: 'Automa8e',
    location: 'Philippines',
    period: 'Dec 2024 — Jan 2025',
    bullets: [
      'Developed AI-powered applications for generating dynamic responses.',
      'Automated actionable insights extraction from documents using advanced NLP and document processing techniques.',
    ],
  },
  {
    title: 'AI/ML Software Engineer',
    company: 'AI Development Collaborator',
    location: 'Germany',
    period: 'Nov 2023 — Aug 2024',
    bullets: [
      'Built Retrieval-Augmented Generation (RAG) systems for medical applications integrating OCR and LLMs to improve MRI detection and documentation workflows.',
      'Designed pipelines to combine document OCR, vector retrieval, and LLM-based reasoning to produce accurate, context-aware outputs.',
    ],
  },
  {
    title: 'AI Engineer',
    company: 'Creative Point',
    location: "Sana'a",
    period: 'Jan 2024 — Nov 2024',
    bullets: [
      'Built AI models from scratch, iterating on architectures and optimization strategies to meet strict performance targets.',
      'Operated long training cycles (12-hour workdays) and tuned models for deployment readiness and reliability.',
    ],
  },
  {
    title: 'AI/ML Student Researcher',
    company: "Sana’a University",
    location: "Sana'a",
    period: 'May 2023 — Aug 2023',
    bullets: [
      'Implemented seminal research papers (Transformer, diffusion models) and applied them to LLM and generative modeling experiments.',
      'Developed and fine-tuned diffusion models and multiple RAG variants (agentic, graph-based, self-correcting) for research prototypes.',
    ],
];

const PROJECTS: Project[] = [
  {
    name: 'nanograd: AI Engine',
    description:
      'An ML/DL and neural net ecosystem to run models like GPT, LLaMA, Stable Diffusion, vision transformers, reinforcement learning and autotrainer — an AI engine/ecosystem for research and production.',
    tech: ['Python', 'PyTorch', 'Gradio', 'FastAPI'],
    link: 'https://github.com/Esmail/nanograd',
  },
  {
    name: 'Axon: AI Research Lab',
    description:
      'A collaborative platform for implementing and reproducing cutting-edge AI research across transformers, diffusion models, RLHF and more, with an emphasis on high-quality, reproducible implementations.',
    tech: ['Python', 'PyTorch', 'JavaScript'],
    link: 'https://github.com/Esmail/Axon',
  },
  {
    name: 'TinyLlamas',
    description:
      'An advanced language model framework inspired by LLaMA, featuring GQA, multi-head attention experiments and a flexible platform for attention-mechanism research.',
    tech: ['Python', 'PyTorch', 'Streamlit', 'Gradio', 'HuggingFace'],
    link: 'https://github.com/Esmail/Tinyllamas',
  },
];

const PUBLICATIONS = [
  {
    title: 'Theoretical Foundations and Mitigation of Hallucination in Large Language Models',
    venue: 'arXiv',
    id: '2507.22915',
    date: 'July 2025',
    link: 'https://arxiv.org/abs/2507.22915',
  },
  {
    title: 'Universal Approximation Theorem for a Single-Layer Transformer',
    venue: 'arXiv',
    id: '2507.10581',
    date: 'July 2025',
    link: 'https://arxiv.org/abs/2507.10581',
  },
  {
    title: 'Mixture of Transformers: Macro-Level Gating for Sparse Activation in Large Language Model Ensembles',
    venue: 'ResearchGate',
    id: 'RG.2.2.25049.02400',
    date: 'April 2025',
    link: '',
  },
  {
    title: 'ExpertRAG: Efficient RAG with Mixture of Experts',
    venue: 'arXiv',
    id: '2505.08744',
    date: 'March 2025',
    link: 'https://arxiv.org/abs/2505.08744',
  },
  {
    title: 'Galvatron: Automatic Distributed Training for Large Transformer Models',
    venue: 'arXiv',
    id: '2505.03662',
    date: 'March 2025',
    link: 'https://arxiv.org/abs/2505.03662',
  },
];

const EDUCATION = [
  {
    institution: "University of Sana’a",
    degree: 'BS in Computer Science',
    period: 'Jan 2023 — Mar 2025',
    details: [
      'GPA: 79.72% (2.2/5.0 Gut)',
      'Coursework highlights: Artificial Intelligence, Data Science, Data Mining, Advanced Programming',
    ],
  },
];

const SKILLS = {
  programming_and_tools: [
    'Python',
    'C++',
    'Java',
    'SQL',
    'JavaScript',
    'CUDA',
    'LaTeX',
    'PyTorch',
    'TensorFlow',
    'PyTorch Lightning',
    'LangChain',
    'Haystack',
    'Colab',
    'GitHub',
    'Git',
    'HuggingFace',
    'Databases',
    'Linux',
  ],
  mathematics: ['Differential equations', 'Calculus', 'Linear algebra'],
};

export default function Home() {
  return (
    <section>
      {/* ABOUT */}
      <section id="about" className="mb-10">
        <div className="flex items-start gap-6">
          <div className="w-28 h-28 bg-neutral-200 rounded-full overflow-hidden flex-shrink-0">
            {/* Add headshot to public/me.jpg and uncomment below:
                <img src="/me.jpg" alt="Esmail Gumaan" className="w-full h-full object-cover" />
            */}
          </div>
          <div>
            <h1 className="text-3xl font-bold">Esmail Gumaan</h1>
            <p className="mt-2 text-neutral-700 max-w-prose">
              AI Research Engineer focused on neural networks, large language models, and scalable ML systems. Experienced in PyTorch and CUDA, with strong contributions to open-source research bridging theory and applications.
            </p>
            <div className="mt-3 space-x-3">
              <a className="text-sm underline" href="https://github.com/Esmail-ibraheem">GitHub</a>
              <a className="text-sm underline" href="https://esmail-ibraheem.github.io/portfolio/">Website</a>
              <a className="text-sm underline" href="#contact">Contact</a>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Experience</h2>
        <div className="space-y-4">
          {EXPERIENCES.map((e, i) => (
            <div key={i} className="p-4 bg-white rounded shadow-sm">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{e.title} — {e.company} {e.location ? `· ${e.location}` : ''}</div>
                  <div className="text-sm text-neutral-600">{e.period}</div>
                </div>
              </div>
              <ul className="mt-2 list-disc ml-5 text-neutral-700">
                {e.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Projects</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <div key={i} className="p-4 bg-white rounded shadow-sm">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-neutral-600 mt-1">{p.tech?.join(' · ')}</div>
              <p className="mt-2 text-neutral-700">{p.description}</p>
              {p.link ? <a className="mt-3 inline-block text-sm underline" href={p.link}>View project</a> : null}
            </div>
          ))}
        </div>
      </section>

      {/* PUBLICATIONS */}
      <section id="publications" className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Publications</h2>
        <div className="space-y-3">
          {PUBLICATIONS.map((pub, i) => (
            <div key={i} className="text-neutral-700">
              <div className="font-medium">{pub.title}</div>
              <div className="text-sm text-neutral-600">{pub.venue} · {pub.date} {pub.id ? `· ${pub.id}` : ''}</div>
              {pub.link ? <a className="text-sm underline" href={pub.link}>Read</a> : null}
            </div>
          ))}
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Education</h2>
        {EDUCATION.map((ed, i) => (
          <div key={i} className="p-4 bg-white rounded shadow-sm">
            <div className="font-medium">{ed.degree} — {ed.institution}</div>
            <div className="text-sm text-neutral-600">{ed.period}</div>
            <ul className="mt-2 list-disc ml-5 text-neutral-700">
              {ed.details.map((d, j) => <li key={j}>{d}</li>)}
            </ul>
          </div>
        ))}
      </section>

      {/* SKILLS & LANGUAGES */}
      <section id="skills" className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded shadow-sm">
            <div className="font-medium">Programming & Tools</div>
            <div className="text-neutral-700 mt-2">{SKILLS.programming_and_tools.join(', ')}</div>
          </div>
          <div className="p-4 bg-white rounded shadow-sm">
            <div className="font-medium">Mathematics</div>
            <div className="text-neutral-700 mt-2">{SKILLS.mathematics.join(', ')}</div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <p className="text-neutral-700 max-w-prose">
          Preferred email: <a className="underline" href="mailto:esm.agumaan@gmail.com">esm.agumaan@gmail.com</a><br />
          Alternate / CV email: <a className="underline" href="mailto:esmail.agumaan@gmail.com">esmail.agumaan@gmail.com</a><br />
          GitHub: <a className="underline" href="https://github.com/Esmail-ibraheem">https://github.com/Esmail-ibraheem</a>
        </p>
      </section>
    </section>
  );
}