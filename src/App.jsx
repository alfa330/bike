import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  ArrowDown,
  Bike,
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
import VehicleSelector from "./VehicleSelector";
import NissanApp from "./NissanApp";
import DaewooApp from "./DaewooApp";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   Data
   ───────────────────────────────────────────── */

const FRAME_COUNT = 298;
const AUTO_PLAY_IDLE_MS = 5000;
const AUTO_PLAY_SPEED = 0.4; // px per frame at 60fps

const frames = [
  {
    kicker: "Боковой профиль",
    title: "Агрессия в каждой линии.",
    text: "Низкая посадка, вытянутый силуэт и хищная геометрия — CBR1000RR-R создаёт ощущение скорости даже в статике. Каждый изгиб продиктован аэродинамикой трека.",
    metric: "0°",
    metricLabel: "профиль",
    icon: Bike,
  },
  {
    kicker: "Аэродинамика",
    title: "Каждая поверхность режет воздух.",
    text: "Winglet-крылья, интегрированные воздухозаборники и обтекатели работают как единая система. Коэффициент аэродинамического сопротивления — результат тысяч часов в аэротрубе.",
    metric: "Cd 0.30",
    metricLabel: "коэфф. сопротивления",
    icon: Wind,
  },
  {
    kicker: "Силовая установка",
    title: "998cc — четырёхцилиндровый зверь.",
    text: "Рядная четвёрка с технологиями прямиком из MotoGP. Титановые шатуны, пальчиковые толкатели и система впуска с изменяемой геометрией.",
    metric: "214 л.с.",
    metricLabel: "максимальная мощность",
    icon: Zap,
  },
  {
    kicker: "Фронтальный вид",
    title: "Лицо, от которого не оторвать взгляд.",
    text: "Светодиодная оптика с DRL, центральный воздухозаборник и агрессивный профиль — фронтальный вид CBR1000RR-R узнаётся мгновенно.",
    metric: "90°",
    metricLabel: "фронт",
    icon: Gauge,
  },
];

const specs = [
  { label: "Двигатель", value: "998cc рядная четвёрка", icon: Zap },
  { label: "Мощность", value: "214 л.с. / 14 500 об/мин", icon: Flame },
  { label: "Электроника", value: "IMU 6 осей, 9 уровней TC", icon: Settings },
  { label: "Шасси", value: "Алюминиевая диагональная рама", icon: Shield },
];

/* ─────────────────────────────────────────────
   Particle data (generated once)
   ───────────────────────────────────────────── */
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
   App Root — Vehicle Selection Router
   ───────────────────────────────────────────── */

export default function App() {
  const [vehicle, setVehicle] = useState(null); // null = selector, "honda" or "nissan"

  const handleBack = useCallback(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.getAll().forEach((t) => t.kill());
    setVehicle(null);
  }, []);

  if (vehicle === null) {
    return <VehicleSelector onSelect={setVehicle} />;
  }

  if (vehicle === "nissan") {
    return <NissanApp onBack={handleBack} />;
  }

  if (vehicle === "daewoo") {
    return <DaewooApp onBack={handleBack} />;
  }

  return <HondaApp onBack={handleBack} />;
}

/* ─────────────────────────────────────────────
   Honda App (original flow)
   ───────────────────────────────────────────── */

function HondaApp({ onBack }) {
  const [loadProgress, setLoadProgress] = useState(0);
  const lenisRef = useRef(null);

  // Initialize Lenis smooth scroll
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

    // Connect Lenis → GSAP ScrollTrigger
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
    <main className="site-shell">
      <LoadingScreen progress={loadProgress} />
      <button className="back-to-selector" onClick={onBack}>
        ← Назад к выбору
      </button>
      <Hero />
      <BikeScrollExperience setLoadProgress={setLoadProgress} lenisRef={lenisRef} />
      <AfterSection />
    </main>
  );
}

/* ─────────────────────────────────────────────
   Loading Screen
   ───────────────────────────────────────────── */

