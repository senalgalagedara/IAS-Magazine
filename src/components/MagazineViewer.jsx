import React, { useState } from "react";
import Table3D from "./table";
import Flipbook from "./Flipbook";

const MagazineViewer = () => {
  const [showFlipbook, setShowFlipbook] = useState(false); // Toggle state

  return (
    <div className="w-screen h-screen">
      {!showFlipbook && <Table3D onScrollComplete={() => setShowFlipbook(true)} />}
      {showFlipbook && <Flipbook />}
    </div>
  );
};

export default MagazineViewer;
