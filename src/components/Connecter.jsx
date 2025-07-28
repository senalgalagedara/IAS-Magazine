import React, { useRef } from "react";
import Table3D from "./Room";
import TechPulseMagazine from "./HomeText";
import MagazineDescription from "./MagazineDescription"; // ✅ correct

const MagazineViewer = () => {
  const tableRef = useRef(null);

  const handleContinue = () => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-screen">
      <div style={{ height: "100vh" }}>
        <TechPulseMagazine onContinue={handleContinue} />
      </div>
      <div style={{ height: "100vh" }}>
      <MagazineDescription />
      </div>
      <div ref={tableRef}>
        <Table3D />
      </div>
    </div>
  );
};

export default MagazineViewer;
