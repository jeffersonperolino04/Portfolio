import React, { useState, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Calculator, 
  PenTool, 
  CalendarDays, 
  Search,
  Mail,
  Linkedin,
  MapPin,
  ArrowRight,
  Menu,
  X,
  Copy
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

// Form Schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

// Navigation links
const NAV_LINKS = [
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Skills", href: "#skills" },
  { name: "Samples", href: "#samples" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact", href: "#contact" },
];

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const TypewriterText = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setReverse(true);
      }, 2000); // pause at the end of word
      return () => clearTimeout(timer);
    }

    if (subIndex === words[index].length + 1 && !reverse) {
      setIsTyping(false);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 50 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, isTyping, words]);

  return (
    <span className="inline-block min-w-[20ch]">
      {words[index].substring(0, subIndex)}
      <span className="animate-pulse">|</span>
    </span>
  );
};

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = NAV_LINKS.map(link => link.href.substring(1));
      let current = "";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 200) {
          current = section;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof contactFormSchema>) {
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "Your message has been sent! I'll get back to you within 24 hours.",
      });
      form.reset();
    }, 1000);
  }

  const copyEmail = () => {
    navigator.clipboard.writeText("jeffersonperolino@gmail.com");
    toast({
      title: "Copied!",
      description: "Email address copied to clipboard.",
    });
  };

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      window.scrollTo({
        top: (target as HTMLElement).offsetTop - 80,
        behavior: "smooth"
      });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent ${
          isScrolled ? "bg-background/80 backdrop-blur-md border-border shadow-sm py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <a href="#" onClick={(e) => scrollTo(e, "#top")} className="text-xl font-serif italic tracking-wide text-foreground hover:opacity-80 transition-opacity">
            JP.
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                  activeSection === link.href.substring(1) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.name}
              </a>
            ))}
            <Button asChild size="sm" className="rounded-full shadow-none font-semibold px-6 hover-elevate">
              <a href="#contact" onClick={(e) => scrollTo(e, "#contact")}>Hire Me</a>
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-foreground p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border py-4 px-6 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className={`text-sm font-medium py-2 ${
                  activeSection === link.href.substring(1) ? "text-primary" : "text-foreground"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </header>

      <main id="top">
        {/* Hero Section */}
        <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden flex items-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
          
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="max-w-4xl">
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-sm font-medium mb-8">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
                  </span>
                  Available for new clients
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-foreground leading-tight tracking-tight mb-6">
                  Jefferson Perolino
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light mb-8 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="text-primary font-serif italic"><TypewriterText words={["Financial Manager", "Professional Writer", "Virtual Assistant", "Detail Orientated"]} /></span>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.3}>
                <div className="flex items-center gap-2 text-muted-foreground mb-12">
                  <MapPin size={18} />
                  <span>Philippines, Remote-Ready</span>
                </div>
              </FadeIn>

              <FadeIn delay={0.4} className="flex flex-wrap items-center gap-4">
                <Button size="lg" className="rounded-full shadow-none hover-elevate font-semibold px-8" asChild>
                  <a href="#contact" onClick={(e) => scrollTo(e, "#contact")}>Get in touch</a>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full shadow-none border-border bg-transparent hover:bg-muted/50 font-semibold px-8" asChild>
                  <a href="#samples" onClick={(e) => scrollTo(e, "#samples")}>View work</a>
                </Button>
              </FadeIn>
            </div>
            
            {/* Elegant Avatar */}
            <FadeIn delay={0.5} className="absolute right-6 top-12 md:right-12 md:top-24 hidden lg:block opacity-10">
               <div className="w-[400px] h-[400px] rounded-full bg-primary/20 flex items-center justify-center border border-primary/10 overflow-hidden backdrop-blur-3xl">
                 <span className="text-[180px] font-serif text-primary/30 tracking-tighter">JP</span>
               </div>
            </FadeIn>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-card border-y border-border">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-12 gap-16 items-start">
              <FadeIn className="lg:col-span-4">
                <h2 className="text-3xl md:text-4xl font-serif mb-6 text-foreground">About Me</h2>
                <div className="w-20 h-1 bg-primary rounded-full" />
              </FadeIn>
              
              <FadeIn delay={0.2} className="lg:col-span-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  I'm Jefferson Perolino, a self-driven virtual assistant based in the Philippines with a strong background in financial management, professional writing, and administrative support. I help clients and businesses stay organized, financially sound, and professionally represented — all remotely.
                </p>
                <p>
                  My approach is simple: I treat every task as if it were my own business. I bring attention to detail, clear communication, and a genuine commitment to quality to everything I handle — from managing accounts to drafting polished documents.
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-32">
          <div className="container mx-auto px-6 md:px-12">
            <FadeIn className="max-w-2xl mb-16">
              <h2 className="text-3xl md:text-4xl font-serif mb-6">Services & Expertise</h2>
              <p className="text-lg text-muted-foreground">Comprehensive administrative and specialized support to keep your operations running smoothly.</p>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Financial Management",
                  icon: <Calculator className="w-8 h-8 text-primary" />,
                  desc: "Bookkeeping, budget tracking, expense reporting, payroll assistance, and financial record organization."
                },
                {
                  title: "Professional Writing",
                  icon: <PenTool className="w-8 h-8 text-primary" />,
                  desc: "Business letters, email drafts, reports, proposals, and content writing tailored to your audience."
                },
                {
                  title: "Administrative Support",
                  icon: <CalendarDays className="w-8 h-8 text-primary" />,
                  desc: "Calendar management, data entry, document preparation, email management, and task coordination."
                },
                {
                  title: "Research & Analysis",
                  icon: <Search className="w-8 h-8 text-primary" />,
                  desc: "Market research, competitor analysis, data gathering, and summarizing findings into actionable reports."
                }
              ].map((service, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300 h-full hover:shadow-lg hover:shadow-primary/5">
                    <div className="w-14 h-14 rounded-xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-foreground">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-24 bg-sidebar border-y border-border">
          <div className="container mx-auto px-6 md:px-12">
            <FadeIn className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif mb-6">Skills & Tools</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">The software and capabilities I utilize to deliver professional results.</p>
            </FadeIn>

            <div className="max-w-4xl mx-auto space-y-12">
              {[
                { category: "Financial", skills: ["QuickBooks", "Microsoft Excel", "Google Sheets", "Budget Tracking", "Bookkeeping"] },
                { category: "Writing", skills: ["Business Writing", "Proofreading", "Email Communication", "Report Writing", "Proposal Writing"] },
                { category: "Administrative", skills: ["Google Workspace", "Microsoft Office", "Trello", "Notion", "Slack", "Zoom"] },
                { category: "Soft Skills", skills: ["Attention to Detail", "Time Management", "Communication", "Reliability", "Problem Solving"] }
              ].map((group, i) => (
                <FadeIn key={group.category} delay={i * 0.1}>
                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                    <h3 className="text-lg font-medium text-foreground w-40 shrink-0 md:pt-2">{group.category}</h3>
                    <div className="flex flex-wrap gap-2 md:gap-3 flex-1">
                      {group.skills.map(skill => (
                        <span key={skill} className="px-4 py-2 rounded-full bg-card border border-border text-sm text-muted-foreground shadow-sm hover:text-foreground transition-colors cursor-default">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Work Samples Section */}
        <section id="samples" className="py-32">
          <div className="container mx-auto px-6 md:px-12">
            <FadeIn className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif mb-6">Selected Work Samples</h2>
                <p className="text-lg text-muted-foreground max-w-2xl">Examples of documents, reports, and templates I've prepared.</p>
              </div>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {[
                {
                  title: "Monthly Budget Report",
                  desc: "Financial summary document with expense breakdown and variance analysis.",
                  tag: "Finance",
                  color: "from-blue-500/10 to-primary/5"
                },
                {
                  title: "Business Proposal Letter",
                  desc: "Formal client proposal with executive summary and pricing structure.",
                  tag: "Writing",
                  color: "from-emerald-500/10 to-green-500/5"
                },
                {
                  title: "Payroll Spreadsheet Template",
                  desc: "Automated Excel template for tracking employee hours and computing salaries.",
                  tag: "Finance",
                  color: "from-purple-500/10 to-indigo-500/5"
                },
                {
                  title: "Marketing Research Report",
                  desc: "Competitor analysis and market overview compiled for a startup client.",
                  tag: "Research",
                  color: "from-orange-500/10 to-amber-500/5"
                }
              ].map((sample, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors h-full flex flex-col">
                    <div className={`h-48 bg-gradient-to-br ${sample.color} flex items-center justify-center border-b border-border`}>
                      <div className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {sample.tag}
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">{sample.title}</h3>
                      <p className="text-muted-foreground mb-8 flex-1">{sample.desc}</p>
                      <Button variant="ghost" className="w-fit text-primary font-medium hover:bg-primary/5 px-0 pb-0 hover:text-primary" asChild>
                        <a href="#" className="inline-flex items-center gap-2 group/link">
                          View Sample
                          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 md:px-12">
            <FadeIn className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif mb-6 text-primary-foreground">Client Feedback</h2>
              <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">What professionals say about working with me.</p>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  quote: "Jefferson is incredibly reliable and thorough. He handled our monthly bookkeeping flawlessly and even caught errors we missed. Highly recommend.",
                  author: "Sarah M.",
                  role: "Business Owner"
                },
                {
                  quote: "His writing quality is exceptional. Every document he delivered was professional, well-structured, and ready to send. Will definitely hire again.",
                  author: "Marcus T.",
                  role: "Marketing Director"
                },
                {
                  quote: "Working with Jefferson has been seamless. He communicates clearly, delivers on time, and always goes the extra mile. A true professional.",
                  author: "Aina R.",
                  role: "Startup Founder"
                }
              ].map((t, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="p-8 rounded-2xl bg-background/5 border border-primary-foreground/10 h-full flex flex-col backdrop-blur-sm">
                    <div className="text-secondary text-lg mb-6 tracking-widest">★★★★★</div>
                    <p className="text-lg leading-relaxed mb-8 flex-1 text-primary-foreground/90 font-serif italic">"{t.quote}"</p>
                    <div>
                      <div className="font-semibold text-primary-foreground">{t.author}</div>
                      <div className="text-sm text-primary-foreground/60">{t.role}</div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-5xl mx-auto bg-card border border-border rounded-3xl overflow-hidden shadow-xl shadow-black/5">
              <div className="grid md:grid-cols-5 h-full">
                {/* Contact Info */}
                <div className="md:col-span-2 bg-sidebar p-10 md:p-12 border-b md:border-b-0 md:border-r border-border flex flex-col">
                  <h2 className="text-3xl font-serif mb-4 text-foreground">Let's Talk</h2>
                  <p className="text-muted-foreground mb-12">Have a project in mind? Let's talk. I respond to all messages within 24 hours.</p>
                  
                  <div className="space-y-8 flex-1">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Email</span>
                      <div className="flex items-center gap-3">
                        <a href="mailto:jeffersonperolino@gmail.com" className="text-lg text-foreground hover:text-primary transition-colors font-medium">
                          jeffersonperolino@gmail.com
                        </a>
                        <button onClick={copyEmail} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors" title="Copy Email">
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Social</span>
                      <div className="flex items-center gap-4">
                        <a href="https://linkedin.com/in/jeffersonperolino" target="_blank" rel="noopener noreferrer" className="p-3 bg-card border border-border rounded-full text-foreground hover:text-primary hover:border-primary/30 transition-all hover:shadow-sm">
                          <Linkedin size={20} />
                        </a>
                        <a href="mailto:jeffersonperolino@gmail.com" className="p-3 bg-card border border-border rounded-full text-foreground hover:text-primary hover:border-primary/30 transition-all hover:shadow-sm">
                          <Mail size={20} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="md:col-span-3 p-10 md:p-12">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} className="bg-background" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="john@example.com" {...field} className="bg-background" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="How can I help you?" {...field} className="bg-background" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell me about your project..." 
                                className="min-h-[150px] resize-y bg-background" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" size="lg" className="w-full sm:w-auto rounded-full px-8 shadow-none hover-elevate">
                        Send Message
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-border text-center">
        <div className="container mx-auto px-6">
          <p className="text-muted-foreground text-sm mb-2">© 2026 Jefferson Perolino. All rights reserved.</p>
          <p className="text-muted-foreground/60 text-xs">Virtual Assistant · Financial Management · Professional Writing</p>
        </div>
      </footer>
    </div>
  );
}
