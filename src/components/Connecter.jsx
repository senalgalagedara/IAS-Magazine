import React, { useState, useEffect } from "react";
import Table3D from "./Room";
import TechPulseMagazine from "./HomeText";
import MagazineDescription from "./MagazineDescription";
import Flipbook from "./Flipbook";
import "./styles/FloatingNav.css";

const MagazineViewer = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [showFlipbook, setShowFlipbook] = useState(isMobile); // 📱 show Flipbook by default on mobile
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScrollComplete = (isAtEnd) => {
    setTransitioning(true);
    setTimeout(() => {
      setShowFlipbook(isAtEnd);
      setTransitioning(false);
    }, 1000);
  };

  return (
    <div className="w-screen">
      {/* Section 1: Landing */}
      <div style={{ height: "100vh" }}>
        <TechPulseMagazine />
      </div>

      {/* Section 2: Description */}
      <div style={{ height: "100vh", backgroundColor: "black" }}>
        <MagazineDescription />
      </div>

      {/* Section 3: Interactive */}
      <div
        style={{
          minHeight: "100vh",
          position: "relative",
        }}
      >
        {!isMobile && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              transition: "opacity 0.5s ease-in-out",
              opacity: transitioning || showFlipbook ? 0 : 1,
              pointerEvents: transitioning || showFlipbook ? "none" : "auto",
              zIndex: 1,
            }}
          >
            <Table3D onScrollComplete={handleScrollComplete} />
          </div>
        )}

        {/* Flipbook (always visible on mobile) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transition: "opacity 1s ease-in-out",
            opacity: showFlipbook && !transitioning ? 1 : isMobile ? 1 : 0,
            pointerEvents: showFlipbook || isMobile ? "auto" : "none",
            zIndex: 2,
            marginTop: isMobile ? 0 : "100vh",
          }}
        >
          <Flipbook />
        </div>
      </div>
    </div>
  );
};

export default MagazineViewer;
