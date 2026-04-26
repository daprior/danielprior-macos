"use client";

import Image from "next/image";
import { ArrowUpRight, CalendarDays, Mail, Phone } from "lucide-react";

import {
  CALENDLY_URL,
  MAIL_TO_URL,
  PHONE_NUMBER,
  PHONE_URL,
  WEBSITE_URL,
} from "@/constants/media-links";

interface ContactProps {
  isDarkMode?: boolean;
}

const actionLinkClass =
  "flex items-center justify-between gap-3 rounded-2xl border px-4 py-4 text-left transition-transform duration-150 hover:-translate-y-0.5";

export default function Contact({ isDarkMode = true }: ContactProps) {
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const bgColor = isDarkMode ? "bg-gray-950" : "bg-white";
  const panelBg = isDarkMode ? "bg-white/5" : "bg-black/5";
  const panelBorder = isDarkMode ? "border-white/10" : "border-black/10";
  const mutedText = isDarkMode ? "text-white/70" : "text-gray-600";

  return (
    <div className={`h-full ${bgColor} ${textColor} p-5 sm:p-6 overflow-auto`}>
      <div
        className={`mx-auto flex min-h-full max-w-3xl flex-col justify-center rounded-[2rem] border ${panelBorder} ${panelBg} p-5 sm:p-8 shadow-2xl backdrop-blur-xl`}
      >
        <div className="flex flex-col gap-6 md:items-start md:gap-8">
          <div className="flex items-center gap-4 md:min-w-[220px] md:flex-col md:items-start">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 via-cyan-400 to-sky-300 shadow-lg shadow-blue-500/20">
              <Image
                src="/macos-folderl.svg"
                alt="Contact folder"
                fill
                sizes="80px"
                className="object-contain p-2"
                priority
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-400">
                Contact
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Let&apos;s talk about your next project
              </h2>
              <p className={`mt-3 max-w-xl text-sm leading-6 ${mutedText}`}>
                If you need a new website, a redesign, or a custom web
                experience, book a short call and I&apos;ll help you figure out
                the clearest next step.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:flex-1">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noreferrer"
              className={`${actionLinkClass} border-blue-400/30 bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-400`}
            >
              <span className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5" />
                <span>
                  <span className="block text-sm font-semibold">
                    Book a call
                  </span>
                  <span className="block text-xs text-white/80">
                    Free 30-minute intro call
                  </span>
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4" />
            </a>

            <a
              href={PHONE_URL}
              className={`${actionLinkClass} border ${panelBorder} ${panelBg} hover:bg-black/10`}
            >
              <span className="flex items-center gap-3">
                <Phone className="h-5 w-5" />
                <span>
                  <span className="block text-sm font-semibold">Call</span>
                  <span className={`block text-xs ${mutedText}`}>
                    {PHONE_NUMBER}
                  </span>
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4" />
            </a>

            <a
              href={MAIL_TO_URL}
              className={`${actionLinkClass} border ${panelBorder} ${panelBg} hover:bg-black/10`}
            >
              <span className="flex items-center gap-3">
                <Mail className="h-5 w-5" />
                <span>
                  <span className="block text-sm font-semibold">Email</span>
                  <span className={`block text-xs ${mutedText}`}>
                    Send project details anytime
                  </span>
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4" />
            </a>

            <a
              href={WEBSITE_URL}
              target="_blank"
              rel="noreferrer"
              className={`${actionLinkClass} border ${panelBorder} ${panelBg} hover:bg-black/10`}
            >
              <span>
                <span className="block text-sm font-semibold">
                  View portfolio
                </span>
                <span className={`block text-xs ${mutedText}`}>
                  Recent work and project examples
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
