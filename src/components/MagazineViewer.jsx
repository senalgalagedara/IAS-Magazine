import React, { useState } from "react";
import Table3D from "./table";
import TechPulseMagazine from "./headtext";

const MagazineViewer = () => {
    const [showFlipbook, setShowFlipbook] = useState(false); // Toggle state

  return (
    <div className="w-screen h-screen">
      <TechPulseMagazine />
      <Table3D onScrollComplete={() => setShowFlipbook(true)} />
    </div>
  );
};

export default MagazineViewer;
