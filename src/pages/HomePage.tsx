import React from 'react';
import { Play, ChevronRight, ArrowUpRight } from 'lucide-react';
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
              Learn the tools. Think like a designer.
            </h1>
            <p className="font-nunito font-normal text-[16px] sm:text-[18px] text-zinc-300 leading-relaxed">
              Learn Affinity through its Layout, Vector, and Pixel studios. Build tool fluency, visual judgement, and a repeatable design process — then apply those skills to new briefs.
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
            From learning the tools to thinking like a designer
          </h2>
          <p className="font-nunito text-[16px] text-[#6d7d7d] leading-relaxed max-w-[620px] pt-2">
            A structured learning path for understanding what each tool does, choosing an appropriate workflow, testing visual decisions, and improving work through critique and iteration.
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
                alt="Vector design practice"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Image 2: Photo Retouch & HDR */}
            <div className="h-[360px] sm:h-[442px] overflow-hidden bg-zinc-900 group">
              <img
                src="/assets/interia/about-img2.png"
                alt="Pixel editing practice"
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
                  66
                </p>
                <p className="font-kanit text-white text-[13px] sm:text-[14px] tracking-[4px] uppercase mt-2">
                  EXISTING LESSONS
                </p>
              </div>

              <div>
                <p className="font-kanit text-[#6d7d7d] text-[36px] sm:text-[40px] leading-none">
                  120
                </p>
                <p className="font-kanit text-white text-[13px] sm:text-[14px] tracking-[4px] uppercase mt-2">
                  PLANNED LESSONS
                </p>
              </div>

              <div>
                <p className="font-kanit text-[#6d7d7d] text-[36px] sm:text-[40px] leading-none">
                  3
                </p>
                <p className="font-kanit text-white text-[13px] sm:text-[14px] tracking-[4px] uppercase mt-2">
                  CORE STUDIOS
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
          6. SECTION 4: THE DESIGN-THINKING PROCESS
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 sm:px-12 py-24">
        <div className="max-w-[760px] space-y-4 mb-12">
          <p className="font-kanit text-[#6d7d7d] text-[14px] tracking-[6px] uppercase">A repeatable way to work</p>
          <h2 className="font-kanit text-[32px] sm:text-[40px] text-white leading-tight">Design thinking, not just button memorisation</h2>
          <p className="font-nunito text-[16px] text-zinc-400 leading-relaxed">
            Each project should move from understanding the brief to delivering a considered result. Learners practise explaining their choices, checking the outcome, and revising when the design does not solve the problem.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ['01', 'Discover', 'Understand the audience, context, and constraints.'],
            ['02', 'Define', 'Turn the brief into a clear design problem.'],
            ['03', 'Explore', 'Compare directions before committing to one.'],
            ['04', 'Plan', 'Choose tools, assets, and a workable sequence.'],
            ['05', 'Create', 'Build with control over layers, objects, and layout.'],
            ['06', 'Evaluate', 'Check hierarchy, clarity, consistency, and output.'],
            ['07', 'Iterate', 'Use critique and evidence to improve the work.'],
            ['08', 'Deliver', 'Package editable files and the required exports.'],
          ].map(([step, title, description]) => (
            <article key={step} className="min-h-[170px] border border-white/10 bg-[#202626] p-5 sm:p-6">
              <span className="font-mono text-xs text-[#9aa9a7]">{step}</span>
              <h3 className="font-kanit text-xl text-white mt-4">{title}</h3>
              <p className="font-nunito text-sm text-zinc-400 leading-relaxed mt-2">{description}</p>
            </article>
          ))}
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          7. SECTION 5: CURRENT AFFINITY STUDIOS
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 sm:px-12 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
          <div className="space-y-3">
            <p className="font-kanit text-[#6d7d7d] text-[14px] tracking-[6px] uppercase">The application workspace</p>
            <h2 className="font-kanit text-[30px] sm:text-[36px] text-white">Three studios, distinct jobs</h2>
          </div>
          <p className="font-nunito text-sm text-zinc-400 max-w-[440px] leading-relaxed">
            Layout, Vector, and Pixel are the three core studios in the current learning scope. Scripting and MCP are treated as a separate automation strand.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { number: '01', title: 'Layout', subtitle: 'Pages & publication', detail: 'Structure pages, grids, type hierarchy, and multi-page documents.' },
            { number: '02', title: 'Vector', subtitle: 'Shapes & geometry', detail: 'Create and edit paths, nodes, curves, and geometric forms.' },
            { number: '03', title: 'Pixel', subtitle: 'Images & masks', detail: 'Work with pixel layers, selections, masks, and image adjustments.' },
            { number: '04', title: 'Automation', subtitle: 'Scripting & MCP', detail: 'Understand supported scripting workflows and their limits.' },
          ].map((studio) => (
            <article key={studio.number} className="border border-white/10 bg-[#202626] p-6 min-h-[210px]">
              <span className="font-mono text-xs text-[#9aa9a7]">{studio.number}</span>
              <h3 className="font-kanit text-2xl text-white mt-4">{studio.title}</h3>
              <p className="font-kanit text-[11px] tracking-[2px] text-[#9aa9a7] uppercase mt-1">{studio.subtitle}</p>
              <p className="font-nunito text-sm text-zinc-400 leading-relaxed mt-4">{studio.detail}</p>
            </article>
          ))}
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          8. SECTION 6: LEARNING PATHS
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 sm:px-12 pb-24">
        <div className="mb-8 space-y-3">
          <p className="font-kanit text-[#6d7d7d] text-[14px] tracking-[6px] uppercase">Learning paths</p>
          <h2 className="font-kanit text-[30px] sm:text-[36px] text-white">Choose a domain, then learn to transfer the skill</h2>
        </div>
        <div className="divide-y divide-[#6d7d7d]/30">
          <div className="py-9 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group">
            <div className="md:col-span-5">
              <h3 className="font-kanit text-[28px] sm:text-[34px] text-white group-hover:text-amber-100 transition-colors">01. Vector design</h3>
              <p className="font-kanit text-[#9aa9a7] text-[12px] tracking-[3px] uppercase mt-2">Vector studio · Designer learning track</p>
            </div>
            <div className="md:col-span-7 space-y-4">
              <p className="font-nunito text-[15px] text-zinc-400 leading-relaxed">Practise Bézier curves, nodes, geometry, Boolean operations, and artboards. Learn why a tool fits a shape-building problem rather than following steps by rote.</p>
              <button onClick={() => handleTrackClick('designer')} className="inline-flex items-center gap-3 font-kanit text-sm text-white tracking-[3px] uppercase hover:gap-4 transition-all">Explore vector path <ChevronRight className="size-4" /></button>
            </div>
          </div>
          <div className="py-9 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group">
            <div className="md:col-span-5">
              <h3 className="font-kanit text-[28px] sm:text-[34px] text-white group-hover:text-blue-100 transition-colors">02. Pixel editing</h3>
              <p className="font-kanit text-[#9aa9a7] text-[12px] tracking-[3px] uppercase mt-2">Pixel studio · Photo learning track</p>
            </div>
            <div className="md:col-span-7 space-y-4">
              <p className="font-nunito text-[15px] text-zinc-400 leading-relaxed">Work with layers, selections, masks, tonal and colour adjustments, and non-destructive editing. Explain the workflow and inspect the result at each stage.</p>
              <button onClick={() => handleTrackClick('photo')} className="inline-flex items-center gap-3 font-kanit text-sm text-white tracking-[3px] uppercase hover:gap-4 transition-all">Explore pixel path <ChevronRight className="size-4" /></button>
            </div>
          </div>
          <div className="py-9 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group">
            <div className="md:col-span-5">
              <h3 className="font-kanit text-[28px] sm:text-[34px] text-white group-hover:text-purple-100 transition-colors">03. Layout &amp; publishing</h3>
              <p className="font-kanit text-[#9aa9a7] text-[12px] tracking-[3px] uppercase mt-2">Layout studio · Publisher learning track</p>
            </div>
            <div className="md:col-span-7 space-y-4">
              <p className="font-nunito text-[15px] text-zinc-400 leading-relaxed">Explore page structure, grids, typography, master pages, and export requirements. This domain currently has pilot lessons; further authoring remains behind the project phase gate.</p>
              <button onClick={() => handleTrackClick('publisher')} className="inline-flex items-center gap-3 font-kanit text-sm text-white tracking-[3px] uppercase hover:gap-4 transition-all">Explore layout path <ChevronRight className="size-4" /></button>
            </div>
          </div>
          <div className="py-9 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group">
            <div className="md:col-span-5">
              <h3 className="font-kanit text-[28px] sm:text-[34px] text-white group-hover:text-emerald-100 transition-colors">04. Scripting &amp; automation</h3>
              <p className="font-kanit text-[#9aa9a7] text-[12px] tracking-[3px] uppercase mt-2">Separate automation learning strand</p>
            </div>
            <div className="md:col-span-7 space-y-4">
              <p className="font-nunito text-[15px] text-zinc-400 leading-relaxed">Understand supported scripting concepts, repeatable production tasks, and MCP integration boundaries. Treat scripts as an aid to design work, not a replacement for design judgement.</p>
              <button onClick={() => handleTrackClick('scripting')} className="inline-flex items-center gap-3 font-kanit text-sm text-white tracking-[3px] uppercase hover:gap-4 transition-all">Explore automation path <ChevronRight className="size-4" /></button>
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
              VECTOR PRACTICE
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
              PIXEL MASKING PRACTICE
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
              LAYOUT PRACTICE
            </span>
          </div>
        </div>

        <div className="relative h-full overflow-hidden group">
          <img
            src="/assets/interia/gallery-4.png"
            alt="Automation learning concept"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="font-kanit text-white text-[14px] tracking-[4px] uppercase bg-black/60 px-3 py-1.5 backdrop-blur-sm">
              AUTOMATION PRACTICE
            </span>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          10. SECTION 8: HOW TO USE THE ACADEMY
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 sm:px-12 py-24">
        <div className="text-center space-y-3 mb-12">
          <p className="font-kanit text-[#6d7d7d] text-[14px] tracking-[6px] uppercase">From lesson to independent work</p>
          <h2 className="font-kanit text-[30px] sm:text-[36px] text-white">A learning loop with evidence</h2>
          <p className="font-nunito text-zinc-400 max-w-[680px] mx-auto leading-relaxed">
            Read the concept, practise with guidance, solve a fresh challenge, then review the choices and improve the result.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <article className="border border-white/10 bg-[#202626] p-7">
            <span className="font-mono text-xs text-[#9aa9a7]">01 / UNDERSTAND</span>
            <h3 className="font-kanit text-xl text-white mt-4">Know what the tool does</h3>
            <p className="font-nunito text-sm text-zinc-400 leading-relaxed mt-3">Learn the tool's purpose, core controls, strengths, limitations, and when another method is more suitable.</p>
          </article>
          <article className="border border-white/10 bg-[#202626] p-7">
            <span className="font-mono text-xs text-[#9aa9a7]">02 / PRACTISE</span>
            <h3 className="font-kanit text-xl text-white mt-4">Build fluency through practice</h3>
            <p className="font-nunito text-sm text-zinc-400 leading-relaxed mt-3">Move from demonstrations to guided exercises and independent tasks with clear success criteria.</p>
          </article>
          <article className="border border-white/10 bg-[#202626] p-7">
            <span className="font-mono text-xs text-[#9aa9a7]">03 / TRANSFER</span>
            <h3 className="font-kanit text-xl text-white mt-4">Solve a new design brief</h3>
            <p className="font-nunito text-sm text-zinc-400 leading-relaxed mt-3">Select a workflow, justify design decisions, respond to critique, and deliver editable work with the required exports.</p>
          </article>
        </div>
        <div className="text-center mt-10">
          <button onClick={() => onNavigate('encyclopedia')} className="inline-flex items-center gap-3 font-kanit text-sm text-white tracking-[3px] uppercase hover:gap-4 transition-all">Explore the tool encyclopedia <ChevronRight className="size-4" /></button>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          11. SECTION 9: START LEARNING
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 sm:px-12 pb-24">
        <div className="bg-[#212828] border border-white/10 rounded-[28px] p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-[650px] space-y-3">
            <p className="font-kanit text-[#9aa9a7] text-[13px] tracking-[4px] uppercase">Start with the foundations</p>
            <h2 className="font-kanit text-[30px] sm:text-[38px] text-white leading-tight">Build skill you can use on a brief you have never seen before</h2>
            <p className="font-nunito text-[15px] text-zinc-400 leading-relaxed">Begin with a foundational lesson, practise in the sandbox, and keep a record of the choices you make and why you made them.</p>
          </div>
          <button onClick={() => onNavigate('catalog')} className="shrink-0 px-8 py-3 rounded-full border border-[#9aa9a7] text-white font-kanit text-sm tracking-[3px] uppercase hover:bg-white hover:text-[#191d1d] transition-all">Open the curriculum</button>
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
                LAYOUT &bull; VECTOR &bull; PIXEL &bull; AUTOMATION
              </span>
            </div>

            <p className="font-nunito text-[15px] text-zinc-400 max-w-[480px] text-left md:text-right">
              Understand the tools, choose the right workflow, and create with design intent.
            </p>
          </div>
        </div>

        {/* Bottom Copyright Bar in #191d1d */}
        <div className="w-full bg-[#191d1d] py-6 border-t border-white/5">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 font-nunito text-[14px] text-zinc-500">
            <p>
              &copy; 2026 Affinity Academy &mdash; All rights reserved.
            </p>

            <p className="font-nunito text-xs text-zinc-500">Phạm vi công cụ và phiên bản được cập nhật theo tiến độ kiểm chứng của giáo trình.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
