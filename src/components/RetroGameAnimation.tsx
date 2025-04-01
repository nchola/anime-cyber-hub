import React, { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// Character and game element sizes
const PACMAN_SIZE = 30;
const DOT_SIZE = 6;
const GHOST_SIZE = 30;

const RetroGameAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMobile = useIsMobile();
  const [score, setScore] = useState(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = 180; // Fixed height
      }
    };
    
    // Listen for resize events
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    // Game variables
    let pacmanX = 0;
    let pacmanY = canvas.height / 2;
    const pacmanAngle = 0;
    let pacmanMouth = 0;
    let mouthDirection = 1;
    let pacmanDirection = "right"; // right, left, up, down
    const pacmanSpeed = 2;
    
    // Ghost variables
    let ghostX = canvas.width - GHOST_SIZE;
    let ghostY = canvas.height / 2;
    let ghostDirection = "left";
    const ghostSpeed = 1.5;
    
    // Second ghost (blue)
    let ghost2X = canvas.width / 2;
    let ghost2Y = canvas.height / 4;
    let ghost2Direction = "down";
    const ghost2Speed = 1.2;
    
    let dots: {x: number, y: number, visible: boolean}[] = [];
    let paths: {x1: number, y1: number, x2: number, y2: number}[] = [];
    let currentScore = 0;
    
    // Initialize dots and paths
    const initGame = () => {
      dots = [];
      paths = [];
      
      // Create horizontal main path
      paths.push({
        x1: 0, 
        y1: canvas.height / 2,
        x2: canvas.width, 
        y2: canvas.height / 2
      });
      
      // Create vertical paths
      for (let i = 1; i < 8; i++) {
        const x = canvas.width / 8 * i;
        
        if (i % 2 === 0) {
          paths.push({
            x1: x, 
            y1: canvas.height / 2,
            x2: x, 
            y2: canvas.height / 4
          });
          
          // Add horizontal connecting path
          if (i < 7) {
            paths.push({
              x1: x, 
              y1: canvas.height / 4,
              x2: canvas.width / 8 * (i + 1), 
              y2: canvas.height / 4
            });
          }
        } else {
          paths.push({
            x1: x, 
            y1: canvas.height / 2,
            x2: x, 
            y2: canvas.height / 4 * 3
          });
          
          // Add horizontal connecting path
          if (i < 7) {
            paths.push({
              x1: x, 
              y1: canvas.height / 4 * 3,
              x2: canvas.width / 8 * (i + 1), 
              y2: canvas.height / 4 * 3
            });
          }
        }
      }
      
      // Add dots along all paths
      paths.forEach(path => {
        const isHorizontal = path.y1 === path.y2;
        const distance = isHorizontal 
          ? Math.abs(path.x2 - path.x1) 
          : Math.abs(path.y2 - path.y1);
        const count = Math.floor(distance / 40);
        
        for (let i = 1; i <= count; i++) {
          const ratio = i / (count + 1);
          dots.push({
            x: path.x1 + (path.x2 - path.x1) * ratio,
            y: path.y1 + (path.y2 - path.y1) * ratio,
            visible: true
          });
        }
      });
    };
    
    initGame();
    
    // Check if position is on a path
    const isOnPath = (x: number, y: number, direction: string): boolean => {
      const buffer = 5; // Tolerance for path detection
      
      return paths.some(path => {
        // For horizontal paths
        if (Math.abs(path.y1 - y) <= buffer && path.y1 === path.y2) {
          return x >= path.x1 - buffer && x <= path.x2 + buffer;
        }
        
        // For vertical paths
        if (Math.abs(path.x1 - x) <= buffer && path.x1 === path.x2) {
          return y >= path.y1 - buffer && y <= path.y2 + buffer;
        }
        
        return false;
      });
    };
    
    // Change direction randomly at intersections
    const changeDirectionRandomly = (x: number, y: number, currentDirection: string): string => {
      const possibleDirections = ["left", "right", "up", "down"];
      const oppositeDirections: {[key: string]: string} = {
        "left": "right",
        "right": "left",
        "up": "down",
        "down": "up"
      };
      
      // Filter out opposite direction to avoid back-and-forth movement
      const filteredDirections = possibleDirections.filter(
        dir => dir !== oppositeDirections[currentDirection]
      );
      
      // Test each direction to see if it's valid
      const validDirections = filteredDirections.filter(dir => {
        let testX = x;
        let testY = y;
        
        switch (dir) {
          case "left": testX -= 10; break;
          case "right": testX += 10; break;
          case "up": testY -= 10; break;
          case "down": testY += 10; break;
        }
        
        return isOnPath(testX, testY, dir);
      });
      
      // If no valid directions, keep current
      if (validDirections.length === 0) {
        return currentDirection;
      }
      
      // Change direction with 20% probability when at intersection
      if (Math.random() > 0.8) {
        return validDirections[Math.floor(Math.random() * validDirections.length)];
      }
      
      return currentDirection;
    };
    
    // Randomly change ghost direction occasionally
    const updateGhostDirection = (ghostX: number, ghostY: number, currentDirection: string) => {
      if (Math.random() > 0.95) {
        return changeDirectionRandomly(ghostX, ghostY, currentDirection);
      }
      return currentDirection;
    };
    
    // Move character along path
    const moveCharacter = (x: number, y: number, direction: string, speed: number) => {
      let newX = x;
      let newY = y;
      
      switch (direction) {
        case "left": newX -= speed; break;
        case "right": newX += speed; break;
        case "up": newY -= speed; break;
        case "down": newY += speed; break;
      }
      
      // If new position is on a path, update
      if (isOnPath(newX, newY, direction)) {
        return { x: newX, y: newY };
      }
      
      // If not on path, try to find a valid direction
      const newDirection = changeDirectionRandomly(x, y, direction);
      
      if (newDirection !== direction) {
        // Try the new direction
        switch (newDirection) {
          case "left": return { x: x - speed, y: y, direction: newDirection };
          case "right": return { x: x + speed, y: y, direction: newDirection };
          case "up": return { x: x, y: y - speed, direction: newDirection };
          case "down": return { x: x, y: y + speed, direction: newDirection };
        }
      }
      
      // If stuck, try to go back
      return { x, y };
    };
    
    // Draw pacman with correct orientation
    const drawPacman = (x: number, y: number, direction: string, mouthAngle: number) => {
      ctx.fillStyle = "#ffff00";
      ctx.beginPath();
      
      let startAngle = 0;
      let endAngle = Math.PI * 2;
      
      switch (direction) {
        case "right":
          startAngle = mouthAngle * Math.PI / 10;
          endAngle = (2 - mouthAngle / 10) * Math.PI;
          break;
        case "left":
          startAngle = Math.PI + mouthAngle * Math.PI / 10;
          endAngle = Math.PI + (2 - mouthAngle / 10) * Math.PI;
          break;
        case "up":
          startAngle = Math.PI * 1.5 + mouthAngle * Math.PI / 10;
          endAngle = Math.PI * 1.5 + (2 - mouthAngle / 10) * Math.PI;
          break;
        case "down":
          startAngle = Math.PI * 0.5 + mouthAngle * Math.PI / 10;
          endAngle = Math.PI * 0.5 + (2 - mouthAngle / 10) * Math.PI;
          break;
      }
      
      ctx.arc(x, y, PACMAN_SIZE / 2, startAngle, endAngle, false);
      ctx.lineTo(x, y);
      ctx.fill();
    };
    
    // Draw ghost with given color
    const drawGhost = (x: number, y: number, color: string, direction: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      
      // Ghost body (semi-circle + rectangle)
      ctx.arc(
        x,
        y - GHOST_SIZE / 4,
        GHOST_SIZE / 2,
        Math.PI,
        0,
        false
      );
      ctx.lineTo(x + GHOST_SIZE / 2, y + GHOST_SIZE / 4);
      
      // Ghost "skirt" with zigzag bottom
      const zigzagWidth = GHOST_SIZE / 4;
      for (let i = 0; i < 4; i++) {
        const xPos = x + GHOST_SIZE / 2 - i * zigzagWidth;
        if (i % 2 === 0) {
          ctx.lineTo(xPos, y + GHOST_SIZE / 2);
        } else {
          ctx.lineTo(xPos, y + GHOST_SIZE / 4);
        }
      }
      
      ctx.lineTo(x - GHOST_SIZE / 2, y - GHOST_SIZE / 4);
      ctx.fill();
      
      // Ghost eyes
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      
      let eyeOffsetX = 0;
      let eyeOffsetY = 0;
      
      switch(direction) {
        case "left": eyeOffsetX = -2; break;
        case "right": eyeOffsetX = 2; break;
        case "up": eyeOffsetY = -2; break;
        case "down": eyeOffsetY = 2; break;
      }
      
      ctx.arc(x - GHOST_SIZE / 4, y - GHOST_SIZE / 8, GHOST_SIZE / 8, 0, Math.PI * 2);
      ctx.arc(x + GHOST_SIZE / 4, y - GHOST_SIZE / 8, GHOST_SIZE / 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "#0000ff";
      ctx.beginPath();
      ctx.arc(x - GHOST_SIZE / 4 + eyeOffsetX, y - GHOST_SIZE / 8 + eyeOffsetY, GHOST_SIZE / 16, 0, Math.PI * 2);
      ctx.arc(x + GHOST_SIZE / 4 + eyeOffsetX, y - GHOST_SIZE / 8 + eyeOffsetY, GHOST_SIZE / 16, 0, Math.PI * 2);
      ctx.fill();
    };
    
    // Animation function
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw maze-like paths
      ctx.strokeStyle = "#1a1a6c";
      ctx.lineWidth = 2;
      
      paths.forEach(path => {
        ctx.beginPath();
        ctx.moveTo(path.x1, path.y1);
        ctx.lineTo(path.x2, path.y2);
        ctx.stroke();
      });
      
      // Draw dots
      ctx.fillStyle = "#ffffff";
      dots.forEach(dot => {
        if (dot.visible) {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, DOT_SIZE / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // Update pacman movement
      const pacmanMove = moveCharacter(pacmanX, pacmanY, pacmanDirection, pacmanSpeed);
      pacmanX = pacmanMove.x;
      pacmanY = pacmanMove.y;
      
      if (pacmanMove.direction) {
        pacmanDirection = pacmanMove.direction;
      }
      
      // Update ghost movements
      const ghostMove = moveCharacter(ghostX, ghostY, ghostDirection, ghostSpeed);
      ghostX = ghostMove.x;
      ghostY = ghostMove.y;
      
      if (ghostMove.direction) {
        ghostDirection = ghostMove.direction;
      } else {
        ghostDirection = updateGhostDirection(ghostX, ghostY, ghostDirection);
      }
      
      const ghost2Move = moveCharacter(ghost2X, ghost2Y, ghost2Direction, ghost2Speed);
      ghost2X = ghost2Move.x;
      ghost2Y = ghost2Move.y;
      
      if (ghost2Move.direction) {
        ghost2Direction = ghost2Move.direction;
      } else {
        ghost2Direction = updateGhostDirection(ghost2X, ghost2Y, ghost2Direction);
      }
      
      // Update pacman mouth animation
      pacmanMouth += 0.2 * mouthDirection;
      if (pacmanMouth >= 2 || pacmanMouth <= 0) {
        mouthDirection *= -1;
      }
      
      // Draw game characters
      drawPacman(pacmanX, pacmanY, pacmanDirection, pacmanMouth);
      drawGhost(ghostX, ghostY, "#ff0000", ghostDirection); // Red ghost
      drawGhost(ghost2X, ghost2Y, "#00ffff", ghost2Direction); // Cyan ghost
      
      // Collision detection for dots
      dots.forEach((dot, index) => {
        if (dot.visible && Math.hypot(pacmanX - dot.x, pacmanY - dot.y) < PACMAN_SIZE / 2) {
          dot.visible = false;
          currentScore += 10;
          setScore(currentScore);
        }
      });
      
      // Draw score and pixel game text with proper spacing to avoid overlap
      ctx.font = "12px 'Press Start 2P', monospace, Arial";
      ctx.fillStyle = "#ffffff";
      
      // Left-aligned text
      ctx.textAlign = "left";
      ctx.fillText(`SCORE: ${currentScore}`, 10, 20);
      
      // Center-aligned text
      ctx.textAlign = "center";
      ctx.fillText("CYBER ARCADE", canvas.width / 2, 20);
      
      // Right-aligned text
      ctx.textAlign = "right";
      if (!isMobile) {
        ctx.fillText("LEVEL 1", canvas.width - 10, 20);
      }
      
      // Reset characters if they go off-screen
      if (pacmanX < -PACMAN_SIZE || pacmanX > canvas.width + PACMAN_SIZE || 
          pacmanY < -PACMAN_SIZE || pacmanY > canvas.height + PACMAN_SIZE) {
        pacmanX = canvas.width / 2;
        pacmanY = canvas.height / 2;
      }
      
      // Check if all dots are collected
      const dotsRemaining = dots.filter(dot => dot.visible).length;
      if (dotsRemaining === 0) {
        initGame();
        currentScore += 100; // Bonus for completing level
        setScore(currentScore);
      }
      
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);
  
  return (
    <div className="w-full bg-black overflow-hidden border-t-4 border-b-4 border-cyber-accent/30 relative">
      {/* Game info positioned to avoid overlap */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
        <div className="text-xs text-white font-orbitron hidden sm:block">←→↑↓: MOVE</div>
        <div className="text-xs text-white font-orbitron">SCORE: {score}</div>
        <div className="text-xs text-white font-orbitron hidden sm:block">SPACE: POWER</div>
      </div>
      
      <div className="scanlines absolute inset-0 opacity-20"></div>
      
      <canvas
        ref={canvasRef}
        className="pixel-corners w-full"
        style={{ imageRendering: "pixelated" }}
      />
      
      <div className="absolute bottom-2 left-0 right-0 bg-transparent flex justify-center items-center">
        <div className="text-xs text-white font-orbitron px-2 py-1 bg-black/70 rounded">CYBER ARCADE</div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 bg-black h-6 flex justify-center items-center">
        <div className="h-2 w-2 bg-cyber-accent mx-1 animate-pulse"></div>
        <div className="h-2 w-2 bg-cyber-purple mx-1 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
        <div className="h-2 w-2 bg-cyber-accent mx-1 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
      </div>
    </div>
  );
};

export default RetroGameAnimation;