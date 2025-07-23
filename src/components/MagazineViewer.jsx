import React, { useState } from "react";
import Table3D from "./table";
import TechPulseMagazine from "./headtext";

const MagazineViewer = () => {
    const [showFlipbook, setShowFlipbook] = useState(false); // Toggle state

  return (
    <div className="w-screen h-screen">
      <TechPulseMagazine/>
    </div>
  );
};

export default MagazineViewer;
