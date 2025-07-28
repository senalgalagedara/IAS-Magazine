import React, { useLayoutEffect, useRef } from "react";
import "./styles/HeroText.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MagazineDescription = () => {
  const paragraphsRef = useRef([]);

  const splitTextToWords = (text) =>
    text.split(" ").map((word, i) => (
      <span key={i} className="word">{word}&nbsp;</span>
    ));

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      paragraphsRef.current.forEach((paragraph) => {
        const words = paragraph.querySelectorAll(".word");

        gsap.set(words, { opacity: 0, y: 30 });

        ScrollTrigger.create({
          trigger: paragraph,
          start: "top 80%",
          end: "top 20%", // range of scroll for animation
          toggleActions: "play none none reverse",
          onEnter: () => {
            gsap.to(words, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.05,
            });
          },
          onLeaveBack: () => {
            gsap.to(words, {
              opacity: 0,
              y: 30,
              duration: 0.4,
              ease: "power2.in",
              stagger: 0.03,
            });
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="magazine-wrapper">
      <div className="magazine-sparkles">
        <span>✨</span>
        <span>🚀</span>
        <span>💡</span>
        <span>🎯</span>
        <span>🌍</span>
      </div>

      <div className="magazine-description">
        <p ref={(el) => (paragraphsRef.current[0] = el)}>
          {splitTextToWords(
            "Welcome to TECHPULSE 2025 — a future-forward edition celebrating innovation, resilience, and imagination. This year, we spotlight how Sri Lanka’s atoms are building nations, from tiny tech to digital farms, AI breakthroughs, and hyper-speed data."
          )}
        </p>
        <p ref={(el) => (paragraphsRef.current[1] = el)}>
          {splitTextToWords(
            "Explore the labs leading revolutions, 🌿 mindful tech escapes, and tradition-breaking voices shaping tomorrow. From farmers who code to pioneering resorts, this edition celebrates creators at the edge."
          )}
        </p>
        <p ref={(el) => (paragraphsRef.current[2] = el)}>
          {splitTextToWords(
            "This isn’t just a magazine — it’s a pulse check on progress. Welcome to the heartbeat of tomorrow 💡🚀🌍"
          )}
        </p>
      </div>
    </div>
  );
};

export default MagazineDescription;

