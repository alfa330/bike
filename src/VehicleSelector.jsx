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
          Три мира. Одна страсть к машинам.
        </motion.p>

        <div className="selector-cards selector-cards-3">
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
                className="selector-card-video"
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
        </div>
      </motion.div>
    </div>
  );
}
