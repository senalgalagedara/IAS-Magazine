import React, { useRef } from "react";
import Table3D from "./Room";
import TechPulseMagazine from "./HomeText";
import MagazineDescription from "./MagazineDescription";
import "./styles/FloatingNav.css"; // Create this new CSS file

const MagazineViewer = () => {
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const isMobile = window.innerWidth <= 767;

  const scrollTo = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-screen">
      {/* Floating Navigation Buttons */}
      <div className="floating-nav">
        <button onClick={() => scrollTo(section1Ref)}>🏁</button>
        <button onClick={() => scrollTo(section2Ref)}>📰</button>
        <button onClick={() => scrollTo(section3Ref)}>📚</button>
      </div>

      {/* Section 1 */}
      <div ref={section1Ref} style={{ height: "100vh" }}>
        <TechPulseMagazine />
      </div>

      {/* Section 2 */}
      <div ref={section2Ref} style={{ height: "100vh" }}>
        <MagazineDescription />
      </div>

      {/* Section 3 */}
      {!isMobile && (
        <div ref={section3Ref} style={{ height: "100vh" }}>
          <Table3D />
        </div>
      )}
    </div>
  );
};

export default MagazineViewer;
