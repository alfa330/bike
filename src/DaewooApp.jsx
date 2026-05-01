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
   Daewoo Data
   ───────────────────────────────────────────── */

const DAEWOO_FRAME_COUNT = 298; // will be updated after extraction
const AUTO_PLAY_IDLE_MS = 5000;
const AUTO_PLAY_SPEED = 0.4;

const daewooFrames = [
  {
    kicker: "Дизайн",
    title: "Новая классика — Nexia II.",
    text: "Чистый, лаконичный силуэт без лишних деталей. Nexia II воплощает философию «ничего лишнего» — каждая линия выверена, а пропорции создают ощущение надёжности и уверенности.",
    metric: "2008",
    metricLabel: "год выпуска",
    icon: Car,
  },
  {
    kicker: "Двигатель",
    title: "SOHC 1.5 — проверен временем.",
    text: "Рядный четырёхцилиндровый двигатель объёмом 1.5 литра — образец надёжности. Простая конструкция, доступное обслуживание и ресурс, измеряемый сотнями тысяч километров.",
    metric: "85 л.с.",
    metricLabel: "мощность",
    icon: Zap,
  },
  {
    kicker: "Комфорт",
    title: "Просторнее, чем кажется.",
    text: "Удивительно вместительный салон для своего класса. Задний ряд с запасом для троих, глубокий багажник на 530 литров — Nexia II создана для реальной жизни и дальних поездок.",
    metric: "530 л",
    metricLabel: "объём багажника",
    icon: Users,
  },
  {
    kicker: "Экономичность",
    title: "Километры за копейки.",
    text: "Расход от 6.2 литров на трассе и неприхотливость к качеству топлива — Nexia II остаётся одним из самых экономичных автомобилей в своём классе. Идеальный ежедневный компаньон.",
    metric: "6.2 л",
    metricLabel: "расход на 100 км",
    icon: Fuel,
  },
];

const daewooSpecs = [
  { label: "Двигатель", value: "F15MF 1.5L SOHC", icon: Zap },
  { label: "Мощность", value: "85 л.с. / 5 400 об/мин", icon: Flame },
  { label: "Трансмиссия", value: "5-ст. МКПП / 4-ст. АКПП", icon: Settings },
  { label: "Привод", value: "Передний (FF)", icon: Shield },
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
   Daewoo App Root
   ───────────────────────────────────────────── */

export default function DaewooApp({ onBack }) {
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
    <main className="site-shell daewoo-theme">
      <DaewooLoadingScreen progress={loadProgress} />
      <button className="back-to-selector" onClick={onBack}>
        ← Назад к выбору
      </button>
      <DaewooHero />
      <DaewooScrollExperience setLoadProgress={setLoadProgress} lenisRef={lenisRef} />
      <DaewooAfterSection />
    </main>
  );
}

/* ─────────────────────────────────────────────
   Loading Screen
   ───────────────────────────────────────────── */

