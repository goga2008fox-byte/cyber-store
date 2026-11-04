import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { COMPLIMENTS, REASONS_100 } from './data/romanticData';

export default function App() {
  const [currentCompliment, setCurrentCompliment] = useState(COMPLIMENTS[0]);
  const [openedReason, setOpenedReason] = useState(null);
  const [pulseCount, setPulseCount] = useState(0);

  const getNewCompliment = () => {
    const random = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
    setCurrentCompliment(random);
  };

  const getNewReason = () => {
    const random = REASONS_100[Math.floor(Math.random() * REASONS_100.length)];
    setOpenedReason(random);
  };

  // Варианты анимаций появления при скролле
  const fadeInUp = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div style={{ background: 'radial-gradient(circle at 50% 20%, #1A0A10 0%, #050505 80%)' }}>

      {/* СЕКЦИЯ 1: Обложка с 3D Сердцем */}
      <section className="scroll-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={fadeInUp}
          style={{ textAlign: 'center' }}
        >
          <motion.img 
            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Love-You%20Gesture.png" 
            alt="3D Love"
            className="emoji-3d"
            animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            style={{ marginBottom: '20px' }}
          />

          <h1 className="title-cinzel" style={{ fontSize: '32px', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>
            Ксюша
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '280px', margin: '0 auto 30px', lineHeight: 1.6 }}>
            Интерактивное пространство, созданное специально для тебя.
          </p>

          <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ fontSize: '12px', color: 'var(--accent-crimson)', letterSpacing: '2px', fontWeight: 600 }}
          >
            ЛИСТАЙ ВНИЗ ↓
          </motion.div>
        </motion.div>
      </section>

      {/* СЕКЦИЯ 2: Генератор Фактов / Комплиментов */}
      <section className="scroll-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={fadeInUp}
          className="glass-card"
          style={{ padding: '36px 24px', maxWidth: '400px', width: '100%', textAlign: 'center' }}
        >
          <img 
            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Star-Struck.png" 
            alt="3D Star"
            className="emoji-3d"
            style={{ width: '70px', height: '70px', marginBottom: '16px' }}
          />

          <h2 className="title-cinzel" style={{ fontSize: '18px', color: '#FFF', marginBottom: '16px' }}>
            Чистая Правда
          </h2>

          <p style={{ fontSize: '15px', color: '#E2E8F0', lineHeight: 1.7, minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            "{currentCompliment}"
          </p>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={getNewCompliment}
            style={{
              marginTop: '24px',
              background: 'linear-gradient(135deg, #E63946, #800020)',
              color: '#FFF',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(230, 57, 70, 0.3)'
            }}
          >
            Сгенерировать ещё ✦
          </motion.button>
        </motion.div>
      </section>

      {/* СЕКЦИЯ 3: 100 Граней (Интерактивная плавающая карточка) */}
      <section className="scroll-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={fadeInUp}
          className="glass-card"
          style={{ padding: '36px 24px', maxWidth: '400px', width: '100%', textAlign: 'center' }}
        >
          <img 
            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gem%20Stone.png" 
            alt="3D Gem"
            className="emoji-3d"
            style={{ width: '70px', height: '70px', marginBottom: '16px' }}
          />

          <h2 className="title-cinzel" style={{ fontSize: '18px', color: '#FFF', marginBottom: '16px' }}>
            Одна из 100 граней
          </h2>

          <div style={{ minHeight: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {openedReason ? (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                <span style={{ fontSize: '12px', color: 'var(--accent-crimson)', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                  {openedReason.title}
                </span>
                <p style={{ fontSize: '14px', color: '#E2E8F0', lineHeight: 1.5 }}>
                  {openedReason.text}
                </p>
              </motion.div>
            ) : (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Нажми на кнопку ниже, чтобы извлечь грань...
              </p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={getNewReason}
            style={{
              marginTop: '24px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#FFF',
              border: '1px solid var(--accent-crimson)',
              padding: '14px 28px',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Открыть случайную грань 💎
          </motion.button>
        </motion.div>
      </section>

      {/* СЕКЦИЯ 4: Интерактивный пульсатор эмоций */}
      <section className="scroll-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={fadeInUp}
          style={{ textAlign: 'center' }}
        >
          <motion.div
            whileTap={{ scale: 0.8 }}
            onClick={() => setPulseCount(prev => prev + 1)}
            style={{ cursor: 'pointer', display: 'inline-block' }}
          >
            <img 
              src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Heart%20with%20Ribbon.png" 
              alt="3D Heart"
              className="emoji-3d"
              style={{ width: '110px', height: '110px' }}
            />
          </motion.div>

          <h2 className="title-cinzel" style={{ fontSize: '20px', color: '#FFF', marginTop: '20px', marginBottom: '8px' }}>
            Отправлено импульсов: {pulseCount}
          </h2>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Нажимай на 3D-сердце, чтобы отправить виртуальный отклик ❤️
          </p>
        </motion.div>
      </section>

      {/* СЕКЦИЯ 5: Послание */}
      <section className="scroll-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={fadeInUp}
          className="glass-card"
          style={{ padding: '36px 24px', maxWidth: '400px', width: '100%', textAlign: 'center' }}
        >
          <h2 className="title-cinzel" style={{ fontSize: '22px', color: 'var(--accent-crimson)', marginBottom: '16px' }}>
            Ксюша ✨
          </h2>

          <p style={{ fontSize: '14px', color: '#E2E8F0', lineHeight: 1.8, marginBottom: '20px' }}>
            Этот сайт создавался не для громких слов, а чтобы вызвать у тебя улыбку при каждом скролле. Ты очень особенный человек, и твой юмор делает этот мир ярче.
          </p>

          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Конец первой главы 🖤
          </span>
        </motion.div>
      </section>

    </div>
  );
}