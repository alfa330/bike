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
  Gauge,
  Settings,
  Shield,
  Sparkles,
  Wind,
  Zap,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   Nissan Data
   ───────────────────────────────────────────── */

const NISSAN_FRAME_COUNT = 303;
const AUTO_PLAY_IDLE_MS = 5000;
const AUTO_PLAY_SPEED = 0.4;

const nissanFrames = [
  {
    kicker: "Дизайн",
    title: "Легенда дрифта — Silvia S15.",
    text: "Чистые линии, низкий силуэт и агрессивный передок — S15 стала иконой японского автоспорта. Каждый изгиб создан для идеального баланса между стилем и аэродинамикой.",
    metric: "1999",
    metricLabel: "год выпуска",
    icon: Car,
  },
  {
    kicker: "Двигатель SR20DET",
    title: "Турбо-сердце легенды.",
    text: "2.0-литровый SR20DET с турбонаддувом — один из самых легендарных моторов в истории тюнинга. Способен выдавать от 250 до 1000+ л.с. с правильными доработками.",
    metric: "250 л.с.",
    metricLabel: "стоковая мощность",
    icon: Zap,
  },
  {
    kicker: "Шасси",
    title: "Создана для заноса.",
    text: "Задний привод, идеальная развесовка 53:47 и короткая колёсная база делают S15 одним из лучших автомобилей для дрифта в мире. Многорычажная подвеска даёт невероятную обратную связь.",
    metric: "53:47",
    metricLabel: "распределение веса",
    icon: Gauge,
  },
  {
    kicker: "Аэродинамика",
    title: "Каждая линия — функциональна.",
    text: "Агрессивный передний сплиттер, расширенные крылья и спойлер работают как единая система. S15 — это не просто стиль, это аэродинамическое совершенство для трека.",
    metric: "1240 кг",
    metricLabel: "снаряжённая масса",
    icon: Wind,
  },
];

const nissanSpecs = [
  { label: "Двигатель", value: "SR20DET 2.0L Turbo", icon: Zap },
  { label: "Мощность", value: "250 л.с. / 6 400 об/мин", icon: Flame },
  { label: "Трансмиссия", value: "6-ст. МКПП / 4-ст. АКПП", icon: Settings },
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
   Nissan App Root
   ───────────────────────────────────────────── */

export default function NissanApp({ onBack }) {
  const [loadProgress, setLoadProgress] = useState(0);
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
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
    <main className="site-shell nissan-theme">
      <NissanLoadingScreen progress={loadProgress} />
      <button className="back-to-selector" onClick={onBack}>
        ← Назад к выбору
      </button>
      <NissanHero />
      <NissanScrollExperience setLoadProgress={setLoadProgress} lenisRef={lenisRef} />
      <NissanAfterSection />
    </main>
  );
}

/* ─────────────────────────────────────────────
   Loading Screen
   ───────────────────────────────────────────── */