function DaewooLoadingScreen({ progress }) {
  return (
    <AnimatePresence>
      {progress < 100 && (
        <motion.div
          className="loading-screen daewoo-loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="loading-content">
            <div className="loading-logo daewoo-logo-pulse">
              <Sparkles size={28} />
            </div>
            <h2>Daewoo Nexia II</h2>
            <div className="loading-bar-bg">
              <div
                className="loading-bar-fill daewoo-bar"
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
   Hero — gradient-based (wet asphalt aesthetic)
   ───────────────────────────────────────────── */

function DaewooHero() {
  return (
    <section className="hero-section daewoo-hero">
      <div className="daewoo-hero-bg" />

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        <div className="hero-brand">
          <div className="hero-brand-line daewoo-line" />
          <span className="hero-brand-text">Daewoo Motors</span>
          <div className="hero-brand-line daewoo-line" />
        </div>

        <h1>
          Nexia II
          <br />
          <span className="daewoo-accent">Надёжность</span>
        </h1>

        <p className="hero-subtitle">Народный автомобиль. Проверен миллионами.</p>
        <p className="hero-desc">
          Прокручивайте страницу — откройте каждый ракурс автомобиля,
          который стал символом доступности и практичности.
        </p>

        <div className="hero-actions">
          <a href="#daewoo-experience" className="primary-btn daewoo-btn">
            <Eye size={18} />
            Смотреть
          </a>
          <span className="scroll-hint">
            <ArrowDown size={16} /> Scroll to explore
          </span>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Daewoo Scroll Experience (frame scrub)
   ───────────────────────────────────────────── */

function DaewooScrollExperience({ setLoadProgress, lenisRef }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const lastDrawnFrameRef = useRef(-1);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const progressTextRef = useRef(null);
  const glowRef = useRef(null);

  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayTimerRef = useRef(null);
  const autoPlayRafRef = useRef(null);
  const isUserInteractingRef = useRef(false);

  const activeFrame = daewooFrames[activeIndex];
  const ActiveIcon = activeFrame.icon;

  // ── Preload frames ──
  useLayoutEffect(() => {
    const images = [];
    let loadedCount = 0;

    const onReady = () => {
      loadedCount++;
      const pct = Math.min(100, Math.round((loadedCount / DAEWOO_FRAME_COUNT) * 100));
      setLoadProgress(pct);
    };

    for (let i = 1; i <= DAEWOO_FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/daewoo-frames/frame-${String(i).padStart(4, "0")}.webp`;
      img.decode().then(onReady).catch(onReady);
      images.push(img);
    }
    imagesRef.current = images;
  }, [setLoadProgress]);

  // ── Canvas + ScrollTrigger ──
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

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

    const updateFrame = (scrollProgress) => {
      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${Math.round(scrollProgress * 100)}%`;
      }

      if (glowRef.current) {
        const intensity = 0.15 + scrollProgress * 0.3;
        glowRef.current.style.opacity = String(intensity);
      }

      const frameIndex = Math.min(
        DAEWOO_FRAME_COUNT - 1,
        Math.round(scrollProgress * (DAEWOO_FRAME_COUNT - 1))
      );
      drawFrame(frameIndex);

      const nextIndex = Math.min(
        daewooFrames.length - 1,
        Math.floor(scrollProgress * daewooFrames.length)
      );
      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      }
    };

    const firstImg = imagesRef.current[0];
    if (firstImg) {
      if (firstImg.complete) {
        drawFrame(0);
      } else {
        firstImg.addEventListener("load", () => drawFrame(0), { once: true });
      }
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${window.innerHeight * (window.innerWidth <= 768 ? 3 : 4)}`,
      scrub: window.innerWidth <= 768 ? 0.5 : 0.8,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => updateFrame(self.progress),
    });

    const onResize = () => {
      updateCanvasSize();
      lastDrawnFrameRef.current = -1;
      trigger.refresh();
    };

    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      trigger.kill();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // ── Auto-play idle mode ──
  const startAutoPlay = useCallback(() => {
    if (isUserInteractingRef.current) return;
    setIsAutoPlaying(true);

    const step = () => {
      if (isUserInteractingRef.current) {
        setIsAutoPlaying(false);
        return;
      }
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

    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
    }

    setTimeout(() => {
      isUserInteractingRef.current = false;
    }, 200);

    autoPlayTimerRef.current = setTimeout(() => {
      if (!isUserInteractingRef.current) {
        startAutoPlay();
      }
    }, AUTO_PLAY_IDLE_MS);
  }, [startAutoPlay, stopAutoPlay]);

  useEffect(() => {
    const events = ["wheel", "touchstart", "touchmove", "mousedown", "keydown"];
    events.forEach((evt) =>
      window.addEventListener(evt, resetIdleTimer, { passive: true })
    );

    autoPlayTimerRef.current = setTimeout(() => {
      if (!isUserInteractingRef.current) startAutoPlay();
    }, AUTO_PLAY_IDLE_MS);

    const onVisibility = () => {
      if (document.hidden) {
        stopAutoPlay();
      } else {
        resetIdleTimer();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, resetIdleTimer));
      document.removeEventListener("visibilitychange", onVisibility);
      stopAutoPlay();
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [resetIdleTimer, startAutoPlay, stopAutoPlay]);

  return (
    <section id="daewoo-experience" ref={sectionRef} className="bike-stage daewoo-stage">
      <div className="video-background">
        <div className="video-glow-fullscreen daewoo-glow" ref={glowRef} />
        <canvas ref={canvasRef} className="bike-canvas" />
        <div className="video-overlay-gradient" />

        <div className="particles-container">
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle daewoo-particle"
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

      <AnimatePresence>
        {isAutoPlaying && (
          <motion.div
            className="autoplay-badge"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <span className="pulse-dot daewoo-pulse" />
            Авто-просмотр
          </motion.div>
        )}
      </AnimatePresence>

      <div className="stage-overlay">
        <div className="copy-panel">
          <div className="panel-topline">
            <span>Nexia II</span>
            <span className="progress-indicator" ref={progressTextRef}>
              0%
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="story-card daewoo-card"
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="story-kicker daewoo-kicker">
                <ActiveIcon size={16} /> {activeFrame.kicker}
              </div>
              <h2>{activeFrame.title}</h2>
              <p>{activeFrame.text}</p>
              <div className="metric-row">
                <strong>{activeFrame.metric}</strong>
                <span>{activeFrame.metricLabel}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="step-dots" aria-label="Этапы просмотра">
            {daewooFrames.map((item, index) => (
              <button
                key={item.kicker}
                className={index === activeIndex ? "dot active daewoo-dot-active" : "dot"}
                aria-label={item.kicker}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   After Section — specs
   ───────────────────────────────────────────── */

function DaewooAfterSection() {
  return (
    <section className="after-section daewoo-after">
      <div className="daewoo-after-bg" />

      <motion.div
        className="after-card daewoo-after-card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="after-label daewoo-after-label">
          <Flame size={16} /> Характеристики
        </span>
        <h2>Надёжность, проверенная дорогами.</h2>
        <p>
          Daewoo Nexia II — автомобиль, который не пытается быть чем-то большим,
          чем он есть. Честный, надёжный и неприхотливый. Миллионы владельцев
          по всему миру доверяют ему каждый день.
        </p>

        <div className="spec-grid">
          {daewooSpecs.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                className="spec-card daewoo-spec"
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div>
                  <Icon size={20} className="spec-icon daewoo-spec-icon" />
                  <span>{item.label}</span>
                </div>
                <strong>{item.value}</strong>
              </motion.div>
            );
          })}
        </div>

        <div className="cta-row">
          <button className="cta-btn cta-btn-primary daewoo-cta-primary">
            Подробнее <ChevronRight size={18} />
          </button>
          <button className="cta-btn cta-btn-secondary daewoo-cta-secondary">
            Все характеристики
          </button>
        </div>
      </motion.div>
    </section>
  );
}
