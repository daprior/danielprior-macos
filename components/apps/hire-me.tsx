"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  CircleDollarSign,
  Cuboid,
  FolderKanban,
  Layers,
  Mail,
  MonitorSmartphone,
  PhoneCall,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  HIRE_ME_CASE_STUDIES,
  HIRE_ME_PRICING_PLANS,
  HIRE_ME_SERVICE_CARDS,
  HIRE_ME_TABS,
  type HireMeServiceIcon,
  type HireMeTabId,
} from "@/constants/hire-me-config";
import { CALENDLY_URL, MAIL_TO_URL } from "@/constants/media-links";

interface HireMeProps {
  isDarkMode?: boolean;
}

interface TabSectionProps {
  isDarkMode: boolean;
}

const TAB_ICONS: Record<HireMeTabId, typeof Briefcase> = {
  Services: Briefcase,
  Pricing: CircleDollarSign,
  "Case Studies": FolderKanban,
  "Book a Call": PhoneCall,
};

const SERVICE_ICONS: Record<HireMeServiceIcon, typeof Cuboid> = {
  cuboid: Cuboid,
  monitorSmartphone: MonitorSmartphone,
  layers: Layers,
};

function ServicesTab({ isDarkMode }: TabSectionProps) {
  const mutedText = isDarkMode ? "text-white/70" : "text-gray-600";
  const cardBg = isDarkMode ? "bg-white/5" : "bg-black/5";
  const borderColor = isDarkMode ? "border-white/10" : "border-black/10";
  const iconBg = isDarkMode ? "bg-blue-500/15" : "bg-blue-500/10";

  return (
    <div className="space-y-6 text-left">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight">What I Do</h2>
        <p className={`mt-2 text-lg ${mutedText}`}>
          I design and build websites that look premium, feel smooth, and help
          businesses make a stronger impression online.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {HIRE_ME_SERVICE_CARDS.map((service) => {
          const Icon = SERVICE_ICONS[service.icon];

          return (
            <article
              key={service.title}
              className={`group rounded-[1.75rem] border ${borderColor} ${cardBg} p-6 shadow-xl backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1`}
            >
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg} transition-colors group-hover:bg-blue-500/20`}
              >
                <Icon className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className={`mt-3 text-sm leading-6 ${mutedText}`}>
                {service.description}
              </p>
              <div className="mt-6 flex items-center text-sm font-medium text-blue-400">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {service.price}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function PricingTab({ isDarkMode }: TabSectionProps) {
  const mutedText = isDarkMode ? "text-white/70" : "text-gray-600";
  const cardBg = isDarkMode ? "bg-white/5" : "bg-black/5";
  const borderColor = isDarkMode ? "border-white/10" : "border-black/10";

  return (
    <div className="space-y-6 text-left">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight">
          Investment Options
        </h2>
        <p className={`mt-2 text-lg ${mutedText}`}>
          Clear starting points based on the type of website or experience you
          need.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {HIRE_ME_PRICING_PLANS.map((plan) => (
          <article
            key={plan.title}
            className={`rounded-[1.75rem] border p-6 text-center shadow-xl backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1 ${
              plan.featured
                ? "border-blue-400/40 bg-blue-500/10 ring-1 ring-blue-400/20"
                : `${borderColor} ${cardBg}`
            }`}
          >
            {plan.featured ? (
              <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-300">
                Most Requested
              </span>
            ) : null}

            <h3 className="mt-4 text-xl font-semibold">{plan.title}</h3>
            <div className="mt-3 text-3xl font-semibold text-blue-400">
              {plan.price}
            </div>
            <p className={`mt-4 min-h-16 text-sm leading-6 ${mutedText}`}>
              {plan.description}
            </p>

            <Button
              asChild
              className={`mt-6 w-full rounded-2xl ${
                plan.featured
                  ? "bg-blue-500 text-white hover:bg-blue-400"
                  : isDarkMode
                    ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                    : "border-black/10 bg-black/5 text-gray-900 hover:bg-black/10"
              }`}
              variant={plan.featured ? "default" : "outline"}
            >
              <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
                Discuss Project
              </a>
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}

function CaseStudiesTab({ isDarkMode }: TabSectionProps) {
  const mutedText = isDarkMode ? "text-white/70" : "text-gray-600";
  const cardBg = isDarkMode ? "bg-white/5" : "bg-black/5";
  const borderColor = isDarkMode ? "border-white/10" : "border-black/10";
  const previewBg = isDarkMode
    ? "bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950"
    : "bg-gradient-to-br from-slate-100 via-white to-blue-100";

  return (
    <div className="space-y-6 text-left">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight">Featured Work</h2>
        <p className={`mt-2 text-lg ${mutedText}`}>
          A few examples of the kind of polished, high-impact digital
          experiences I can create for brands and products.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {HIRE_ME_CASE_STUDIES.map((item) => (
          <article
            key={item.title}
            className={`group flex flex-col overflow-hidden rounded-[1.75rem] border ${borderColor} ${cardBg} shadow-xl backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1`}
          >
            <div
              className={`relative flex h-44 items-center justify-center border-b ${borderColor} ${previewBg}`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.18),_transparent_55%)]" />
              <span className={`relative text-sm font-medium ${mutedText}`}>
                {item.title} Preview
              </span>
            </div>

            <div className="flex flex-1 flex-col space-y-4 p-6">
              <div>
                <h3 className="text-xl font-semibold transition-colors group-hover:text-blue-400">
                  {item.title}
                </h3>
                <p
                  className={`mt-1 text-xs font-medium uppercase tracking-[0.22em] ${mutedText}`}
                >
                  {item.type}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 px-3 py-2 font-mono text-sm text-blue-300">
                {item.stack}
              </div>

              <div className="flex-1 space-y-3 text-sm leading-6">
                <p className={mutedText}>
                  <strong className="mb-1 block text-current">
                    Challenge:
                  </strong>
                  {item.problem}
                </p>
                <p className={mutedText}>
                  <strong className="mb-1 block text-current">
                    Execution:
                  </strong>
                  {item.solution}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function BookCallTab({ isDarkMode }: TabSectionProps) {
  const mutedText = isDarkMode ? "text-white/70" : "text-gray-600";
  const panelBg = isDarkMode ? "bg-white/5" : "bg-black/5";
  const borderColor = isDarkMode ? "border-white/10" : "border-black/10";

  return (
    <div
      className={`mx-auto max-w-2xl rounded-[2rem] border ${borderColor} ${panelBg} px-6 py-12 text-center shadow-2xl backdrop-blur-xl sm:px-10`}
    >
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/15">
        <PhoneCall className="h-8 w-8 text-blue-400" />
      </div>
      <h2 className="text-4xl font-semibold tracking-tight">
        Let&apos;s Build Something Great
      </h2>
      <p className={`mx-auto mt-4 max-w-xl text-lg leading-8 ${mutedText}`}>
        Book a free 20-minute discovery call and we&apos;ll talk through your
        goals, ideas, timeline, and the best next step for your project.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button
          asChild
          size="lg"
          className="group w-full rounded-full bg-blue-500 px-8 text-white hover:bg-blue-400 sm:w-auto"
        >
          <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
            Book Free Call
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className={`w-full rounded-full sm:w-auto ${
            isDarkMode
              ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
              : "border-black/10 bg-black/5 text-gray-900 hover:bg-black/10"
          }`}
        >
          <a href={MAIL_TO_URL}>
            <Mail className="h-5 w-5" />
            hi@maenababneh.dev
          </a>
        </Button>
      </div>
    </div>
  );
}

export default function HireMe({ isDarkMode = true }: HireMeProps) {
  const [activeTab, setActiveTab] = useState<HireMeTabId>("Services");

  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const bgColor = isDarkMode ? "bg-gray-950" : "bg-white";
  const heroPanelBg = isDarkMode ? "bg-white/5" : "bg-black/5";
  const borderColor = isDarkMode ? "border-white/10" : "border-black/10";
  const mutedText = isDarkMode ? "text-white/70" : "text-gray-600";
  const tabRailBg = isDarkMode ? "bg-white/5" : "bg-black/5";

  return (
    <div className={`h-full overflow-auto ${bgColor} ${textColor} p-5 sm:p-6`}>
      <div className="mx-auto max-w-6xl space-y-8">
        <section
          className={`overflow-hidden rounded-[2rem] border ${borderColor} ${heroPanelBg} p-6 shadow-2xl backdrop-blur-xl sm:p-8`}
        >
          <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.22),_transparent_70%)]" />
          <div className="relative space-y-8">
            <div className="space-y-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
                Hire Me
              </p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Work With Me
              </h1>
              <p className={`mx-auto max-w-2xl text-lg leading-8 ${mutedText}`}>
                I create modern websites and digital experiences that help
                brands look more credible, stand out clearly, and turn attention
                into real enquiries.
              </p>
            </div>

            <div
              className={`mx-auto flex w-fit flex-wrap justify-center gap-2 rounded-2xl border ${borderColor} ${tabRailBg} p-1.5 backdrop-blur-xl`}
            >
              {HIRE_ME_TABS.map((tab) => {
                const Icon = TAB_ICONS[tab.id];
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                        : `${mutedText} hover:bg-white/10 hover:text-current`
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="relative min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "Services" && (
                    <ServicesTab isDarkMode={isDarkMode} />
                  )}
                  {activeTab === "Pricing" && (
                    <PricingTab isDarkMode={isDarkMode} />
                  )}
                  {activeTab === "Case Studies" && (
                    <CaseStudiesTab isDarkMode={isDarkMode} />
                  )}
                  {activeTab === "Book a Call" && (
                    <BookCallTab isDarkMode={isDarkMode} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
