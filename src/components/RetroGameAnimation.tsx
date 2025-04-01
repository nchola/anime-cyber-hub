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
    
    // Find valid directions at current position
    const getValidDirections = (x: number, y: number, currentDirection: string): string[] => {
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
      return filteredDirections.filter(dir => {
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
    };
    
    // Determine if character is at an intersection
    const isAtIntersection = (x: number, y: number): boolean => {
      const validDirections = getValidDirections(x, y, "none");
      return validDirections.length > 1; // More than one valid direction = intersection
    };
    
    // IMPROVED: Change direction based on weighted choices for ghosts
    // This makes their movement more strategic and less random
    const getGhostNextDirection = (
      ghostX: number, 
      ghostY: number, 
      currentDirection: string, 
      targetX: number, 
      targetY: number
    ): string => {
      // If not at an intersection, keep current direction
      if (!isAtIntersection(ghostX, ghostY)) {
        return currentDirection;
      }
      
      const validDirections = getValidDirections(ghostX, ghostY, currentDirection);
      
      if (validDirections.length === 0) {
        // Handle edge case - if no valid directions, try to turn around
        const oppositeDirections: {[key: string]: string} = {
          "left": "right",
          "right": "left",
          "up": "down",
          "down": "up"
        };
        return oppositeDirections[currentDirection];
      }
      
      // Assign weights to directions based on distance to pacman
      const directionWeights = validDirections.map(dir => {
        let nextX = ghostX;
        let nextY = ghostY;
        
        switch (dir) {
          case "left": nextX -= 10; break;
          case "right": nextX += 10; break;
          case "up": nextY -= 10; break;
          case "down": nextY += 10; break;
        }
        
        // Calculate distance to target after this move
        const distance = Math.hypot(nextX - targetX, nextY - targetY);
        
        // Create a weight (inverse of distance, so closer = higher weight)
        return {
          direction: dir,
          weight: 1000 / (distance + 1) // Add 1 to avoid division by zero
        };
      });
      
      // 80% chance to pick weighted direction, 20% chance to pick random
      if (Math.random() < 0.8) {
        // Sort by weight and pick highest (closest to pacman) with some randomness
        directionWeights.sort((a, b) => b.weight - a.weight);
        
        // Add some randomness - sometimes pick second best option
        const index = Math.random() < 0.3 && directionWeights.length > 1 ? 1 : 0;
        return directionWeights[index].direction;
      } else {
        // Random choice (for unpredictability)
        return validDirections[Math.floor(Math.random() * validDirections.length)];
      }
    };
    
    // IMPROVED: Helper function to find path turns
    const needsToTurn = (x: number, y: number, direction: string): boolean => {
      let nextX = x;
      let nextY = y;
      
      switch (direction) {
        case "left": nextX -= 10; break;
        case "right": nextX += 10; break;
        case "up": nextY -= 10; break;
        case "down": nextY += 10; break;
      }
      
      return !isOnPath(nextX, nextY, direction);
    };
    
    // IMPROVED: Get next direction for Pacman with more intelligent path following
    const getPacmanNextDirection = (x: number, y: number, currentDirection: string): string => {
      // Continue in current direction if possible
      if (!needsToTurn(x, y, currentDirection)) {
        return currentDirection;
      }
      
      const validDirections = getValidDirections(x, y, currentDirection);
      
      if (validDirections.length === 0) {
        // Handle edge case - if truly stuck, try to reverse direction
        const oppositeDirections: {[key: string]: string} = {
          "left": "right",
          "right": "left",
          "up": "down",
          "down": "up"
        };
        return oppositeDirections[currentDirection];
      }
      
      // At an intersection or forced turn
      // Prefer to continue in same general direction (horizontal/vertical)
      const isHorizontal = currentDirection === "left" || currentDirection === "right";
      
      // First try to maintain same orientation
      const sameOrientationDirections = validDirections.filter(dir => {
        const dirIsHorizontal = dir === "left" || dir === "right";
        return dirIsHorizontal === isHorizontal;
      });
      
      if (sameOrientationDirections.length > 0) {
        return sameOrientationDirections[Math.floor(Math.random() * sameOrientationDirections.length)];
      }
      
      // If can't maintain orientation, pick a random valid direction
      return validDirections[Math.floor(Math.random() * validDirections.length)];
    };
    
    // IMPROVED: Move character along path with better handling of turns and edges
    const moveCharacter = (
      x: number, 
      y: number, 
      direction: string, 
      speed: number, 
      isGhost: boolean = false,
      targetX: number = 0, 
      targetY: number = 0
    ) => {
      let newX = x;
      let newY = y;
      let newDirection = direction;
      
      // First, determine if we need to change direction
      if (isGhost) {
        // Ghosts have special targeting behavior
        newDirection = getGhostNextDirection(x, y, direction, targetX, targetY);
      } else {
        // Pacman follows paths with some randomness
        if (needsToTurn(x, y, direction) || (isAtIntersection(x, y) && Math.random() < 0.1)) {
          newDirection = getPacmanNextDirection(x, y, direction);
        }
      }
      
      // Now move in the determined direction
      switch (newDirection) {
        case "left": newX -= speed; break;
        case "right": newX += speed; break;
        case "up": newY -= speed; break;
        case "down": newY += speed; break;
      }
      
      // Ensure new position is on a path
      if (isOnPath(newX, newY, newDirection)) {
        return { x: newX, y: newY, direction: newDirection };
      }
      
      // If not on path, try changing direction but keep current position
      return { x, y, direction: newDirection };
    };
    
    // IMPROVED: Wraparound logic for characters going off-screen
    const handleWrapAround = (pos: number, size: number, dimension: number): number => {
      if (pos < -size) {
        return dimension + size;
      } else if (pos > dimension + size) {
        return -size;
      }
      return pos;
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
    
    // IMPROVED: Track time for behavior changes
    let gameTime = 0;
    let ghostsScatterMode = true;
    let scatterTargetX1 = 0;
    let scatterTargetY1 = 0;
    let scatterTargetX2 = canvas.width;
    let scatterTargetY2 = 0;
    
    // Animation function
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update game time
      gameTime += 1;
      
      // Switch ghost behavior between scatter and chase every few seconds
      if (gameTime % 600 === 0) {
        ghostsScatterMode = !ghostsScatterMode;
        
        // Update scatter targets for variety
        scatterTargetX1 = Math.random() < 0.5 ? 0 : canvas.width;
        scatterTargetY1 = Math.random() < 0.5 ? 0 : canvas.height;
        scatterTargetX2 = Math.random() < 0.5 ? 0 : canvas.width;
        scatterTargetY2 = Math.random() < 0.5 ? 0 : canvas.height;
      }
      
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
      
      // Update pacman movement - never stops, always follows paths
      const pacmanMove = moveCharacter(pacmanX, pacmanY, pacmanDirection, pacmanSpeed);
      pacmanX = pacmanMove.x;
      pacmanY = pacmanMove.y;
      pacmanDirection = pacmanMove.direction;
      
      // Determine ghost targets
      let ghost1TargetX = pacmanX;
      let ghost1TargetY = pacmanY;
      let ghost2TargetX = pacmanX;
      let ghost2TargetY = pacmanY;
      
      if (ghostsScatterMode) {
        // In scatter mode, go to corners
        ghost1TargetX = scatterTargetX1;
        ghost1TargetY = scatterTargetY1;
        ghost2TargetX = scatterTargetX2;
        ghost2TargetY = scatterTargetY2;
      } else {
        // In chase mode, red ghost targets pacman directly
        ghost1TargetX = pacmanX;
        ghost1TargetY = pacmanY;
        
        // Blue ghost targets position ahead of Pacman
        const lookAheadDistance = 80;
        switch (pacmanDirection) {
          case "right": ghost2TargetX = pacmanX + lookAheadDistance; break;
          case "left": ghost2TargetX = pacmanX - lookAheadDistance; break;
          case "up": ghost2TargetY = pacmanY - lookAheadDistance; break;
          case "down": ghost2TargetY = pacmanY + lookAheadDistance; break;
        }
      }
      
      // Update ghost movements with targeting
      const ghostMove = moveCharacter(
        ghostX, 
        ghostY, 
        ghostDirection, 
        ghostSpeed, 
        true, 
        ghost1TargetX, 
        ghost1TargetY
      );
      ghostX = ghostMove.x;
      ghostY = ghostMove.y;
      ghostDirection = ghostMove.direction;
      
      const ghost2Move = moveCharacter(
        ghost2X, 
        ghost2Y, 
        ghost2Direction, 
        ghost2Speed, 
        true, 
        ghost2TargetX, 
        ghost2TargetY
      );
      ghost2X = ghost2Move.x;
      ghost2Y = ghost2Move.y;
      ghost2Direction = ghost2Move.direction;
      
      // Handle wraparound for all characters
      pacmanX = handleWrapAround(pacmanX, PACMAN_SIZE, canvas.width);
      pacmanY = handleWrapAround(pacmanY, PACMAN_SIZE, canvas.height);
      ghostX = handleWrapAround(ghostX, GHOST_SIZE, canvas.width);
      ghostY = handleWrapAround(ghostY, GHOST_SIZE, canvas.height);
      ghost2X = handleWrapAround(ghost2X, GHOST_SIZE, canvas.width);
      ghost2Y = handleWrapAround(ghost2Y, GHOST_SIZE, canvas.height);
      
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
      
      // Right-aligned text
      ctx.textAlign = "right";
      if (!isMobile) {
        ctx.fillText("CYBER ARCADE", canvas.width - 10, 20);
      }
      
      // Check if all dots are collected
      const dotsRemaining = dots.filter(dot => dot.visible).length;
      if (dotsRemaining === 0) {
        initGame();
        currentScore += 100; // Bonus for completing level
        setScore(currentScore);
      }
      
      // IMPROVED: Visual effects for scatter mode
      if (ghostsScatterMode && gameTime % 20 < 10) {
        ctx.fillStyle = "rgba(0, 100, 255, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
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