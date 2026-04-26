"use client";

import { useState, useRef, useEffect } from "react";
import { Mail, MessageCircle, Send, X, Loader2, Check } from "lucide-react";
import { WHATSAPP_URL } from "@/constants/media-links";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function QuickContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPanelMounted, setIsPanelMounted] = useState(false);
  const [isLauncherVisible, setIsLauncherVisible] = useState(false);
  const [showLauncherHint, setShowLauncherHint] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputsRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsPanelMounted(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const revealTimer = window.setTimeout(() => {
      setIsLauncherVisible(true);
      setShowLauncherHint(true);
    }, 1400);

    const hintTimer = window.setTimeout(() => {
      setShowLauncherHint(false);
    }, 6200);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(hintTimer);
    };
  }, []);

  useGSAP(
    () => {
      if (
        isOpen &&
        isPanelMounted &&
        panelRef.current &&
        inputsRef.current &&
        buttonsRef.current
      ) {
        const timeline = gsap.timeline();

        timeline.fromTo(
          panelRef.current,
          {
            opacity: 0,
            y: 18,
            scale: 0.96,
            filter: "blur(10px)",
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.42,
            ease: "power2.out",
          },
          0,
        );

        timeline.fromTo(
          inputsRef.current.querySelectorAll("input, textarea"),
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.28,
            stagger: 0.05,
            ease: "power2.out",
          },
          0.12,
        );

        timeline.fromTo(
          buttonsRef.current.querySelectorAll("button, a"),
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.24,
            stagger: 0.06,
            ease: "power2.out",
          },
          0.2,
        );
      } else if (!isOpen && isPanelMounted && panelRef.current) {
        gsap.to(panelRef.current, {
          opacity: 0,
          y: 14,
          scale: 0.97,
          filter: "blur(8px)",
          duration: 0.22,
          ease: "power2.in",
          onComplete: () => {
            setIsPanelMounted(false);
          },
        });
      }
    },
    { dependencies: [isOpen, isPanelMounted], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (!isLauncherVisible || !buttonRef.current) return;

      gsap.fromTo(
        buttonRef.current,
        {
          opacity: 0,
          y: 20,
          scale: 0.92,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.45,
          ease: "power2.out",
        },
      );
    },
    { dependencies: [isLauncherVisible], revertOnUpdate: true },
  );

  useEffect(() => {
    const buttonElement = buttonRef.current;

    if (buttonElement && isLauncherVisible) {
      const icon = buttonElement.querySelector("svg");
      if (icon) {
        if (isOpen) {
          gsap.killTweensOf(buttonElement);
          gsap.to(icon, {
            rotation: 12,
            scale: 0.92,
            duration: 0.28,
            ease: "power2.out",
          });
        } else {
          gsap.to(icon, {
            rotation: 0,
            scale: 1,
            duration: 0.28,
            ease: "power2.out",
          });

          gsap.to(buttonElement, {
            y: -4,
            duration: 1.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
      }
    }

    return () => {
      if (buttonElement) {
        gsap.killTweensOf(buttonElement);
      }
    };
  }, [isLauncherVisible, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setTimeout(() => {
          setIsOpen(false);
        }, 1500);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-28 right-4 z-[80] sm:bottom-10 sm:right-6"
    >
      {isPanelMounted ? (
        <div
          ref={panelRef}
          className="w-[min(92vw,360px)] rounded-3xl border border-white/15 bg-zinc-950/92 p-4 text-white shadow-2xl backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Quick Contact</p>
              <p className="text-xs text-white/60">
                Send a short message or continue on WhatsApp
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Close quick contact"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-0">
            <div ref={inputsRef} className="space-y-2.5">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-white/10 bg-white/7 px-3 py-2.5 text-sm outline-none placeholder:text-white/40 focus:border-blue-400/50 disabled:opacity-50"
              />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                type="email"
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-white/10 bg-white/7 px-3 py-2.5 text-sm outline-none placeholder:text-white/40 focus:border-blue-400/50 disabled:opacity-50"
              />
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone number"
                type="tel"
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-white/10 bg-white/7 px-3 py-2.5 text-sm outline-none placeholder:text-white/40 focus:border-blue-400/50 disabled:opacity-50"
              />
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Tell me briefly about your project"
                rows={4}
                disabled={isSubmitting}
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/7 px-3 py-2.5 text-sm outline-none placeholder:text-white/40 focus:border-blue-400/50 disabled:opacity-50"
              />
            </div>

            {submitStatus === "success" && (
              <div className="mt-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-center">
                <div className="flex items-center justify-center gap-2 text-emerald-400">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Message sent successfully
                  </span>
                </div>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mt-3 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-center">
                <span className="text-sm font-medium text-red-400">
                  Something went wrong. Please try again.
                </span>
              </div>
            )}

            <div ref={buttonsRef} className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="submit"
                disabled={isSubmitting || !name || !email || !phone || !message}
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-blue-400/30 bg-blue-500 px-3 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400" />
                WhatsApp
              </a>
            </div>
          </form>
        </div>
      ) : isLauncherVisible ? (
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex h-16 items-center justify-center gap-2 overflow-hidden rounded-full border border-white/15 bg-white/10 px-4 text-white shadow-2xl backdrop-blur-xl transition duration-200 hover:scale-[1.03] hover:bg-white/15 sm:h-[4.25rem] sm:px-5"
          aria-label="Open quick contact"
        >
          <span className="absolute -inset-1 rounded-full border border-blue-400/20 opacity-70 blur-[1px]" />
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.45),_transparent_65%)] opacity-90 transition-opacity duration-200 group-hover:opacity-100" />
          <span className="absolute inset-[1px] rounded-full bg-zinc-950/80" />
          <Mail className="relative h-5 w-5 shrink-0 text-blue-300 transition-colors duration-200 group-hover:text-blue-200 sm:h-6 sm:w-6" />
          <span className="relative hidden whitespace-nowrap text-sm font-medium text-white/90 sm:inline">
            Contact
          </span>
          {showLauncherHint ? (
            <span className="absolute -top-3 right-1 hidden rounded-full border border-blue-400/30 bg-blue-500/15 px-2.5 py-1 text-[11px] font-semibold tracking-[0.18em] text-blue-200 shadow-lg shadow-blue-500/15 sm:inline-flex">
              LET&apos;S TALK
            </span>
          ) : null}
        </button>
      ) : null}
    </div>
  );
}