function NissanLoadingScreen({ progress }) {
  return (
    <AnimatePresence>
      {progress < 100 && (
        <motion.div
          className="loading-screen nissan-loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="loading-content">
            <div className="loading-logo nissan-logo-pulse">
              <Sparkles size={28} />
            </div>
            <h2>Nissan Silvia S15</h2>
            <div className="loading-bar-bg">
              <div
                className="loading-bar-fill nissan-bar"
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
   Hero — full-screen video background
   ───────────────────────────────────────────── */

function NissanHero() {
  return (
    <section className="hero-section nissan-hero">
      <div className="nissan-hero-video-wrap">
        <video
          className="nissan-hero-video"
          src="/Nissan_silvi_start.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="nissan-hero-video-overlay" />
      </div>

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        <div className="hero-brand">
          <div className="hero-brand-line nissan-line" />
          <span className="hero-brand-text">Nissan Motorsport</span>
          <div className="hero-brand-line nissan-line" />
        </div>

        <h1>
          Silvia S15
          <br />
          <span className="nissan-accent">Spec-R</span>
        </h1>

        <p className="hero-subtitle">Легенда дрифта. Рождена побеждать.</p>
        <p className="hero-desc">
          Прокручивайте страницу — автомобиль раскрывается с каждым движением,
          демонстрируя легендарный дизайн и характер Silvia S15.
        </p>

        <div className="hero-actions">
          <a href="#nissan-experience" className="primary-btn nissan-btn">
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
   Nissan Scroll Experience (frame scrub)
   ───────────────────────────────────────────── */

function NissanScrollExperience({ setLoadProgress, lenisRef }) {
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

  const activeFrame = nissanFrames[activeIndex];
  const ActiveIcon = activeFrame.icon;

  // ── Preload frames ──
  useLayoutEffect(() => {
    const images = [];
    let loadedCount = 0;

    const onReady = () => {
      loadedCount++;
      const pct = Math.min(100, Math.round((loadedCount / NISSAN_FRAME_COUNT) * 100));
      setLoadProgress(pct);
    };

    for (let i = 1; i <= NISSAN_FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/nissan-frames/frame-${String(i).padStart(4, "0")}.webp`;
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
        NISSAN_FRAME_COUNT - 1,
        Math.round(scrollProgress * (NISSAN_FRAME_COUNT - 1))
      );
      drawFrame(frameIndex);

      const nextIndex = Math.min(
        nissanFrames.length - 1,
        Math.floor(scrollProgress * nissanFrames.length)
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
      end: () => `+=${window.innerHeight * 4}`,
      scrub: 0.8,
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
    <section id="nissan-experience" ref={sectionRef} className="bike-stage nissan-stage">
      <div className="video-background">
        <div className="video-glow-fullscreen nissan-glow" ref={glowRef} />
        <canvas ref={canvasRef} className="bike-canvas" />
        <div className="video-overlay-gradient" />

        <div className="particles-container">
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle nissan-particle"
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
            <span className="pulse-dot nissan-pulse" />
            Авто-просмотр
          </motion.div>
        )}
      </AnimatePresence>

      <div className="stage-overlay">
        <div className="copy-panel">
          <div className="panel-topline">
            <span>Silvia S15</span>
            <span className="progress-indicator" ref={progressTextRef}>
              0%
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="story-card nissan-card"
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="story-kicker nissan-kicker">
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
            {nissanFrames.map((item, index) => (
              <button
                key={item.kicker}
                className={index === activeIndex ? "dot active nissan-dot-active" : "dot"}
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
   After Section — end video + specs
   ───────────────────────────────────────────── */

function NissanAfterSection() {
  return (
    <section className="after-section nissan-after">
      <div className="nissan-end-video-wrap">
        <video
          className="nissan-end-video"
          src="/Nissan_silvi_end.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="nissan-end-video-overlay" />
      </div>

      <motion.div
        className="after-card nissan-after-card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="after-label nissan-after-label">
          <Flame size={16} /> Конфигурация
        </span>
        <h2>Легенда, которая не нуждается в представлении.</h2>
        <p>
          Nissan Silvia S15 Spec-R — воплощение японской автомобильной культуры.
          Идеальная платформа для дрифта, тайм-атаки или просто удовольствия
          за рулём. Мотор SR20DET — один из самых тюнингуемых в истории.
        </p>

        <div className="spec-grid">
          {nissanSpecs.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                className="spec-card nissan-spec"
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
                  <Icon size={20} className="spec-icon nissan-spec-icon" />
                  <span>{item.label}</span>
                </div>
                <strong>{item.value}</strong>
              </motion.div>
            );
          })}
        </div>

        <div className="cta-row">
          <button className="cta-btn cta-btn-primary nissan-cta-primary">
            Конфигурировать <ChevronRight size={18} />
          </button>
          <button className="cta-btn cta-btn-secondary nissan-cta-secondary">
            Все характеристики
          </button>
        </div>
      </motion.div>
    </section>
  );
}
