import React, { useState } from 'react';
import { Play, ChevronRight, Star, ArrowUpRight, Check } from 'lucide-react';
import type { AffinityTrackId } from '@/types/design-system';

export interface HomePageProps {
  onNavigate: (route: string) => void;
  onSelectTrack?: (trackId: AffinityTrackId) => void;
  onLaunchLesson?: (lessonId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectTrack,
  onLaunchLesson,
}) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 4000);
    }
  };

  const handleTrackClick = (trackId: AffinityTrackId) => {
    if (onSelectTrack) {
      onSelectTrack(trackId);
    } else {
      onNavigate('catalog');
    }
  };

  return (
    <div className="bg-[#191d1d] text-white w-full overflow-x-hidden font-nunito selection:bg-white selection:text-black">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER (Figma node 101:189)
      ───────────────────────────────────────────────────────────── */}
      <header className="relative z-30 max-w-[1440px] mx-auto px-6 sm:px-12 pt-8 pb-6 flex items-center justify-between">
        {/* Brand Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="text-left group focus-visible:outline-none"
        >
          <span className="font-kanit font-medium text-white text-[18px] sm:text-[20px] tracking-[6.88px] uppercase group-hover:text-zinc-300 transition-colors">
            AFFINITY ACADEMY
          </span>
        </button>

        {/* Center Menu Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          <button
            onClick={() => onNavigate('home')}
            className="font-nunito text-[16px] text-white transition-colors hover:text-zinc-300 lowercase"
          >
            home
          </button>
          <button
            onClick={() => onNavigate('catalog')}
            className="font-nunito text-[16px] text-zinc-400 transition-colors hover:text-white lowercase"
          >
            curriculum
          </button>
          <button
            onClick={() => onNavigate('simulator')}
            className="font-nunito text-[16px] text-zinc-400 transition-colors hover:text-white lowercase"
          >
            sandbox
          </button>
          <button
            onClick={() => onNavigate('encyclopedia')}
            className="font-nunito text-[16px] text-zinc-400 transition-colors hover:text-white lowercase"
          >
            encyclopedia
          </button>
          <button
            onClick={() => onNavigate('resources')}
            className="font-nunito text-[16px] text-zinc-400 transition-colors hover:text-white lowercase"
          >
            resources
          </button>
        </nav>

        {/* Header Right Action Button */}
        <button
          onClick={() => onNavigate('catalog')}
          className="px-7 py-2.5 rounded-[100px] border border-[#6d7d7d] text-white font-kanit text-[14px] sm:text-[15px] tracking-[6.88px] uppercase hover:bg-white hover:text-[#191d1d] hover:border-white transition-all duration-300"
        >
          GET STARTED
        </button>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION (Figma node 101:180)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Mood Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/interia/bg-hero.jpg"
            alt="Affinity Academy Studio"
            className="w-full h-full object-cover object-center opacity-85 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#191d1d]/90 via-[#191d1d]/60 to-[#191d1d]/40" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#191d1d]/70" />
        </div>

        {/* Rotated Swipe Down Indicator (Figma 101:188) */}
        <div className="hidden lg:flex absolute left-8 xl:left-16 bottom-20 z-10 items-center gap-4 -rotate-90 origin-left">
          <span className="font-kanit text-white/70 text-[14px] tracking-[6.88px] uppercase whitespace-nowrap">
            SWIPE DOWN
          </span>
          <div className="w-12 h-px bg-white/40" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-6 sm:px-12 py-20 flex flex-col items-end">
          <div className="max-w-[620px] w-full text-left space-y-6">
            <h1 className="font-kanit font-normal text-[36px] sm:text-[44px] lg:text-[48px] text-white leading-[1.15] tracking-tight">
              We engineer your creative mastery
            </h1>
            <p className="font-nunito font-normal text-[16px] sm:text-[18px] text-zinc-300 leading-relaxed">
              Master the unified Serif Affinity 3.0 suite with in-browser Bézier simulators, non-destructive pixel masking, and embedded V8 JavaScript DOM scripting automation.
            </p>

            {/* Play Button & Interactive Lab CTA (Figma 101:185) */}
            <div className="pt-4 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onNavigate('simulator')}
                  className="group relative size-[68px] rounded-full border border-white/30 bg-black/40 backdrop-blur-md flex items-center justify-center hover:border-white hover:scale-105 transition-all duration-300"
                  aria-label="Launch interactive lab"
                >
                  <div className="absolute inset-0 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors animate-pulse" />
                  <Play className="w-6 h-6 text-white fill-white ml-0.5 group-hover:scale-110 transition-transform" />
                </button>

                <div className="flex flex-col">
                  <span className="font-kanit text-[15px] text-white tracking-[4px] uppercase">
                    INTERACTIVE LAB
                  </span>
                  <span className="text-[13px] text-zinc-400 font-nunito">
                    Pen &amp; Node Bézier Mechanics
                  </span>
                </div>
              </div>

              {onLaunchLesson && (
                <button
                  onClick={() => onLaunchLesson('D01-01')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-[100px] border border-white/20 bg-white/5 hover:bg-white/15 text-white font-kanit text-[13px] tracking-[3px] uppercase transition-all"
                >
                  <span>SAMPLE LESSON</span>
                  <ArrowUpRight className="size-3.5 text-white/70" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SECTION 1: ABOUT (Figma node 101:176)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 sm:px-12 pt-28 pb-16">
        <div className="space-y-4">
          <p className="font-kanit text-[#6d7d7d] text-[16px] tracking-[6.88px] uppercase">
            ABOUT
          </p>
          <h2 className="font-kanit font-normal text-[32px] sm:text-[40px] text-white leading-tight max-w-[950px]">
            The premier precision learning academy for modern digital creators &amp; AI agents
          </h2>
          <p className="font-nunito text-[16px] text-[#6d7d7d] leading-relaxed max-w-[620px] pt-2">
            Engineered from first principles for professional illustrators, retouchers, editorial layout artists, and AI automation developers. Every module connects real in-browser tool mechanisms with production desktop scripting.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. SECTION 2: STATS & IMAGES (Figma node 101:160)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 sm:px-12 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 3 Image Columns */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Image 1: Pen & Vector Geometry */}
            <div className="h-[360px] sm:h-[442px] overflow-hidden bg-zinc-900 group">
              <img
                src="/assets/interia/about-img1.png"
                alt="Affinity Designer Vector Precision"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Image 2: Photo Retouch & HDR */}
            <div className="h-[360px] sm:h-[442px] overflow-hidden bg-zinc-900 group">
              <img
                src="/assets/interia/about-img2.png"
                alt="Affinity Photo Retouching"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Image 3: Publisher Spreads with asymmetrical radius */}
            <div className="h-[240px] sm:h-[260px] rounded-tr-[50px] overflow-hidden bg-zinc-900 group">
              <img
                src="/assets/interia/about-img3.png"
                alt="Affinity Publisher Spreads"
                className="w-full h-full object-cover rounded-tr-[50px] group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right: Metrics & CTA */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full pt-4 space-y-12">
            <div className="space-y-4">
              <button
                onClick={() => onNavigate('catalog')}
                className="w-full sm:w-auto px-8 py-3 rounded-[100px] border border-[#6d7d7d] text-white font-kanit text-[15px] tracking-[6.88px] uppercase hover:bg-white hover:text-[#191d1d] hover:border-white transition-all duration-300"
              >
                LEARN ABOUT
              </button>
            </div>

            {/* 3 Metric counters */}
            <div className="grid grid-cols-3 gap-4 border-t border-[#6d7d7d]/30 pt-8">
              <div>
                <p className="font-kanit text-[#6d7d7d] text-[36px] sm:text-[40px] leading-none">
                  66+
                </p>
                <p className="font-kanit text-white text-[13px] sm:text-[14px] tracking-[4px] uppercase mt-2">
                  LESSONS DONE
                </p>
              </div>

              <div>
                <p className="font-kanit text-[#6d7d7d] text-[36px] sm:text-[40px] leading-none">
                  40
                </p>
                <p className="font-kanit text-white text-[13px] sm:text-[14px] tracking-[4px] uppercase mt-2">
                  FULL MODULES
                </p>
              </div>

              <div>
                <p className="font-kanit text-[#6d7d7d] text-[36px] sm:text-[40px] leading-none">
                  100%
                </p>
                <p className="font-kanit text-white text-[13px] sm:text-[14px] tracking-[4px] uppercase mt-2">
                  VERIFIED MCP
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. SECTION 3: CALLOUT BANNER (Figma node 101:150)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 sm:px-12 pb-28">
        <div className="relative bg-[#212828] rounded-bl-[50px] rounded-tl-[50px] rounded-tr-[50px] overflow-hidden p-8 sm:p-14 lg:p-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 border border-white/5 shadow-2xl">
          {/* Subtle Decorative Circle */}
          <div className="absolute -left-20 -top-20 size-[320px] rounded-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-[560px]">
            <h3 className="font-kanit font-normal text-[32px] sm:text-[40px] text-white leading-tight">
              Blending precision vector craft with intelligent script automation
            </h3>
          </div>

          <div className="relative z-10">
            <button
              onClick={() => onNavigate('catalog')}
              className="px-9 py-3.5 rounded-[100px] border border-[#6d7d7d] text-white font-kanit text-[15px] tracking-[6.88px] uppercase hover:bg-white hover:text-[#191d1d] hover:border-white transition-all duration-300"
            >
              START PRACTICING NOW
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. SECTION 4: INSTRUCTORS & REVIEWS (Figma node 101:120)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full bg-[#131616] py-24 border-y border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Title, Description & Social Proof */}
            <div className="lg:col-span-5 space-y-6">
              <p className="font-kanit text-[#6d7d7d] text-[16px] tracking-[6.88px] uppercase">
                STUDIOS
              </p>
              <h2 className="font-kanit font-normal text-[32px] sm:text-[40px] text-white leading-tight">
                Curriculum engineered by verified studio directors
              </h2>
              <p className="font-nunito text-[16px] text-zinc-400 leading-relaxed">
                Every lesson is thoroughly audited across desktop schemas, Playwright visual tests, and live MCP server introspection on localhost:6767.
              </p>

              {/* Social Proof: Avatars & 5-Star Rating */}
              <div className="pt-6 space-y-4">
                <div className="flex items-center">
                  <div className="flex -space-x-3 overflow-hidden">
                    <img src="/assets/interia/avatar-1.png" alt="Creator" className="inline-block size-[48px] rounded-full ring-2 ring-[#131616]" />
                    <img src="/assets/interia/avatar-2.png" alt="Creator" className="inline-block size-[48px] rounded-full ring-2 ring-[#131616]" />
                    <img src="/assets/interia/avatar-3.png" alt="Creator" className="inline-block size-[48px] rounded-full ring-2 ring-[#131616]" />
                    <img src="/assets/interia/avatar-4.png" alt="Creator" className="inline-block size-[48px] rounded-full ring-2 ring-[#131616]" />
                  </div>
                  <div className="ml-5 flex items-center gap-1.5">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="size-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="font-nunito text-zinc-300 text-[15px] ml-1">
                      (4.9 / 5.0)
                    </span>
                  </div>
                </div>

                <p className="font-kanit text-[#6d7d7d] text-[14px] sm:text-[15px] tracking-[6.88px] uppercase">
                  TRUSTED BY DIGITAL CREATORS
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('resources')}
                    className="px-7 py-2.5 rounded-[100px] border border-[#6d7d7d] text-white font-kanit text-[14px] tracking-[6.88px] uppercase hover:bg-white hover:text-[#191d1d] transition-all duration-300"
                  >
                    LEARN TEAMS
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: 3 Studio Lead Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="group overflow-hidden bg-zinc-900 border border-white/5">
                <div className="h-[260px] overflow-hidden">
                  <img
                    src="/assets/interia/team-1.png"
                    alt="Vector Studio Director"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 bg-[#191d1d]">
                  <p className="font-kanit text-white text-[16px] tracking-wide">Marcus Vance</p>
                  <p className="font-nunito text-[#6d7d7d] text-[13px]">Vector Studio Lead</p>
                </div>
              </div>

              <div className="group overflow-hidden bg-zinc-900 border border-white/5">
                <div className="h-[260px] overflow-hidden">
                  <img
                    src="/assets/interia/team-2.png"
                    alt="Pixel Retouch Specialist"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 bg-[#191d1d]">
                  <p className="font-kanit text-white text-[16px] tracking-wide">Elena Rostova</p>
                  <p className="font-nunito text-[#6d7d7d] text-[13px]">HDR Retouch Lead</p>
                </div>
              </div>

              <div className="group overflow-hidden bg-zinc-900 rounded-br-[50px] border border-white/5">
                <div className="h-[260px] overflow-hidden rounded-br-[50px]">
                  <img
                    src="/assets/interia/team-3.png"
                    alt="DOM Scripting Lead"
                    className="w-full h-full object-cover rounded-br-[50px] group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 bg-[#191d1d] rounded-br-[50px]">
                  <p className="font-kanit text-white text-[16px] tracking-wide">Julian Thorne</p>
                  <p className="font-nunito text-[#6d7d7d] text-[13px]">V8 &amp; MCP Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. SECTION 5: ECOSYSTEM PARTNERS (Figma node 101:100)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 sm:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex flex-col items-center justify-center p-4 border border-white/5 rounded-lg w-full text-center">
            <span className="font-kanit text-[#6d7d7d] text-[18px] tracking-[4px] uppercase">
              SERIF AFFINITY
            </span>
            <span className="text-[11px] text-zinc-500 font-mono mt-1">3.0 UNIFIED SUITE</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 border border-white/5 rounded-lg w-full text-center">
            <span className="font-kanit text-[#6d7d7d] text-[18px] tracking-[4px] uppercase">
              CANVA CREATIVE
            </span>
            <span className="text-[11px] text-zinc-500 font-mono mt-1">AFFINITY ECOSYSTEM</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 border border-white/5 rounded-lg w-full text-center">
            <span className="font-kanit text-[#6d7d7d] text-[18px] tracking-[4px] uppercase">
              GOOGLE V8 DOM
            </span>
            <span className="text-[11px] text-zinc-500 font-mono mt-1">JAVASCRIPT RUNTIME</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 border border-white/5 rounded-lg w-full text-center">
            <span className="font-kanit text-[#6d7d7d] text-[18px] tracking-[4px] uppercase">
              ANTIGRAVITY MCP
            </span>
            <span className="text-[11px] text-zinc-500 font-mono mt-1">LOCALHOST:6767 ENGINE</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. SECTION 6: SERVICES / THE 3 PILLARS (Figma node 101:75)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 sm:px-12 pb-24">
        <div className="divide-y divide-[#6d7d7d]/30">
          {/* Pillar 01: Designer */}
          <div className="py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center group">
            <div className="md:col-span-6">
              <h3 className="font-kanit font-normal text-[32px] sm:text-[40px] text-white leading-tight group-hover:text-amber-200/90 transition-colors">
                01. Affinity Designer
              </h3>
              <p className="font-kanit text-[#6d7d7d] text-[14px] tracking-[4px] uppercase mt-2">
                VECTOR CURVES &amp; GEOMETRY
              </p>
            </div>
            <div className="md:col-span-6 space-y-4">
              <p className="font-nunito text-[16px] text-[#6d7d7d] leading-relaxed">
                Master pen curve geometry, isometric grids, dynamic boolean operations, and multi-resolution responsive artboards across 10 structured modules.
              </p>
              <div>
                <button
                  onClick={() => handleTrackClick('designer')}
                  className="inline-flex items-center gap-3 font-kanit text-[15px] text-white tracking-[6.88px] uppercase hover:gap-4 transition-all"
                >
                  <span>LEARN MORE</span>
                  <ChevronRight className="size-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Pillar 02: Photo */}
          <div className="py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center group">
            <div className="md:col-span-6">
              <h3 className="font-kanit font-normal text-[32px] sm:text-[40px] text-white leading-tight group-hover:text-blue-200/90 transition-colors">
                02. Affinity Photo
              </h3>
              <p className="font-kanit text-[#6d7d7d] text-[14px] tracking-[4px] uppercase mt-2">
                32-BIT HDR &amp; PIXEL RETOUCH
              </p>
            </div>
            <div className="md:col-span-6 space-y-4">
              <p className="font-nunito text-[16px] text-[#6d7d7d] leading-relaxed">
                Develop 32-bit linear HDR, non-destructive live filter stacks, frequency separation retouching, and luminosity masking across 30 verified lessons.
              </p>
              <div>
                <button
                  onClick={() => handleTrackClick('photo')}
                  className="inline-flex items-center gap-3 font-kanit text-[15px] text-white tracking-[6.88px] uppercase hover:gap-4 transition-all"
                >
                  <span>LEARN MORE</span>
                  <ChevronRight className="size-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Pillar 03: Publisher & Scripting */}
          <div className="py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center group">
            <div className="md:col-span-6">
              <h3 className="font-kanit font-normal text-[32px] sm:text-[40px] text-white leading-tight group-hover:text-purple-200/90 transition-colors">
                03. Publisher &amp; Automation
              </h3>
              <p className="font-kanit text-[#6d7d7d] text-[14px] tracking-[4px] uppercase mt-2">
                EDITORIAL SPREADS &amp; MCP DOM
              </p>
            </div>
            <div className="md:col-span-6 space-y-4">
              <p className="font-nunito text-[16px] text-[#6d7d7d] leading-relaxed">
                Engineered publication spreads, 3mm professional bleed, master pages, and headless automation via localhost:6767 MCP server scripting.
              </p>
              <div>
                <button
                  onClick={() => handleTrackClick('publisher')}
                  className="inline-flex items-center gap-3 font-kanit text-[15px] text-white tracking-[6.88px] uppercase hover:gap-4 transition-all"
                >
                  <span>LEARN MORE</span>
                  <ChevronRight className="size-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. SECTION 7: FULL-BLEED GALLERY STRIP (Figma node 101:70)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[360px] sm:h-[440px] lg:h-[515px] grid grid-cols-2 md:grid-cols-4 overflow-hidden">
        <div className="relative h-full overflow-hidden group">
          <img
            src="/assets/interia/gallery-1.png"
            alt="Vector Studio Canvas"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="font-kanit text-white text-[14px] tracking-[4px] uppercase bg-black/60 px-3 py-1.5 backdrop-blur-sm">
              VECTOR SIMULATOR
            </span>
          </div>
        </div>

        <div className="relative h-full overflow-hidden group">
          <img
            src="/assets/interia/gallery-2.png"
            alt="Pixel Masking Engine"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="font-kanit text-white text-[14px] tracking-[4px] uppercase bg-black/60 px-3 py-1.5 backdrop-blur-sm">
              PIXEL MASKING
            </span>
          </div>
        </div>

        <div className="relative h-full overflow-hidden group">
          <img
            src="/assets/interia/gallery-3.png"
            alt="Publisher Editorial Layout"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="font-kanit text-white text-[14px] tracking-[4px] uppercase bg-black/60 px-3 py-1.5 backdrop-blur-sm">
              EDITORIAL SPREADS
            </span>
          </div>
        </div>

        <div className="relative h-full overflow-hidden group">
          <img
            src="/assets/interia/gallery-4.png"
            alt="V8 JavaScript DOM Automation"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="font-kanit text-white text-[14px] tracking-[4px] uppercase bg-black/60 px-3 py-1.5 backdrop-blur-sm">
              MCP DOM RUNNER
            </span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. SECTION 8: ARTICLES / BLOG (Figma node 101:45)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 sm:px-12 py-24">
        <div className="text-center space-y-3 mb-16">
          <p className="font-kanit text-[#6d7d7d] text-[16px] tracking-[6.88px] uppercase">
            BLOG
          </p>
          <h2 className="font-kanit font-normal text-[36px] sm:text-[40px] text-white">
            The latest article
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Article 1 */}
          <div className="space-y-4 group">
            <div className="h-[268px] overflow-hidden bg-zinc-900 border border-white/5">
              <img
                src="/assets/interia/article-1.png"
                alt="Affinity 3.0 Architecture"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <p className="font-nunito text-[#6d7d7d] text-[16px] leading-relaxed line-clamp-2">
              Mastering V8 JavaScript DOM Scripting and automated batch pipelines in Affinity 3.0.
            </p>
            <div>
              <button
                onClick={() => onNavigate('encyclopedia')}
                className="inline-flex items-center gap-3 font-kanit text-[15px] text-white tracking-[6.88px] uppercase hover:gap-4 transition-all"
              >
                <span>LEARN MORE</span>
                <ChevronRight className="size-4 text-white" />
              </button>
            </div>
          </div>

          {/* Article 2 */}
          <div className="space-y-4 group">
            <div className="h-[268px] overflow-hidden bg-zinc-900 border border-white/5">
              <img
                src="/assets/interia/article-2.png"
                alt="Non-destructive Masking"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <p className="font-nunito text-[#6d7d7d] text-[16px] leading-relaxed line-clamp-2">
              Non-destructive live mask hierarchies and 32-bit linear tone mapping workflows.
            </p>
            <div>
              <button
                onClick={() => onNavigate('encyclopedia')}
                className="inline-flex items-center gap-3 font-kanit text-[15px] text-white tracking-[6.88px] uppercase hover:gap-4 transition-all"
              >
                <span>LEARN MORE</span>
                <ChevronRight className="size-4 text-white" />
              </button>
            </div>
          </div>

          {/* Article 3 */}
          <div className="space-y-4 group">
            <div className="h-[268px] overflow-hidden bg-zinc-900 border border-white/5">
              <img
                src="/assets/interia/article-3.png"
                alt="Publication Pre-press Bleed"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <p className="font-nunito text-[#6d7d7d] text-[16px] leading-relaxed line-clamp-2">
              Editorial 3mm bleed standards, master page propagation, and PDF/X-4 print readiness.
            </p>
            <div>
              <button
                onClick={() => onNavigate('encyclopedia')}
                className="inline-flex items-center gap-3 font-kanit text-[15px] text-white tracking-[6.88px] uppercase hover:gap-4 transition-all"
              >
                <span>LEARN MORE</span>
                <ChevronRight className="size-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Hairline Separator */}
        <div className="w-full h-px bg-[#6d7d7d]/30 mt-20" />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. SECTION 9: NEWSLETTER (Figma node 101:37)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 sm:px-12 pb-24">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="min-w-[260px]">
            <h3 className="font-kanit font-normal text-[36px] sm:text-[40px] text-white">
              Newsletter
            </h3>
          </div>

          <form onSubmit={handleSubscribe} className="flex-1 max-w-[760px] w-full flex flex-col sm:flex-row items-center gap-6">
            <div className="relative flex-1 w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full bg-transparent border-b border-[#6d7d7d] py-3 text-[16px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-white transition-colors"
              />
              {isSubscribed && (
                <span className="absolute left-0 -bottom-6 text-xs text-emerald-400 flex items-center gap-1 font-mono">
                  <Check className="size-3" /> Thank you for subscribing!
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 rounded-[100px] border border-[#6d7d7d] text-white font-kanit text-[15px] tracking-[6.88px] uppercase hover:bg-white hover:text-[#191d1d] hover:border-white transition-all duration-300"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          12. FOOTER (Figma node 101:3)
      ───────────────────────────────────────────────────────────── */}
      <footer className="relative w-full bg-[#131616] pt-16 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12">
          {/* Top Row: Navigation Menu & Brand */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12">
            <div className="flex flex-wrap items-center gap-8 font-nunito text-[16px] text-zinc-300 lowercase">
              <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">home</button>
              <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">curriculum</button>
              <button onClick={() => onNavigate('simulator')} className="hover:text-white transition-colors">sandbox</button>
              <button onClick={() => onNavigate('encyclopedia')} className="hover:text-white transition-colors">encyclopedia</button>
              <button onClick={() => onNavigate('resources')} className="hover:text-white transition-colors">resources</button>
              <button onClick={() => onNavigate('playground')} className="hover:text-white transition-colors">mcp playground</button>
            </div>

            <div className="font-kanit text-white text-[16px] tracking-[6.88px] uppercase">
              AFFINITY ACADEMY
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[#6d7d7d]/30" />

          {/* Middle Row: Social & Description */}
          <div className="py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex items-center gap-4 text-zinc-400">
              <span className="font-kanit text-[13px] tracking-[3px] uppercase text-[#6d7d7d]">
                STUDIO ECOSYSTEM
              </span>
              <div className="h-4 w-px bg-zinc-700" />
              <span className="font-mono text-xs text-zinc-500">
                SERIF 3.0 &bull; V8 SCRIPTING &bull; MCP ENGINE
              </span>
            </div>

            <p className="font-nunito text-[15px] text-zinc-400 max-w-[480px] text-left md:text-right">
              Precision design curriculum engineered for human creators and autonomous AI agents.
            </p>
          </div>
        </div>

        {/* Bottom Copyright Bar in #191d1d */}
        <div className="w-full bg-[#191d1d] py-6 border-t border-white/5">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 font-nunito text-[14px] text-zinc-500">
            <p>
              &copy; 2026 Affinity Academy &mdash; All rights reserved.
            </p>

            <div className="flex items-center gap-8 font-kanit text-[14px] tracking-[4px] uppercase text-[#6d7d7d]">
              <span className="hover:text-white transition-colors cursor-pointer">TERMS</span>
              <span className="hover:text-white transition-colors cursor-pointer">PRIVACY</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
