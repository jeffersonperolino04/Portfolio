import React, { useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Calculator,
  PenTool,
  CalendarDays,
  Search,
  Linkedin,
  Mail,
  MapPin,
  Copy,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import jpPhoto from "@assets/Untitled_design_20260116_074411_0000_1778062459401.jpg";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

const NAV_LINKS = [
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Skills", href: "#skills" },
  { name: "Samples", href: "#samples" },
  { name: "Contact", href: "#contact" },
];

const TYPEWRITER_WORDS = [
  "Financial Manager",
  "Professional Writer",
  "Virtual Assistant",
  "Detail Oriented",
];

const FadeIn = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const TypewriterText = () => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    if (subIndex === TYPEWRITER_WORDS[index].length + 1 && !reverse) {
      const t = setTimeout(() => setReverse(true), 1800);
      return () => clearTimeout(t);
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((p) => (p + 1) % TYPEWRITER_WORDS.length);
      return;
    }
    const t = setTimeout(
      () => setSubIndex((p) => p + (reverse ? -1 : 1)),
      reverse ? 45 : 130
    );
    return () => clearTimeout(t);
  }, [subIndex, index, reverse]);

  useEffect(() => {
    const t = setInterval(() => setBlink((p) => !p), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <span>
      {TYPEWRITER_WORDS[index].substring(0, subIndex)}
      <span
        style={{ opacity: blink ? 1 : 0 }}
        className="transition-opacity duration-75"
      >
        |
      </span>
    </span>
  );
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="text-[10.5px] font-medium uppercase tracking-[0.15em] text-muted-foreground shrink-0">
        {children}
      </span>
      <div className="h-px bg-border flex-1" />
    </div>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("about");
  const [showCompactHeader, setShowCompactHeader] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => l.href.slice(1));
    const handleScroll = () => {
      setShowCompactHeader(window.scrollY > window.innerHeight * 0.75);
      let current = "about";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 180) current = id;
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: z.infer<typeof contactFormSchema>) {
    const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
    if (!endpoint) {
      toast({
        title: "Configuration error",
        description: "Contact form is not yet configured. Please try reaching out directly by email.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          subject: values.subject,
          message: values.message,
        }),
      });
      if (res.ok) {
        toast({
          title: "Message sent!",
          description: "I'll get back to you within 24 hours.",
        });
        form.reset();
      } else {
        throw new Error("Submission failed");
      }
    } catch {
      toast({
        title: "Something went wrong",
        description: "Your message couldn't be sent. Please email me directly at jeffersonperolino04@gmail.com.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const copyEmail = () => {
    navigator.clipboard.writeText("jeffersonperolino04@gmail.com");
    toast({ title: "Copied!", description: "Email address copied to clipboard." });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── MOBILE HERO (full-screen intro, hidden on md+) ── */}
      <div className="md:hidden min-h-screen flex flex-col items-center justify-center text-center px-[6vw] py-[10vw] relative">
        <img
          src={jpPhoto}
          alt="Jefferson Perolino"
          className="rounded-full object-cover object-top border-2 border-border shadow-md"
          style={{
            width: "clamp(120px, 40vw, 180px)",
            height: "clamp(120px, 40vw, 180px)",
            marginBottom: "clamp(16px, 5vw, 28px)",
          }}
        />
        <h1
          className="font-serif italic text-foreground leading-tight"
          style={{ fontSize: "clamp(30px, 10vw, 52px)", marginBottom: "clamp(6px, 2vw, 12px)" }}
        >
          Jefferson<br />Perolino
        </h1>
        <p
          className="uppercase tracking-[0.18em] text-muted-foreground"
          style={{ fontSize: "clamp(9px, 2.8vw, 12px)", marginBottom: "clamp(14px, 4vw, 22px)" }}
        >
          Virtual Assistant
        </p>
        <div
          className="inline-flex items-center gap-[2vw] rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium"
          style={{
            padding: "clamp(5px, 1.5vw, 8px) clamp(12px, 3.5vw, 18px)",
            fontSize: "clamp(10px, 3vw, 13px)",
            marginBottom: "clamp(18px, 6vw, 30px)",
          }}
        >
          <span
            className="relative flex shrink-0"
            style={{ width: "clamp(6px, 2vw, 8px)", height: "clamp(6px, 2vw, 8px)" }}
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500" />
          </span>
          Available for new clients
        </div>
        <p
          className="font-serif italic text-primary leading-snug"
          style={{
            fontSize: "clamp(18px, 6vw, 28px)",
            minHeight: "clamp(28px, 8vw, 42px)",
            marginBottom: "clamp(10px, 3.5vw, 18px)",
          }}
        >
          <TypewriterText />
        </p>
        <p
          className="text-muted-foreground leading-relaxed"
          style={{
            fontSize: "clamp(12px, 3.8vw, 15px)",
            maxWidth: "85vw",
            marginBottom: "clamp(20px, 7vw, 36px)",
          }}
        >
          A self-driven virtual assistant from the Philippines helping clients
          stay organized, financially sound, and professionally represented — all remotely.
        </p>
        <div className="flex gap-3">
          <Button
            size="sm"
            className="rounded-full shadow-none font-medium px-5 text-xs"
            asChild
          >
            <a href="#contact" onClick={(e) => scrollTo(e, "#contact")}>Get in touch</a>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full shadow-none font-medium px-5 text-xs border-border bg-transparent"
            asChild
          >
            <a href="#samples" onClick={(e) => scrollTo(e, "#samples")}>View work</a>
          </Button>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
          <div className="w-px h-8 bg-muted-foreground/30 animate-pulse" />
          <span
            className="text-muted-foreground/50"
            style={{ fontSize: "clamp(9px, 2.5vw, 11px)" }}
          >
            scroll
          </span>
        </div>
      </div>

      {/* ── MOBILE COMPACT STICKY HEADER (fixed, slides in after hero) ── */}
      <AnimatePresence>
        {showCompactHeader && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-50 md:hidden bg-background/97 backdrop-blur-md border-b border-border"
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Identity row */}
            <div
              className="flex items-center gap-[3.5vw] px-[4vw]"
              style={{ paddingTop: "clamp(10px, 3vw, 16px)", paddingBottom: "clamp(10px, 3vw, 16px)" }}
            >
              <img
                src={jpPhoto}
                alt="Jefferson Perolino"
                className="rounded-full object-cover object-top border border-border shrink-0"
                style={{
                  width: "clamp(44px, 13vw, 64px)",
                  height: "clamp(44px, 13vw, 64px)",
                }}
              />
              <div className="flex flex-col min-w-0">
                <span
                  className="font-serif italic text-foreground leading-tight"
                  style={{ fontSize: "clamp(16px, 4.8vw, 22px)" }}
                >
                  Jefferson Perolino
                </span>
                <div className="flex items-center gap-[1.5vw] mt-[1vw]">
                  <span
                    className="relative flex shrink-0"
                    style={{ width: "clamp(7px, 2vw, 9px)", height: "clamp(7px, 2vw, 9px)" }}
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
                    <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500" />
                  </span>
                  <span
                    className="text-emerald-700 font-medium whitespace-nowrap"
                    style={{ fontSize: "clamp(11px, 3.2vw, 14px)" }}
                  >
                    Available for new clients
                  </span>
                </div>
              </div>
            </div>

            {/* Nav row */}
            <div
              className="scrollbar-none overflow-x-auto flex border-t border-border/40 px-[4vw] gap-[5vw]"
              style={{ paddingTop: "clamp(8px, 2.2vw, 12px)", paddingBottom: "clamp(8px, 2.2vw, 12px)" }}
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  className={`whitespace-nowrap font-medium transition-colors shrink-0 ${
                    activeSection === link.href.slice(1)
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                  style={{ fontSize: "clamp(11px, 3.2vw, 14px)" }}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto flex min-h-screen">

        {/* ── SIDEBAR ── */}
        <aside className="hidden md:flex w-64 xl:w-72 shrink-0 flex-col sticky top-0 h-screen py-14 pl-8 pr-6 border-r border-border overflow-y-auto">

          <div className="mb-7 flex justify-center">
            <img
              src={jpPhoto}
              alt="Jefferson Perolino"
              className="w-32 h-32 rounded-full object-cover object-top border border-border shadow-sm"
            />
          </div>

          <h1 className="font-serif text-[42px] leading-[1.05] italic text-foreground mb-3">
            Jefferson<br />Perolino
          </h1>

          <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground mb-2">
            Virtual Assistant
          </p>

          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-5">
            <MapPin size={11} className="shrink-0" />
            Iloilo City, Philippines
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium mb-10 w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Available for new clients
          </div>

          <nav className="flex flex-col gap-0.5 mb-auto" data-testid="nav-sidebar">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                data-testid={`link-nav-${link.name.toLowerCase()}`}
                className={`text-[13px] py-1.5 transition-colors rounded-sm -ml-1 pl-1 ${
                  activeSection === link.href.slice(1)
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="flex gap-3.5 mt-10">
            <a
              href="https://www.linkedin.com/in/jefferson-perolino-775660308"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-linkedin"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="mailto:jeffersonperolino04@gmail.com"
              data-testid="link-email-sidebar"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail size={16} />
            </a>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 min-w-0 px-8 md:px-12 xl:px-16 pb-32">

          {/* Intro / Typewriter — desktop only, hero covers this on mobile */}
          <div className="hidden md:block pt-14 pb-6 mb-8">
            <p className="text-2xl md:text-[28px] font-serif italic text-primary leading-snug mb-4 min-h-[2em]">
              <TypewriterText />
            </p>
            <p className="text-[14.5px] text-muted-foreground leading-relaxed max-w-md">
              A self-driven virtual assistant from the Philippines helping clients stay organized, financially sound, and professionally represented — all remotely.
            </p>
            <div className="flex gap-3 mt-7">
              <Button
                size="sm"
                className="rounded-full shadow-none font-medium px-5 text-xs"
                asChild
                data-testid="button-get-in-touch"
              >
                <a href="#contact" onClick={(e) => scrollTo(e, "#contact")}>
                  Get in touch
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full shadow-none font-medium px-5 text-xs border-border bg-transparent"
                asChild
                data-testid="button-view-work"
              >
                <a href="#samples" onClick={(e) => scrollTo(e, "#samples")}>
                  View work
                </a>
              </Button>
            </div>
          </div>

          {/* ── ABOUT ── */}
          <section id="about" className="mb-20 scroll-mt-36 md:scroll-mt-8">
            <SectionLabel>About</SectionLabel>
            <FadeIn>
              <div className="space-y-4 text-[14.5px] text-muted-foreground leading-[1.85] max-w-lg">
                <p>
                  I'm Jefferson Perolino, a self-driven virtual assistant based in
                  the Philippines with a strong background in financial management,
                  professional writing, and administrative support. I help clients
                  and businesses stay organized, financially sound, and
                  professionally represented — all remotely.
                </p>
                <p>
                  My approach is simple: I treat every task as if it were my own
                  business. I bring attention to detail, clear communication, and a
                  genuine commitment to quality to everything I handle — from
                  managing accounts to drafting polished documents.
                </p>
              </div>
            </FadeIn>
          </section>

          {/* ── SERVICES ── */}
          <section id="services" className="mb-20 scroll-mt-36 md:scroll-mt-8">
            <SectionLabel>Services</SectionLabel>
            <div>
              {[
                {
                  title: "Financial Management",
                  icon: <Calculator size={16} />,
                  desc: "Bookkeeping, budget tracking, expense reporting, payroll assistance, and financial record organization.",
                },
                {
                  title: "Professional Writing",
                  icon: <PenTool size={16} />,
                  desc: "Business letters, email drafts, reports, proposals, and content writing tailored to your audience.",
                },
                {
                  title: "Administrative Support",
                  icon: <CalendarDays size={16} />,
                  desc: "Calendar management, data entry, document preparation, email management, and task coordination.",
                },
                {
                  title: "Research & Analysis",
                  icon: <Search size={16} />,
                  desc: "Market research, competitor analysis, data gathering, and summarizing findings into actionable reports.",
                },
              ].map((s, i) => (
                <FadeIn key={i} delay={i * 0.07}>
                  <div className="flex gap-4 py-5 border-b border-border last:border-0">
                    <div className="shrink-0 mt-0.5 text-primary">{s.icon}</div>
                    <div>
                      <h3 className="text-[13.5px] font-semibold text-foreground mb-1">
                        {s.title}
                      </h3>
                      <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>

          {/* ── SKILLS ── */}
          <section id="skills" className="mb-20 scroll-mt-36 md:scroll-mt-8">
            <SectionLabel>Skills & Tools</SectionLabel>
            <div className="space-y-6">
              {[
                {
                  category: "Financial",
                  skills: ["QuickBooks", "Microsoft Excel", "Google Sheets", "Budget Tracking", "Bookkeeping"],
                },
                {
                  category: "Writing",
                  skills: ["Business Writing", "Proofreading", "Email Communication", "Report Writing", "Proposal Writing"],
                },
                {
                  category: "Administrative",
                  skills: ["Google Workspace", "Microsoft Office", "Trello", "Notion", "Slack", "Zoom"],
                },
                {
                  category: "Soft Skills",
                  skills: ["Attention to Detail", "Time Management", "Communication", "Reliability", "Problem Solving"],
                },
              ].map((group, i) => (
                <FadeIn key={i} delay={i * 0.07}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
                    <span className="text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground font-medium w-28 shrink-0 pt-1">
                      {group.category}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 text-[12px] rounded-full border border-border text-muted-foreground bg-card hover:text-foreground transition-colors cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>

          {/* ── WORK SAMPLES ── */}
          <section id="samples" className="mb-20 scroll-mt-36 md:scroll-mt-8">
            <SectionLabel>Work Samples</SectionLabel>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Monthly Budget Report",
                  desc: "Financial summary with expense breakdown and variance analysis.",
                  tag: "Finance",
                  color: "from-blue-500/10 to-primary/5",
                },
                {
                  title: "Business Proposal Letter",
                  desc: "Formal client proposal with executive summary and pricing structure.",
                  tag: "Writing",
                  color: "from-emerald-500/10 to-green-500/5",
                },
                {
                  title: "Payroll Spreadsheet Template",
                  desc: "Automated Excel template for tracking employee hours and computing salaries.",
                  tag: "Finance",
                  color: "from-purple-500/10 to-indigo-500/5",
                },
                {
                  title: "Marketing Research Report",
                  desc: "Competitor analysis and market overview compiled for a startup client.",
                  tag: "Research",
                  color: "from-orange-500/10 to-amber-500/5",
                },
              ].map((s, i) => (
                <FadeIn key={i} delay={i * 0.07}>
                  <div
                    className="rounded-xl border border-border overflow-hidden group hover:border-primary/30 transition-colors"
                    data-testid={`card-sample-${i}`}
                  >
                    <div className={`h-24 bg-gradient-to-br ${s.color} flex items-end p-3`}>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium bg-background/70 backdrop-blur-sm px-2.5 py-1 rounded-full border border-border">
                        {s.tag}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-[13px] font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {s.title}
                      </h3>
                      <p className="text-[12.5px] text-muted-foreground mb-4 leading-relaxed">
                        {s.desc}
                      </p>
                      <a
                        href="#"
                        className="inline-flex items-center gap-1.5 text-[12px] text-primary font-medium group/link"
                        data-testid={`link-sample-${i}`}
                      >
                        View Sample{" "}
                        <ArrowRight
                          size={11}
                          className="group-hover/link:translate-x-0.5 transition-transform"
                        />
                      </a>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>

          {/* ── CONTACT ── */}
          <section id="contact" className="mb-20 scroll-mt-36 md:scroll-mt-8">
            <SectionLabel>Contact</SectionLabel>
            <div className="grid md:grid-cols-2 gap-12">
              <FadeIn>
                <p className="text-[14px] text-muted-foreground leading-relaxed mb-8">
                  Have a project in mind? Let's talk. I respond to all messages
                  within 24 hours.
                </p>
                <div className="space-y-5">
                  <div>
                    <span className="text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground font-medium block mb-1.5">
                      Email
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href="mailto:jeffersonperolino04@gmail.com"
                        className="text-[13px] text-foreground hover:text-primary transition-colors font-medium"
                        data-testid="link-email-contact"
                      >
                        jeffersonperolino04@gmail.com
                      </a>
                      <button
                        onClick={copyEmail}
                        className="text-muted-foreground hover:text-primary transition-colors p-1 rounded"
                        title="Copy email"
                        data-testid="button-copy-email"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground font-medium block mb-2">
                      Social
                    </span>
                    <div className="flex gap-2.5">
                      <a
                        href="https://www.linkedin.com/in/jefferson-perolino-775660308"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid="link-linkedin-contact"
                        className="p-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
                      >
                        <Linkedin size={15} />
                      </a>
                      <a
                        href="mailto:jeffersonperolino04@gmail.com"
                        data-testid="link-email-icon-contact"
                        className="p-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
                      >
                        <Mail size={15} />
                      </a>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                    data-testid="form-contact"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground font-medium">
                              Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                {...field}
                                className="bg-background text-sm"
                                data-testid="input-name"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground font-medium">
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="john@example.com"
                                {...field}
                                className="bg-background text-sm"
                                data-testid="input-email"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground font-medium">
                            Subject
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Project inquiry"
                              {...field}
                              className="bg-background text-sm"
                              data-testid="input-subject"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground font-medium">
                            Message
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell me about your project..."
                              {...field}
                              rows={4}
                              className="bg-background text-sm resize-none"
                              data-testid="textarea-message"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isSubmitting}
                      className="rounded-full shadow-none font-medium px-6 text-xs"
                      data-testid="button-submit"
                    >
                      {isSubmitting ? "Sending…" : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </FadeIn>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-border pt-8 pb-4">
            <p className="text-xs text-muted-foreground">
              © 2026 Jefferson Perolino. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Virtual Assistant · Financial Management · Professional Writing
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
