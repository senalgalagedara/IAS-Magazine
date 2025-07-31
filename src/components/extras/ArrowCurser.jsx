import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ArrowCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [showScrollText, setShowScrollText] = useState(null); // 'up' | 'down' | null

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });

      const topThreshold = screenHeight * 0.1;
      const bottomThreshold = screenHeight * 0.9;

      if (clientY < topThreshold) {
        setShowScrollText('up');
      } else if (clientY > bottomThreshold) {
        setShowScrollText('down');
      } else {
        setShowScrollText(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [screenHeight]);

  const cursorVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 },
  };

  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full pointer-events-none cursor-none"
      style={{ zIndex: 9999 }}
    >
      <AnimatePresence>
        <motion.div
          key="cursor-dot"
          style={{
            position: 'fixed',
            top: mousePosition.y - 5,
            left: mousePosition.x + 5,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={cursorVariants}
        >
          {/* Cursor dot */}
          <div
            className="w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-md shadow-black/30"
            style={{
              background: 'white',
              borderRadius: '50%',
              padding: '10px 10px',
            }}
          />

          {/* Scroll Icon + Text */}
          <AnimatePresence>
            {showScrollText && (
              <motion.div
                key={showScrollText}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={textVariants}
                style={{
                  marginTop: '8px',
                  fontSize: '14px',
                  color: '#38B6FF',
                  fontWeight: '600',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '16px' }}
                >
                  {showScrollText === 'up'
                    ? 'keyboard_arrow_up'
                    : 'keyboard_arrow_down'}
                </span>
                {showScrollText === 'up' ? 'Scroll Up' : 'Scroll Down'}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ArrowCursor;
