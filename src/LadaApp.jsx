import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  ArrowDown,
  Car,
  ChevronRight,
  Eye,
  Flame,
  Fuel,
  Gauge,
  Settings,
  Shield,
  Sparkles,
  Users,
  Wind,
  Zap,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   LADA Data
   ───────────────────────────────────────────── */

const LADA_FRAME_COUNT = 476;
const AUTO_PLAY_IDLE_MS = 5000;
const AUTO_PLAY_SPEED = 0.4;

// Block 1: intro text slides (frame stays static as bg)
const ladaIntroSlides = [
  {
    kicker: "LADA 2107",
    title: "Классика советского автопрома.",
    text: "LADA 2107 — последний представитель «семёрочного» ряда ВАЗ. Элегантный облик, проверенная механика и неприхотливость сделали её народным любимцем на десятилетия.",
    metric: "2003",
    metricLabel: "год выпуска",
    icon: Car,
  },
];

// Block 2: scroll frames with info (like other cars)
const ladaScrollFrames = [
  {
    kicker: "Дизайн",
    title: "Вечная классика.",
    text: "Строгий кузов «седан» с хромированными деталями и вертикальной оптикой — LADA 2107 сохраняла европейский лоск в самые непростые годы. Её силуэт не спутать ни с чем.",
    metric: "1982",
    metricLabel: "начало производства",
    icon: Car,
  },
  {
    kicker: "Двигатель",
    title: "1.5 — проверен тысячами дорог.",
    text: "Рядный четырёхцилиндровый карбюраторный двигатель объёмом 1.5 литра. Ремонтопригодность на уровне — в полевых условиях справится любой владелец с базовым набором инструментов.",
    metric: "72 л.с.",
    metricLabel: "мощность",
    icon: Zap,
  },
  {
    kicker: "Комфорт",
    title: "Просто и надёжно.",
    text: "Просторный по меркам класса салон, удобная посадка и практичный багажник. LADA 2107 создана для реальных дорог и настоящей жизни — без лишних излишеств.",
    metric: "340 л",
    metricLabel: "объём багажника",
    icon: Users,
  },
  {
    kicker: "Экономичность",
    title: "Километры за копейки.",
    text: "Расход от 7.5 литров на 100 км и совместимость с любым топливом — семёрка по сей день остаётся одним из самых доступных в эксплуатации автомобилей на дорогах СНГ.",
    metric: "7.5 л",
    metricLabel: "расход на 100 км",
    icon: Fuel,
  },
];

// Block 3: final specs
const ladaSpecs = [
  { label: "Двигатель", value: "ВАЗ-2107 1.5L OHV", icon: Zap },
  { label: "Мощность", value: "72 л.с. / 5 400 об/мин", icon: Flame },
  { label: "Трансмиссия", value: "4/5-ст. МКПП", icon: Settings },
  { label: "Привод", value: "Задний (FR)", icon: Shield },
];

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  dx: `${(Math.random() - 0.5) * 120}px`,
  dy: `${-40 - Math.random() * 80}px`,
  duration: `${4 + Math.random() * 6}s`,
  delay: `${Math.random() * 5}s`,
  size: `${2 + Math.random() * 3}px`,
}));

/* ─────────────────────────────────────────────
   LADA App Root
   ───────────────────────────────────────────── */

export default function LadaApp({ onBack }) {
  const [loadProgress, setLoadProgress] = useState(0);
  const lenisRef = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const lenis = new Lenis({
      duration: isMobile ? 1.0 : 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: isMobile ? 2 : 1.5,
    });

    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <main className="site-shell lada-theme">
      <LadaLoadingScreen progress={loadProgress} />
      <button className="back-to-selector" onClick={onBack}>
        ← Назад к выбору
      </button>
      <LadaScrollExperience setLoadProgress={setLoadProgress} lenisRef={lenisRef} />
    </main>
  );
}

/* ─────────────────────────────────────────────
   Loading Screen
   ───────────────────────────────────────────── */

