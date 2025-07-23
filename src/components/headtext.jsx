import { useRef, useEffect } from "react";
import gsap from "gsap";
import cover from "./resouses/cover.jpg";
import "./styles/text.css";
import ArrowCursor from "./ArrowCurser";
import Hyperspeed from "./Hyperspeed";
import SplitText from "./SplitText";

const TechPulseMagazine = () => {
  // Reference to the header element
  const headerRef = useRef(null);

  // Track the header's scroll-based position
  const yOffset = useRef(0);

  // Reusable GSAP tween object
  const tween = useRef(null);

  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  useEffect(() => {
  const handleWheel = (e) => {
    e.preventDefault(); // block browser scroll

    const delta = e.deltaY;

    // We INVERT scroll input to move UP when scrolling DOWN
    yOffset.current -= delta * 0.5; // sensitivity

    // Clamp so it can't move DOWN past original position (0)
    yOffset.current = Math.min(yOffset.current, 0);     // max 0 (can't go down)
    yOffset.current = Math.max(yOffset.current, -400);  // min -400 (can go up to -400)

    // Kill previous tween if running
    if (tween.current) {
      tween.current.kill();
    }

    // Animate to new position
    tween.current = gsap.to(headerRef.current, {
      y: yOffset.current,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  window.addEventListener("wheel", handleWheel, { passive: false });
  return () => window.removeEventListener("wheel", handleWheel);
}, []);


  return (
    <div className="techpulse-wrapper" style={{ height: "100vh", overflow: "hidden" }}>
      <ArrowCursor />

      {/* Hyperspeed Background */}
      <div className="hyperspeed-background fixed-background">
        <Hyperspeed
          effectOptions={{
            distortion: 'turbulentDistortion',
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 4,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 20,
            lightPairsPerRoadWay: 40,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [400 * 0.03, 400 * 0.2],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.8, 0.8],
            carFloorSeparation: [0, 5],
            colors: {
              roadColor: 0x080808,
              islandColor: 0x0a0a0a,
              background: 0x000000,
              shoulderLines: 0xFFFFFF,
              brokenLines: 0xFFFFFF,
              leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
              rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
              sticks: 0x03B3C3,
            },
          }}
        />
      </div>

      {/* Main content */}
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
          </div>
        </div>

        {/* Scroll-controlled header */}
        <div ref={headerRef} className="magazine-header scroll-header">
          <SplitText
            text="TECHPULSE"
            className="text-5xl font-bold text-center"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="0px"
            textAlign="center"
            onLetterAnimationComplete={handleAnimationComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default TechPulseMagazine;
