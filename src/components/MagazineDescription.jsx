import React from "react";
import "./styles/HeroText.css";

const MagazineDescription = () => {
  return (
    <div className="magazine-wrapper">
      <div className="magazine-description">
        <p>
          Welcome to the first edition of{" "}
          <span className="gradient-text">TECHPULSE</span>—the official magazine
          of the <span className="glow-effect">IEEE Industry Applications Society (IAS) Student Branch Chapter of SLIIT</span> 🏫.
          It is with great pride <span className="emoji-bounce">✨</span> that we present this premiere issue,
          marking a significant milestone <span className="emoji-bounce">🏁</span> in our journey to unite <span className="rotate-letters">
            {"technology enthusiasts".split("").map((char, index) => (
              <span key={index} className="letter" style={{ animationDelay: `${7 + index * 0.05}s` }}>
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <span className="emoji-bounce">🤝</span> under one vibrant platform{" "}
          <span className="emoji-bounce">🌈</span>. This isn't just a magazine—it’s a <span className="blood">pulse check</span> {" "}
          <span className="emoji-bounce">💓</span> on our progress, our passion for innovation{" "}
          <span className="emoji-bounce">💡</span>, and our vision for the <span className="glitch-blip">future</span>{" "}
          <span className="emoji-bounce">🚀</span>.
        </p>
      </div>
    </div>
  );
};

export default MagazineDescription;