function LoadingScreen({ progress }) {
  return (
    <AnimatePresence>
      {progress < 100 && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="loading-content">
            <div className="loading-logo">
              <Sparkles size={28} />
            </div>
            <h2>Honda CBR1000RR-R</h2>
            <div className="loading-bar-bg">
              <div
                className="loading-bar-fill"
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
   Hero
   ───────────────────────────────────────────── */

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-bg" />
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <div className="hero-brand">
          <div className="hero-brand-line" />
          <span className="hero-brand-text">Honda Racing</span>
          <div className="hero-brand-line" />
        </div>

        <h1>
          CBR1000RR-R
          <br />
          <span>Fireblade</span>
        </h1>

        <p className="hero-subtitle">Рождён на треке. Создан побеждать.</p>
        <p className="hero-desc">
          Прокручивайте страницу — байк плавно вращается от бокового профиля до
          фронтального вида, раскрывая характеристики на каждом этапе.
        </p>

        <div className="hero-actions">
          <a href="#bike-experience" className="primary-btn">
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
   Bike Scroll Experience
   ───────────────────────────────────────────── */

function BikeScrollExperience({ setLoadProgress, lenisRef }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const lastDrawnFrameRef = useRef(-1);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const progressTextRef = useRef(null);
  const glowRef = useRef(null);

  // Auto-play refs
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayTimerRef = useRef(null);
  const autoPlayRafRef = useRef(null);
  const isUserInteractingRef = useRef(false);

  const activeFrame = frames[activeIndex];
  const ActiveIcon = activeFrame.icon;

  // ── Preload frames ──
  useLayoutEffect(() => {
    const images = [];
    let loadedCount = 0;

    const onReady = () => {
      loadedCount++;
      const pct = Math.min(100, Math.round((loadedCount / FRAME_COUNT) * 100));
      setLoadProgress(pct);
    };

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/frames/frame-${String(i).padStart(4, "0")}.webp`;
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

    // DPR-aware sizing
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

    // Draw a frame directly — NO extra rAF wrapper (GSAP already calls on rAF)
    const drawFrame = (frameIndex) => {
      if (frameIndex === lastDrawnFrameRef.current) return; // skip redundant
      const img = imagesRef.current[frameIndex];
      if (img && img.complete && img.naturalWidth > 0) {
        const cw = canvas.width / Math.min(window.devicePixelRatio || 1, 2);
        const ch = canvas.height / Math.min(window.devicePixelRatio || 1, 2);

        // Cover-fit calculation
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
      // Update progress text via DOM (no React re-render)
      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${Math.round(scrollProgress * 100)}%`;
      }

      // Update glow intensity based on progress
      if (glowRef.current) {
        const intensity = 0.15 + scrollProgress * 0.3;
        glowRef.current.style.opacity = String(intensity);
      }

      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.round(scrollProgress * (FRAME_COUNT - 1))
      );
      drawFrame(frameIndex);

      // Update active text panel index
      const nextIndex = Math.min(
        frames.length - 1,
        Math.floor(scrollProgress * frames.length)
      );
      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      }
    };

    // Draw first frame when loaded
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

    // Handle resize
    const onResize = () => {
      updateCanvasSize();
      lastDrawnFrameRef.current = -1; // force redraw
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

    // After short delay, mark interaction as ended
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

    // Start initial idle timer
    autoPlayTimerRef.current = setTimeout(() => {
      if (!isUserInteractingRef.current) startAutoPlay();
    }, AUTO_PLAY_IDLE_MS);

    // Pause on tab hidden
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
    <section id="bike-experience" ref={sectionRef} className="bike-stage">
      {/* Video / Canvas background */}
      <div className="video-background">
        <div className="video-glow-fullscreen" ref={glowRef} />
        <canvas ref={canvasRef} className="bike-canvas" />
        <div className="video-overlay-gradient" />

        {/* Particles */}
        <div className="particles-container">
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle"
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
            <span className="pulse-dot" />
            Авто-просмотр
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay content */}
      <div className="stage-overlay">
        <div className="copy-panel">
          <div className="panel-topline">
            <span>CBR1000RR-R</span>
            <span className="progress-indicator" ref={progressTextRef}>
              0%
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="story-card"
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="story-kicker">
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
            {frames.map((item, index) => (
              <button
                key={item.kicker}
                className={index === activeIndex ? "dot active" : "dot"}
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
   After Section (Specs & CTA)
   ───────────────────────────────────────────── */

function AfterSection() {
  return (
    <section className="after-section">
      <motion.div
        className="after-card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="after-label">
          <Flame size={16} /> Характеристики
        </span>
        <h2>Технологии из MotoGP — в ваших руках.</h2>
        <p>
          CBR1000RR-R Fireblade вобрал лучшее из гоночной программы Honda.
          Каждый компонент спроектирован для максимальной производительности на
          треке и захватывающих ощущений на дороге.
        </p>

        <div className="spec-grid">
          {specs.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                className="spec-card"
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
                  <Icon size={20} className="spec-icon" />
                  <span>{item.label}</span>
                </div>
                <strong>{item.value}</strong>
              </motion.div>
            );
          })}
        </div>

        <div className="cta-row">
          <button className="cta-btn cta-btn-primary">
            Конфигурировать <ChevronRight size={18} />
          </button>
          <button className="cta-btn cta-btn-secondary">
            Все характеристики
          </button>
        </div>
      </motion.div>
    </section>
  );
}
