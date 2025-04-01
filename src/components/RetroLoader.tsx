
import React, { useEffect, useState } from "react";

const RetroLoader = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [pacmanPosition, setPacmanPosition] = useState(0);
  const [chompOpen, setChompOpen] = useState(true);
  const [ghosts, setGhosts] = useState([
    { id: 1, position: 85, color: "#FF0000" }, // Red ghost (Blinky)
    { id: 2, position: 70, color: "#FFB8FF" }, // Pink ghost (Pinky)
    { id: 3, position: 55, color: "#00FFFF" }, // Cyan ghost (Inky)
    { id: 4, position: 40, color: "#FFB852" }, // Orange ghost (Clyde)
  ]);
  const [loadingText, setLoadingText] = useState("LOADING");
  const [textBlink, setTextBlink] = useState(false);

  // Pixel font style classes
  const pixelFont = "font-orbitron tracking-wider";

  // Loading progress simulation
  useEffect(() => {
    // Animate loading text with dots
    const textInterval = setInterval(() => {
      setTextBlink(prev => !prev);
      setLoadingText(prev => {
        if (prev === "LOADING...") return "LOADING";
        return prev + ".";
      });
    }, 500);

    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const next = prev + Math.random() * 3;
        return next > 100 ? 100 : next;
      });
    }, 100);

    // Pacman chomping animation
    const chompInterval = setInterval(() => {
      setChompOpen(prev => !prev);
    }, 200);

    // Pacman movement
    const movementInterval = setInterval(() => {
      setPacmanPosition(prev => {
        // Move based on loading progress
        const targetPosition = loadingProgress;
        const step = (targetPosition - prev) * 0.1;
        return prev + step;
      });
    }, 50);

    // Ghost movement
    const ghostInterval = setInterval(() => {
      setGhosts(prev => prev.map(ghost => ({
        ...ghost,
        position: Math.max(0, ghost.position - 0.5)
      })));
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(chompInterval);
      clearInterval(movementInterval);
      clearInterval(ghostInterval);
      clearInterval(textInterval);
    };
  }, [loadingProgress]);

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-black z-50">
      {/* CRT Screen Effect */}
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(32,128,32,0.2)_2%,rgba(32,128,32,0.8)_3%,rgba(32,128,32,0.2)_3%,transparent_100%)] bg-[length:100%_100vh] animate-scan"></div>
      </div>

      {/* Arcade Title - Centered */}
      <div className="mb-16 relative z-10 text-center w-full px-4">
        <h1 className={`text-5xl ${pixelFont} font-bold bg-gradient-to-r from-cyber-purple via-cyber-accent to-cyber-purple bg-clip-text text-transparent animate-pulse-accent mx-auto`}>
          CYBER ANIME
        </h1>
        <p className={`text-lg ${pixelFont} text-gray-400 text-center mt-2`}>
          PRESS START
        </p>
      </div>

      {/* Loading Bar Container */}
      <div className="w-3/4 max-w-lg h-8 bg-gray-900 border-4 border-cyan-500 mb-2 relative overflow-hidden">
        {/* Pixelated Grid Pattern */}
        <div className="absolute inset-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwyNTUsMjU1LDAuMSlgIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        {/* Ghosts */}
        {ghosts.map((ghost) => (
          <div 
            key={ghost.id}
            className="absolute top-0 bottom-0 w-5 h-5 my-auto transition-all duration-100"
            style={{ 
              left: `${ghost.position}%`,
              zIndex: 2
            }}
          >
            {/* Ghost SVG */}
            <svg 
              viewBox="0 0 24 24" 
              className="w-full h-full" 
              style={{ fill: ghost.color }}
            >
              <path d="M12,2C6.486,2,2,6.486,2,12v8c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2v-8C22,6.486,17.514,2,12,2z M7.5,15 C6.672,15,6,14.328,6,13.5S6.672,12,7.5,12S9,12.672,9,13.5S8.328,15,7.5,15z M16.5,15c-0.828,0-1.5-0.672-1.5-1.5 s0.672-1.5,1.5-1.5s1.5,0.672,1.5,1.5S17.328,15,16.5,15z M20,22H4v-2h16V22z" />
            </svg>
          </div>
        ))}
        
        {/* Pacman */}
        <div 
          className="absolute top-0 bottom-0 w-6 h-6 my-auto transition-all duration-100 transform -translate-y-[1px]"
          style={{ 
            left: `${pacmanPosition}%`,
            zIndex: 3
          }}
        >
          {/* Pacman SVG */}
          <svg 
            viewBox="0 0 24 24" 
            className="w-full h-full" 
            fill="#FFFF00"
          >
            <path d={chompOpen 
              ? "M12,2C6.477,2,2,6.477,2,12s4.477,10,10,10s10-4.477,10-10S17.523,2,12,2z M12,20c-4.418,0-8-3.582-8-8 s3.582-8,8-8s8,3.582,8,8S16.418,20,12,20z M15.5,11.5L19,8l-3.5,3.5L19,15l-3.5-3.5z" 
              : "M12,2C6.477,2,2,6.477,2,12s4.477,10,10,10s10-4.477,10-10S17.523,2,12,2z"
            } />
          </svg>
        </div>
        
        {/* Progress Bar */}
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 relative z-1"
          style={{ width: `${loadingProgress}%` }}
        >
          {/* Scanlines */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_25%,rgba(0,0,0,0.2)_25%,rgba(0,0,0,0.2)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.2)_75%)] bg-[length:4px_4px]"></div>
        </div>

        {/* Pellets */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={i} 
            className={`absolute top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-300 z-1 ${
              pacmanPosition > i * 10 ? 'opacity-0' : 'opacity-100'
            } transition-opacity duration-300`}
            style={{ left: `${i * 10 + 5}%` }}
          />
        ))}
      </div>
      
      {/* Loading Text - Centered */}
      <p className={`text-xl ${pixelFont} text-cyan-400 mt-6 ${textBlink ? 'opacity-100' : 'opacity-80'} text-center w-full`}>
        {loadingText}
      </p>
      
      {/* Progress Percentage - Centered */}
      <p className={`text-sm ${pixelFont} text-gray-400 mt-2 text-center w-full`}>
        {Math.floor(loadingProgress)}%
      </p>
      
      {/* Credits Text */}
      <div className="absolute bottom-8 text-center w-full">
        <p className={`text-sm ${pixelFont} text-gray-500`}>
          © 2025 CYBER ANIME CORPORATION
        </p>
        <p className={`text-xs ${pixelFont} text-gray-600 mt-1`}>
          INSERT COIN TO CONTINUE
        </p>
      </div>
      
      {/* Flicker Animation */}
      <div className="absolute inset-0 bg-black opacity-0 pointer-events-none animate-flicker"></div>
    </div>
  );
};

export default RetroLoader;
