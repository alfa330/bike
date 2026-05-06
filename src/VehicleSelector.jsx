import React, { useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const VIDEO_SOURCES = [
  "/bike-scrub.mp4",
  "/Nissan_silvi_start.mp4",
  "/Daewoo Nexia II.mp4",
];

export default function VehicleSelector({ onSelect }) {
  const [readyCount, setReadyCount] = useState(0);
  const readySet = useRef(new Set());

  const handleVideoReady = useCallback((src) => {
    if (readySet.current.has(src)) return;
    readySet.current.add(src);
    setReadyCount(readySet.current.size);
  }, []);

  const allReady = readyCount >= VIDEO_SOURCES.length;
  const progress = Math.round((readyCount / VIDEO_SOURCES.length) * 100);

  return (
    <div className="selector-screen">
      <div className="selector-bg-noise" />

      {/* Loading overlay */}
      <AnimatePresence>
        {!allReady && (
          <motion.div
            className="loading-screen selector-loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <div className="loading-content">
              <div className="loading-logo">
                <Sparkles size={28} />
              </div>
              <h2>Загрузка</h2>
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

      <motion.div
        className="selector-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: allReady ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <motion.h1
          className="selector-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Выберите легенду
        </motion.h1>
        <motion.p
          className="selector-subtitle"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Четыре мира. Одна страсть к машинам.
        </motion.p>

        <div className="selector-cards selector-cards-4">
          {/* Honda Card */}
          <motion.button
            className="selector-card honda-select-card"
            onClick={() => onSelect("honda")}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="selector-card-bg honda-card-bg">
              <video
                src="/bike-scrub.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="selector-card-video"
                onCanPlayThrough={() => handleVideoReady("/bike-scrub.mp4")}
              />
              <div className="selector-card-overlay" />
            </div>
            <div className="selector-card-content">
              <span className="selector-card-brand">Honda Racing</span>
              <h2 className="selector-card-name">
                CBR1000RR-R
                <br />
                <span className="honda-accent-text">Fireblade</span>
              </h2>
              <p className="selector-card-desc">
                998cc рядная четвёрка. 214 л.с. Рождён на треке MotoGP.
              </p>
              <div className="selector-card-cta">
                <span className="selector-card-btn honda-btn-accent">Открыть</span>
              </div>
            </div>
          </motion.button>

          {/* Nissan Card */}
          <motion.button
            className="selector-card nissan-select-card"
            onClick={() => onSelect("nissan")}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="selector-card-bg nissan-card-bg">
              <video
                src="/Nissan_silvi_start.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="selector-card-video"
                onCanPlayThrough={() => handleVideoReady("/Nissan_silvi_start.mp4")}
              />
              <div className="selector-card-overlay nissan-overlay" />
            </div>
            <div className="selector-card-content">
              <span className="selector-card-brand">Nissan Motorsport</span>
              <h2 className="selector-card-name">
                Silvia S15
                <br />
                <span className="nissan-accent-text">Spec-R</span>
              </h2>
              <p className="selector-card-desc">
                SR20DET Turbo. 250 л.с. Легенда дрифта.
              </p>
              <div className="selector-card-cta">
                <span className="selector-card-btn nissan-btn-accent">Открыть</span>
              </div>
            </div>
          </motion.button>

          {/* Daewoo Card */}
          <motion.button
            className="selector-card daewoo-select-card"
            onClick={() => onSelect("daewoo")}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="selector-card-bg daewoo-card-bg">
              <video
                src="/Daewoo Nexia II.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="selector-card-video"
                onCanPlayThrough={() => handleVideoReady("/Daewoo Nexia II.mp4")}
              />
              <div className="selector-card-overlay daewoo-overlay" />
            </div>
            <div className="selector-card-content">
              <span className="selector-card-brand">Daewoo Motors</span>
              <h2 className="selector-card-name">
                Nexia II
                <br />
                <span className="daewoo-accent-text">Надёжность</span>
              </h2>
              <p className="selector-card-desc">
                1.5L SOHC. 85 л.с. Народный автомобиль.
              </p>
              <div className="selector-card-cta">
                <span className="selector-card-btn daewoo-btn-accent">Открыть</span>
              </div>
            </div>
          </motion.button>

          {/* LADA Card — static photo preview */}
          <motion.button
            className="selector-card lada-select-card"
            onClick={() => onSelect("lada")}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="selector-card-bg lada-card-bg">
              <img
                src="/LADA 2107 2003.png"
                alt="LADA 2107 2003"
                className="selector-card-video lada-card-photo"
              />
              <div className="selector-card-overlay lada-overlay" />
            </div>
            <div className="selector-card-content">
              <span className="selector-card-brand">АвтоВАЗ • 2003</span>
              <h2 className="selector-card-name">
                LADA 2107
                <br />
                <span className="lada-accent-text">Легенда</span>
              </h2>
              <p className="selector-card-desc">
                1.5L OHV. 72 л.с. Советская классика на века.
              </p>
              <div className="selector-card-cta">
                <span className="selector-card-btn lada-btn-accent">Открыть</span>
              </div>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
