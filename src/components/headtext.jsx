import { useEffect, useRef } from "react";
import cover from "./resouses/cover.jpg";
import "./styles/text.css";
import "./styles/texteffect.css";

// Load Vanta + Three from global script (CDN)
const TechPulseMagazine = () => {
  const vantaRef = useRef(null);

  useEffect(() => {
    const initVanta = () => {
      if (window.VANTA && window.VANTA.GLOBE) {
        window.VANTA.GLOBE({
          el: vantaRef.current,
          mouseControls: false,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xff3f81, // Your custom color
          backgroundColor: 0x0a0a0a,
        });
      }
    };

    initVanta();

    return () => {
      if (vantaRef.current && vantaRef.current.vantaEffect) {
        vantaRef.current.vantaEffect.destroy();
      }
    };
  }, []);

  return (
    <div ref={vantaRef} className="techpulse-wrapper">
      <div className="techpulse-container">
        <h1 className="magazine-header">TechPulse</h1>
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
      </div>
    </div>
  );
};

export default TechPulseMagazine;
