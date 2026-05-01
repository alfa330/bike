import React from "react";
import { motion } from "framer-motion";

export default function VehicleSelector({ onSelect }) {
  return (
    <div className="selector-screen">
      <div className="selector-bg-noise" />

      <motion.div
        className="selector-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
          Два мира. Одна страсть к скорости.
        </motion.p>

        <div className="selector-cards">
          {/* Honda Card */}
          <motion.button
            className="selector-card honda-select-card"
            onClick={() => onSelect("honda")}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
                className="selector-card-video"
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

          {/* Divider */}
          <motion.div
            className="selector-divider"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.6, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="selector-vs">VS</span>
          </motion.div>

          {/* Nissan Card */}
          <motion.button
            className="selector-card nissan-select-card"
            onClick={() => onSelect("nissan")}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
                className="selector-card-video"
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
        </div>
      </motion.div>
    </div>
  );
}
