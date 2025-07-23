'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ArrowCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const arrowVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 },
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full pointer-events-none cursor-none"
      style={{ zIndex: 9999 }}
    >
      <AnimatePresence>
        <motion.div
          key="down-arrow"
          style={{
            position: 'fixed',
            top: mousePosition.y - 25,
            left: mousePosition.x + 15,
            zIndex: 9999,
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={arrowVariants}
        >
          <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-md shadow-black/30"
          style={{ background: 'white', borderRadius: '50%' ,padding: '7px 10px' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="5 12 12 19 19 12" />
            </svg>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ArrowCursor;