function LadaLoadingScreen({ progress }) {
  return (
    <AnimatePresence>
      {progress < 100 && (
        <motion.div
          className="loading-screen lada-loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="loading-content">
            <div className="loading-logo lada-logo-pulse">
              <Sparkles size={28} />
            </div>
            <h2>LADA 2107 • 2003</h2>
            <div className="loading-bar-bg">
              <div
                className="loading-bar-fill lada-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="loading-text">{progress}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   LADA Scroll Experience — 3 Blocks
   ───────────────────────────────────────────── */

function LadaScrollExperience({ setLoadProgress }) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const lastDrawnFrameRef = useRef(-1);

  // Block states
  const [block, setBlock] = useState(1); // 1, 2, 3
  const [scrollFrameIndex, setScrollFrameIndex] = useState(0); // for block 2
  const [introVisible, setIntroVisible] = useState(true);
  const [finalBlur, setFinalBlur] = useState(0); // 0..1 for block 3 blur

  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayTimerRef = useRef(null);
  const autoPlayRafRef = useRef(null);
  const isUserInteractingRef = useRef(false);
  const progressTextRef = useRef(null);
  const glowRef = useRef(null);

  // Preload frames
  useLayoutEffect(() => {
    const images = new Array(LADA_FRAME_COUNT);
    let loadedCount = 0;
    let cancelled = false;
    const BATCH = 8;

    const onReady = () => {
      loadedCount++;
      const pct = Math.min(100, Math.round((loadedCount / LADA_FRAME_COUNT) * 100));
      setLoadProgress(pct);
    };

    async function loadBatches() {
      for (let b = 0; b < LADA_FRAME_COUNT && !cancelled; b += BATCH) {
        const batch = [];
        for (let i = b; i < Math.min(b + BATCH, LADA_FRAME_COUNT); i++) {
          const img = new Image();
          img.src = `/lada-frames/frame-${String(i + 1).padStart(4, "0")}.webp`;
          images[i] = img;
          batch.push(img.decode().then(onReady).catch(onReady));
        }
        await Promise.all(batch);
      }
    }

    imagesRef.current = images;
    loadBatches();

    return () => { cancelled = true; };
  }, [setLoadProgress]);

  // Canvas setup
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });

    const updateCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateCanvasSize();

    const drawFrame = (frameIndex) => {
      if (frameIndex === lastDrawnFrameRef.current) return;
      const img = imagesRef.current[frameIndex];
      if (img && img.complete && img.naturalWidth > 0) {
        const cw = canvas.width / Math.min(window.devicePixelRatio || 1, 2);
        const ch = canvas.height / Math.min(window.devicePixelRatio || 1, 2);
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = cw / ch;
        let sw, sh, sx, sy;

        if (imgRatio > canvasRatio) {
          sh = img.naturalHeight;
          sw = sh * canvasRatio;
          sx = (img.naturalWidth - sw) / 2;
          sy = 0;
        } else {
          sw = img.naturalWidth;
          sh = sw / canvasRatio;
          sx = 0;
          sy = (img.naturalHeight - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
        lastDrawnFrameRef.current = frameIndex;
      }
    };

    // Expose drawFrame for scroll handler
    canvasRef.drawFrame = drawFrame;

    const firstImg = imagesRef.current[0];
    if (firstImg) {
      if (firstImg.complete) drawFrame(0);
      else firstImg.addEventListener("load", () => drawFrame(0), { once: true });
    }

    const onResize = () => {
      updateCanvasSize();
      lastDrawnFrameRef.current = -1;
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ScrollTrigger setup
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Block 1: text scrolls away, frame stays (pinned full viewport × 1.5)
    // Block 2: frames scroll (pinned full viewport × 4)  
    // Block 3: last frame blurs, info fades in (pinned full viewport × 2)

    const vh = window.innerHeight;
    const isMobile = window.innerWidth <= 768;

    // Block thresholds (scroll pixels from wrapper top)
    const block1End = vh * 1.5;
    const block2End = block1End + vh * (isMobile ? 3 : 4);
    const block3End = block2End + vh * 2;

    // Frame ranges per block
    const block2FrameStart = 0;
    const block2FrameEnd = LADA_FRAME_COUNT - 1;

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: () => `+=${block3End}`,
      scrub: isMobile ? 0.5 : 0.8,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const scrollPx = progress * block3End;

        // ── BLOCK 1 ──
        if (scrollPx <= block1End) {
          setBlock(1);
          const b1Progress = scrollPx / block1End;
          // Fade out intro text as user scrolls (frame stays at frame 0)
          setIntroVisible(b1Progress < 0.7);
          if (canvasRef.drawFrame) canvasRef.drawFrame(0);
          if (progressTextRef.current)
            progressTextRef.current.textContent = `${Math.round(b1Progress * 100)}%`;

        // ── BLOCK 2 ──
        } else if (scrollPx <= block2End) {
          setBlock(2);
          setIntroVisible(false);
          const b2Progress = (scrollPx - block1End) / (block2End - block1End);
          const frameIndex = Math.min(
            LADA_FRAME_COUNT - 1,
            Math.round(b2Progress * (LADA_FRAME_COUNT - 1))
          );
          if (canvasRef.drawFrame) canvasRef.drawFrame(frameIndex);
          if (glowRef.current) {
            glowRef.current.style.opacity = String(0.15 + b2Progress * 0.3);
          }
          // update info panel index
          const nextIdx = Math.min(
            ladaScrollFrames.length - 1,
            Math.floor(b2Progress * ladaScrollFrames.length)
          );
          setScrollFrameIndex(nextIdx);
          if (progressTextRef.current)
            progressTextRef.current.textContent = `${Math.round(b2Progress * 100)}%`;

        // ── BLOCK 3 ──
        } else {
          setBlock(3);
          setIntroVisible(false);
          const b3Progress = (scrollPx - block2End) / (block3End - block2End);
          // Keep last frame
          if (canvasRef.drawFrame) canvasRef.drawFrame(LADA_FRAME_COUNT - 1);
          // Blur increases 0 → 1
          setFinalBlur(Math.min(1, b3Progress * 2));
          if (progressTextRef.current)
            progressTextRef.current.textContent = "100%";
        }
      },
    });

    return () => trigger.kill();
  }, []);

  // Auto-play
  const startAutoPlay = useCallback(() => {
    if (isUserInteractingRef.current) return;
    setIsAutoPlaying(true);
    const step = () => {
      if (isUserInteractingRef.current) { setIsAutoPlaying(false); return; }
      window.scrollBy({ top: AUTO_PLAY_SPEED, behavior: "instant" });
      autoPlayRafRef.current = requestAnimationFrame(step);
    };
    autoPlayRafRef.current = requestAnimationFrame(step);
  }, []);

  const stopAutoPlay = useCallback(() => {
    setIsAutoPlaying(false);
    if (autoPlayRafRef.current) {
      cancelAnimationFrame(autoPlayRafRef.current);
      autoPlayRafRef.current = null;
    }
  }, []);

  const resetIdleTimer = useCallback(() => {
    isUserInteractingRef.current = true;
    stopAutoPlay();
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    setTimeout(() => { isUserInteractingRef.current = false; }, 200);
    autoPlayTimerRef.current = setTimeout(() => {
      if (!isUserInteractingRef.current) startAutoPlay();
    }, AUTO_PLAY_IDLE_MS);
  }, [startAutoPlay, stopAutoPlay]);

  useEffect(() => {
    const events = ["wheel", "touchstart", "touchmove", "mousedown", "keydown"];
    events.forEach((evt) => window.addEventListener(evt, resetIdleTimer, { passive: true }));
    autoPlayTimerRef.current = setTimeout(() => {
      if (!isUserInteractingRef.current) startAutoPlay();
    }, AUTO_PLAY_IDLE_MS);
    const onVisibility = () => {
      if (document.hidden) stopAutoPlay();
      else resetIdleTimer();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      events.forEach((evt) => window.removeEventListener(evt, resetIdleTimer));
      document.removeEventListener("visibilitychange", onVisibility);
      stopAutoPlay();
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [resetIdleTimer, startAutoPlay, stopAutoPlay]);

  const activeScrollFrame = ladaScrollFrames[scrollFrameIndex];
  const ActiveScrollIcon = activeScrollFrame.icon;

  return (
    <section id="lada-experience" ref={wrapperRef} className="bike-stage lada-stage">
      {/* Canvas background — always present */}
      <div className="video-background">
        <div className="video-glow-fullscreen lada-glow" ref={glowRef} />

        {/* Canvas with blur overlay for block 3 */}
        <div className="lada-canvas-wrap">
          <canvas ref={canvasRef} className="bike-canvas" />
          {/* Blur overlay (block 3) */}
          <div
            className="lada-blur-overlay"
            style={{ opacity: block === 3 ? finalBlur : 0 }}
          />
        </div>

        <div className="video-overlay-gradient" />

        <div className="particles-container">
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle lada-particle"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                "--dx": p.dx,
                "--dy": p.dy,
                "--duration": p.duration,
                "--delay": p.delay,
              }}
            />
          ))}
        </div>
      </div>

      {/* Auto-play badge */}
      <AnimatePresence>
        {isAutoPlaying && (
          <motion.div
            className="autoplay-badge"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <span className="pulse-dot lada-pulse" />
            Авто-просмотр
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BLOCK 1: Hero intro text that scrolls away ── */}
      <AnimatePresence>
        {block === 1 && (
          <motion.div
            className="lada-block1-overlay"
            initial={{ opacity: 1, y: 0 }}
            animate={{
              opacity: introVisible ? 1 : 0,
              y: introVisible ? 0 : -60,
            }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="lada-hero-content">
              <div className="hero-brand">
                <div className="hero-brand-line lada-line" />
                <span className="hero-brand-text">АвтоВАЗ • Тольятти</span>
                <div className="hero-brand-line lada-line" />
              </div>

              <h1 className="lada-hero-title">
                LADA 2107
                <br />
                <span className="lada-accent">Легенда</span>
              </h1>

              <p className="hero-subtitle">Народный автомобиль. Сделан на века.</p>
              <p className="hero-desc">
                Прокручивайте страницу — семёрка раскрывает свой характер. Простота,
                надёжность и особый советский шарм.
              </p>

              <div className="hero-actions">
                <span className="scroll-hint">
                  <ArrowDown size={16} /> Scroll to explore
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BLOCK 2: Frame scroll + info panel left ── */}
      <AnimatePresence>
        {block === 2 && (
          <motion.div
            className="stage-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="copy-panel">
              <div className="panel-topline">
                <span>LADA 2107</span>
                <span className="progress-indicator" ref={progressTextRef}>0%</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={scrollFrameIndex}
                  className="story-card lada-card"
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="story-kicker lada-kicker">
                    <ActiveScrollIcon size={16} /> {activeScrollFrame.kicker}
                  </div>
                  <h2>{activeScrollFrame.title}</h2>
                  <p>{activeScrollFrame.text}</p>
                  <div className="metric-row">
                    <strong>{activeScrollFrame.metric}</strong>
                    <span>{activeScrollFrame.metricLabel}</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="step-dots" aria-label="Этапы просмотра">
                {ladaScrollFrames.map((item, index) => (
                  <button
                    key={item.kicker}
                    className={index === scrollFrameIndex ? "dot active lada-dot-active" : "dot"}
                    aria-label={item.kicker}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BLOCK 3: Last frame blurred + final info ── */}
      <AnimatePresence>
        {block === 3 && (
          <motion.div
            className="lada-block3-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: finalBlur > 0.3 ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="lada-final-card">
              <span className="after-label lada-after-label">
                <Flame size={16} /> Характеристики
              </span>
              <h2>Легенда, которая не нуждается в представлении.</h2>
              <p>
                LADA 2107 — последний заднеприводный седан АвтоВАЗа, выпускавшийся
                с 1982 по 2012 год. Простая конструкция, доступное обслуживание
                и особый советский характер сделали её культовым автомобилем.
              </p>

              <div className="lada-specs-inline">
                {ladaSpecs.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      className="lada-spec-item"
                      key={item.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Icon size={16} className="lada-spec-icon-inline" />
                      <span className="lada-spec-label">{item.label}</span>
                      <strong className="lada-spec-value">{item.value}</strong>
                    </motion.div>
                  );
                })}
              </div>

              <div className="cta-row" style={{ marginTop: "1.5rem" }}>
                <button className="cta-btn cta-btn-primary lada-cta-primary">
                  Подробнее <ChevronRight size={18} />
                </button>
                <button className="cta-btn cta-btn-secondary lada-cta-secondary">
                  Все характеристики
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
