import { useEffect, useRef } from "react";
import cover from "./resouses/cover.jpg";
import "./styles/text.css";
import "./styles/texteffect.css";
import "./styles/pad.css";

const PARTICLE_COUNT = 200;

const TechPulseMagazine = () => {
  const headlineRef = useRef(null);

  useEffect(() => {
    const container = document.getElementById("particles-container");
    const colors = ["#00BFFF", "#6E44FF", "#00FFFF", "#FF0066"];

    const createParticle = () => {
      const p = document.createElement("div");
      p.className = "particle";
      const size = Math.random() * 3 + 1;
      const color = colors[Math.floor(Math.random() * colors.length)];

      Object.assign(p.style, {
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: "50%",
        position: "absolute",
        boxShadow: `0 0 8px ${color}, 0 0 12px ${color}`,
        pointerEvents: "none",
        zIndex: 1,
        opacity: "0"
      });

      resetParticle(p);
      container.appendChild(p);
      animateParticle(p);
    };

    const resetParticle = (p) => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      Object.assign(p.style, {
        left: `${x}%`,
        top: `${y}%`,
        opacity: "0",
      });
      return { x, y };
    };

    const animateParticle = (p) => {
      const { x, y } = resetParticle(p);
      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 5;
      setTimeout(() => {
        Object.assign(p.style, {
          transition: `all ${duration}s linear`,
          opacity: Math.random() * 0.3 + 0.1,
          left: `${x + (Math.random() * 20 - 10)}%`,
          top: `${y - Math.random() * 30}%`,
        });
        setTimeout(() => {
          p.style.opacity = "0";
        }, (duration - 1) * 1000);
        setTimeout(() => animateParticle(p), duration * 1000);
      }, delay * 1000);
    };

    Array.from({ length: PARTICLE_COUNT }, createParticle);

    // GSAP spring bounce + fade in
    gsap.from(headlineRef.current, {
      opacity: 0,
      scale: 0,
      y: -100,
      duration: 2,
      ease: "elastic.out(1, 0.4)",
      delay: 0.5
    });

    // Glitch effect
    const glitch = () => {
      const tl = gsap.timeline();
      tl.to(headlineRef.current, {
        duration: 0.05,
        x: "-3px",
        color: "#ff0066",
        fontFamily: "'Space Grotesk', sans-serif",
      })
        .to(headlineRef.current, { duration: 0.05, x: "3px" })
        .to(headlineRef.current, {
          duration: 0.05,
          x: "0px",
          color: "#00ffff",
          fontFamily: "'IBM Plex Sans', sans-serif",
        });
    };

    const interval = setInterval(glitch, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="techpulse-wrapper">
      <div className="gradient-background">
        <div className="particles-container" id="particles-container"></div>
        <ul className="bg-bubbles">
          {[...Array(10)].map((_, i) => <li key={i}></li>)}
        </ul>
      </div>

      <div className="techpulse-container">
        <div className="techpulse-content">
          <div className="image-wrapper">
            <img
              src={cover}
              alt="TechPulse Magazine Cover"
              width="300"
              height="400"
              className="magazine-image"
              loading="lazy"
            />
            <div className="glow-pad"></div>
          </div>
        </div>
        <h1 className="magazine-header gradient-text" ref={headlineRef}>
          TechPulse
        </h1>
      </div>
    </div>
  );
};

export default TechPulseMagazine;
