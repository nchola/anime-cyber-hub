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
    let pacmanX = canvas.width / 4;
    let pacmanY = canvas.height / 2;
    let pacmanMouth = 0;
    let mouthDirection = 1;
    let pacmanDirection = "right"; // right, left, up, down
    const pacmanSpeed = 2;
    
    // Ghost variables
    let ghostX = canvas.width - GHOST_SIZE * 2;
    let ghostY = canvas.height / 2;
    let ghostDirection = "left";
    const ghostSpeed = 1.5;
    
    // Second ghost (blue)
    let ghost2X = canvas.width / 2;
    let ghost2Y = canvas.height / 4;
    let ghost2Direction = "down";
    const ghost2Speed = 1.2;
    
    // Game state tracking
    let gameTime = 0;
    let ghostsScatterMode = true;
    let ghostScatterInterval = 300; // Switch modes every 5 seconds
    let dots: {x: number, y: number, visible: boolean}[] = [];
    let paths: {x1: number, y1: number, x2: number, y2: number}[] = [];
    let currentScore = 0;
    let lastIntersectionDecision = 0; // Track time since last intersection decision
    
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
      
      // Create vertical paths with better distribution
      const pathCount = Math.max(4, Math.floor(canvas.width / 100)); // Dynamic path count based on width
      for (let i = 1; i < pathCount + 1; i++) {
        const x = canvas.width / (pathCount + 1) * i;
        
        if (i % 2 === 0) {
          paths.push({
            x1: x, 
            y1: canvas.height / 2,
            x2: x, 
            y2: canvas.height / 4
          });
          
          // Add horizontal connecting path at top
          if (i < pathCount) {
            paths.push({
              x1: x, 
              y1: canvas.height / 4,
              x2: canvas.width / (pathCount + 1) * (i + 1), 
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
          
          // Add horizontal connecting path at bottom
          if (i < pathCount) {
            paths.push({
              x1: x, 
              y1: canvas.height / 4 * 3,
              x2: canvas.width / (pathCount + 1) * (i + 1), 
              y2: canvas.height / 4 * 3
            });
          }
        }
      }
      
      // Add additional cross paths for more maze-like feel
      if (canvas.width > 400) {
        const midX1 = canvas.width / 3;
        const midX2 = canvas.width * 2 / 3;
        
        // Add cross connections
        paths.push({
          x1: midX1, 
          y1: canvas.height / 4,
          x2: midX1, 
          y2: canvas.height / 4 * 3
        });
        
        paths.push({
          x1: midX2, 
          y1: canvas.height / 4,
          x2: midX2, 
          y2: canvas.height / 4 * 3
        });
      }
      
      // Add dots along all paths with better spacing
      paths.forEach(path => {
        const isHorizontal = path.y1 === path.y2;
        const distance = isHorizontal 
          ? Math.abs(path.x2 - path.x1) 
          : Math.abs(path.y2 - path.y1);
        const count = Math.floor(distance / 30); // More dots for better experience
        
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
    
    // Improved path detection with better tolerance
    const isOnPath = (x: number, y: number): boolean => {
      const tolerance = 8; // Increased tolerance for better user experience
      
      return paths.some(path => {
        // For horizontal paths
        if (Math.abs(path.y1 - y) <= tolerance && path.y1 === path.y2) {
          return x >= path.x1 - tolerance && x <= path.x2 + tolerance;
        }
        
        // For vertical paths
        if (Math.abs(path.x1 - x) <= tolerance && path.x1 === path.x2) {
          return y >= path.y1 - tolerance && y <= path.y2 + tolerance;
        }
        
        return false;
      });
    };
    
    // Get valid directions with improved path snapping
    const getValidDirections = (x: number, y: number, currentDirection: string): string[] => {
      const possibleDirections = ["left", "right", "up", "down"];
      const oppositeDirections: {[key: string]: string} = {
        "left": "right",
        "right": "left",
        "up": "down",
        "down": "up"
      };
      
      // Filter out opposite direction to avoid back-and-forth movement
      // unless the character is stuck
      let filteredDirections = possibleDirections;
      
      // Only filter out the opposite direction if we're not testing all directions
      // This helps prevent characters from getting stuck
      if (currentDirection !== "none") {
        filteredDirections = possibleDirections.filter(
          dir => dir !== oppositeDirections[currentDirection]
        );
      }
      
      // Test each direction to see if it's valid
      return filteredDirections.filter(dir => {
        let testX = x;
        let testY = y;
        const testDistance = 12; // Look further ahead
        
        switch (dir) {
          case "left": testX -= testDistance; break;
          case "right": testX += testDistance; break;
          case "up": testY -= testDistance; break;
          case "down": testY += testDistance; break;
        }
        
        return isOnPath(testX, testY);
      });
    };
    
    // Determine if character is at an intersection with improved detection
    const isAtIntersection = (x: number, y: number, direction: string): boolean => {
      // Get valid directions excluding the opposite of our current direction
      const validDirections = getValidDirections(x, y, direction);
      
      // Check if we're at a point where we can change direction (more than 1 valid direction)
      return validDirections.length > 1;
    };
    
    // Improved ghost AI for more authentic behavior
    const getGhostNextDirection = (
      ghostX: number, 
      ghostY: number, 
      currentDirection: string, 
      targetX: number, 
      targetY: number,
      personality: "aggressive" | "ambush" | "random" = "aggressive"
    ): string => {
      // Check if at an intersection
      if (!isAtIntersection(ghostX, ghostY, currentDirection)) {
        // If about to hit a wall, check all possible directions
        if (needsToTurn(ghostX, ghostY, currentDirection)) {
          const allDirections = getValidDirections(ghostX, ghostY, "none");
          if (allDirections.length > 0) {
            return allDirections[Math.floor(Math.random() * allDirections.length)];
          }
        }
        return currentDirection;
      }
      
      const validDirections = getValidDirections(ghostX, ghostY, currentDirection);
      
      if (validDirections.length === 0) {
        // Fallback - if no valid directions, try all directions including opposite
        const allDirections = getValidDirections(ghostX, ghostY, "none");
        if (allDirections.length > 0) {
          return allDirections[Math.floor(Math.random() * allDirections.length)];
        }
        return currentDirection; // Keep current if still no options
      }
      
      // Different targeting strategies based on personality
      switch (personality) {
        case "aggressive": {
          // Direct chase - calculate distances to target for each direction
          const directionScores = validDirections.map(dir => {
            let nextX = ghostX;
            let nextY = ghostY;
            
            switch (dir) {
              case "left": nextX -= 20; break;
              case "right": nextX += 20; break;
              case "up": nextY -= 20; break;
              case "down": nextY += 20; break;
            }
            
            // Calculate distance to target
            const distance = Math.hypot(nextX - targetX, nextY - targetY);
            return { direction: dir, score: -distance }; // Negative because lower distance is better
          });
          
          // Sort by score (highest first)
          directionScores.sort((a, b) => b.score - a.score);
          
          // 70% chance to pick best direction, 30% chance to pick random
          if (Math.random() < 0.7) {
            return directionScores[0].direction;
          }
          break;
        }
          
        case "ambush": {
          // Predict where Pacman will be and target that spot
          let predictedX = targetX;
          let predictedY = targetY;
          
          // Look at pacman's direction and predict 10 steps ahead
          switch (pacmanDirection) {
            case "left": predictedX -= 80; break;
            case "right": predictedX += 80; break;
            case "up": predictedY -= 80; break;
            case "down": predictedY += 80; break;
          }
          
          // Now calculate distances to this predicted position
          const directionScores = validDirections.map(dir => {
            let nextX = ghostX;
            let nextY = ghostY;
            
            switch (dir) {
              case "left": nextX -= 20; break;
              case "right": nextX += 20; break;
              case "up": nextY -= 20; break;
              case "down": nextY += 20; break;
            }
            
            // Calculate distance to predicted position
            const distance = Math.hypot(nextX - predictedX, nextY - predictedY);
            return { direction: dir, score: -distance }; // Negative because lower distance is better
          });
          
          // Sort by score (highest first)
          directionScores.sort((a, b) => b.score - a.score);
          
          // 60% chance to pick best direction, 40% chance to pick random
          if (Math.random() < 0.6) {
            return directionScores[0].direction;
          }
          break;
        }
          
        case "random":
        default:
          // Nothing special, will fall through to random selection
          break;
      }
      
      // Random choice (fallback or random personality)
      return validDirections[Math.floor(Math.random() * validDirections.length)];
    };
    
    // Improved path turn detection
    const needsToTurn = (x: number, y: number, direction: string): boolean => {
      let nextX = x;
      let nextY = y;
      const lookAhead = 10; // Look further ahead for more responsive turning
      
      switch (direction) {
        case "left": nextX -= lookAhead; break;
        case "right": nextX += lookAhead; break;
        case "up": nextY -= lookAhead; break;
        case "down": nextY += lookAhead; break;
      }
      
      return !isOnPath(nextX, nextY);
    };
    
    // Improved Pacman direction selection with better path adherence
    const getPacmanNextDirection = (x: number, y: number, currentDirection: string): string => {
      // Pacman should be more user-driven, but still avoid running into walls
      if (!needsToTurn(x, y, currentDirection)) {
        return currentDirection;
      }
      
      // Getting current valid directions
      const validDirections = getValidDirections(x, y, currentDirection);
      
      if (validDirections.length === 0) {
        // If truly trapped, try all directions including the opposite
        const allDirections = getValidDirections(x, y, "none");
        if (allDirections.length > 0) {
          return allDirections[Math.floor(Math.random() * allDirections.length)];
        }
        
        // If still nothing, use the opposite direction
        const oppositeDirections: {[key: string]: string} = {
          "left": "right",
          "right": "left",
          "up": "down",
          "down": "up"
        };
        return oppositeDirections[currentDirection];
      }
      
      // Prefer continuing in same orientation, with occasional random choice
      const isHorizontal = currentDirection === "left" || currentDirection === "right";
      
      // First try to maintain same orientation for smooth movement
      const sameOrientationDirections = validDirections.filter(dir => {
        const dirIsHorizontal = dir === "left" || dir === "right";
        return dirIsHorizontal === isHorizontal;
      });
      
      // 80% chance to maintain orientation if possible
      if (sameOrientationDirections.length > 0 && Math.random() < 0.8) {
        return sameOrientationDirections[Math.floor(Math.random() * sameOrientationDirections.length)];
      }
      
      // Otherwise pick a random valid direction
      return validDirections[Math.floor(Math.random() * validDirections.length)];
    };
    
    // Improved character movement with path alignment
    const moveCharacter = (
      x: number, 
      y: number, 
      direction: string, 
      speed: number, 
      characterType: "pacman" | "ghost" = "pacman",
      targetX: number = 0, 
      targetY: number = 0,
      personality: "aggressive" | "ambush" | "random" = "aggressive"
    ) => {
      let newX = x;
      let newY = y;
      let newDirection = direction;
      
      // Path alignment to keep characters looking like they're on rails
      const alignToPath = () => {
        // Find the closest path and snap to it if we're slightly off
        const smallTolerance = 4;
        
        for (const path of paths) {
          // For horizontal paths
          if (path.y1 === path.y2 && Math.abs(path.y1 - newY) <= smallTolerance) {
            if (newX >= path.x1 - smallTolerance && newX <= path.x2 + smallTolerance) {
              newY = path.y1;
              break;
            }
          }
          
          // For vertical paths
          if (path.x1 === path.x2 && Math.abs(path.x1 - newX) <= smallTolerance) {
            if (newY >= path.y1 - smallTolerance && newY <= path.y2 + smallTolerance) {
              newX = path.x1;
              break;
            }
          }
        }
      };
      
      // First, determine if we need to change direction
      if (characterType === "ghost") {
        if (isAtIntersection(x, y, direction) || needsToTurn(x, y, direction)) {
          newDirection = getGhostNextDirection(x, y, direction, targetX, targetY, personality);
        }
      } else {
        // Pacman - mix player-like behavior with some AI
        
        // If we're at an intersection or about to hit a wall
        if (isAtIntersection(x, y, direction) || needsToTurn(x, y, direction)) {
          // Add occasional randomness to direction choice (every ~3 seconds)
          if (gameTime - lastIntersectionDecision > 180) {
            lastIntersectionDecision = gameTime;
          }
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
      if (isOnPath(newX, newY)) {
        // If we're on a path, align properly to it
        alignToPath();
        return { x: newX, y: newY, direction: newDirection };
      }
      
      // If not on path, try changing direction but keep current position
      return { x, y, direction: newDirection };
    };
    
    // Improved wraparound with smoother transitions
    const handleWrapAround = (pos: number, size: number, dimension: number): number => {
      const margin = size;
      
      if (pos < -margin) {
        return dimension + 2; // Add a little extra to ensure full visibility
      } else if (pos > dimension + margin) {
        return -2;
      }
      return pos;
    };
    
    // Enhanced Pacman drawing with better animation
    const drawPacman = (x: number, y: number, direction: string, mouthAngle: number) => {
      ctx.fillStyle = "#ffff00";
      ctx.beginPath();
      
      let startAngle = 0;
      let endAngle = Math.PI * 2;
      
      // Adjust mouth angles based on direction for more authentic look
      switch (direction) {
        case "right":
          startAngle = mouthAngle * Math.PI / 8;
          endAngle = (2 - mouthAngle / 8) * Math.PI;
          break;
        case "left":
          startAngle = Math.PI + mouthAngle * Math.PI / 8;
          endAngle = Math.PI * 3 - mouthAngle * Math.PI / 8;
          break;
        case "up":
          startAngle = Math.PI * 1.5 + mouthAngle * Math.PI / 8;
          endAngle = Math.PI * 1.5 - mouthAngle * Math.PI / 8;
          break;
        case "down":
          startAngle = Math.PI * 0.5 + mouthAngle * Math.PI / 8;
          endAngle = Math.PI * 0.5 - mouthAngle * Math.PI / 8;
          break;
      }
      
      ctx.arc(x, y, PACMAN_SIZE / 2, startAngle, endAngle);
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.fill();
    };
    
    // Improved ghost drawing with better animation
    const drawGhost = (x: number, y: number, color: string, direction: string, time: number) => {
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
      
      // Animate the bottom of the ghost for that classic "waving" effect
      const waveOffset = Math.sin(time / 10) * 2;
      
      // Ghost "skirt" with zigzag bottom and animation
      const zigzagWidth = GHOST_SIZE / 5;
      for (let i = 0; i < 5; i++) {
        const xPos = x + GHOST_SIZE / 2 - i * zigzagWidth;
        const yOffset = (i % 2 === 0) ? waveOffset : -waveOffset;
        
        if (i % 2 === 0) {
          ctx.lineTo(xPos, y + GHOST_SIZE / 2 + yOffset);
        } else {
          ctx.lineTo(xPos, y + GHOST_SIZE / 4 + yOffset);
        }
      }
      
      ctx.lineTo(x - GHOST_SIZE / 2, y - GHOST_SIZE / 4);
      ctx.fill();
      
      // Ghost eyes
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      
      // Eye position based on direction
      let eyeOffsetX = 0;
      let eyeOffsetY = 0;
      
      switch(direction) {
        case "left": eyeOffsetX = -2; break;
        case "right": eyeOffsetX = 2; break;
        case "up": eyeOffsetY = -2; break;
        case "down": eyeOffsetY = 2; break;
      }
      
      // Draw white of eyes
      ctx.arc(x - GHOST_SIZE / 5, y - GHOST_SIZE / 6, GHOST_SIZE / 8, 0, Math.PI * 2);
      ctx.arc(x + GHOST_SIZE / 5, y - GHOST_SIZE / 6, GHOST_SIZE / 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw pupils (change color based on scatter mode)
      ctx.fillStyle = ghostsScatterMode ? "#00AAFF" : "#0000FF";
      ctx.beginPath();
      ctx.arc(
        x - GHOST_SIZE / 5 + eyeOffsetX, 
        y - GHOST_SIZE / 6 + eyeOffsetY, 
        GHOST_SIZE / 16, 0, Math.PI * 2
      );
      ctx.arc(
        x + GHOST_SIZE / 5 + eyeOffsetX, 
        y - GHOST_SIZE / 6 + eyeOffsetY, 
        GHOST_SIZE / 16, 0, Math.PI * 2
      );
      ctx.fill();
    };
    
    // New function to draw power pellets (special dots)
    const drawPowerPellet = (x: number, y: number, time: number) => {
      // Pulsing animation
      const size = (Math.sin(time / 15) * 2) + 8;
      
      // Glowing effect
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner part
      ctx.fillStyle = "#ffaaff";
      ctx.beginPath();
      ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
      ctx.fill();
    };
    
    // Draw walls/paths with retro arcade style
    const drawPaths = () => {
      // Draw grid-like boundaries for that classic arcade look
      ctx.strokeStyle = "#1a1a8c"; // Classic blue maze color
      ctx.lineWidth = 2;
      
      paths.forEach(path => {
        ctx.beginPath();
        ctx.moveTo(path.x1, path.y1);
        ctx.lineTo(path.x2, path.y2);
        ctx.stroke();
      });
      
      // Add a glow effect in scatter mode
      if (ghostsScatterMode) {
        ctx.strokeStyle = "rgba(0, 100, 255, 0.2)";
        ctx.lineWidth = 4;
        
        paths.forEach(path => {
          ctx.beginPath();
          ctx.moveTo(path.x1, path.y1);
          ctx.lineTo(path.x2, path.y2);
          ctx.stroke();
        });
      }
    };
    
    // Scatter targets for ghost behavior
    const scatterTargets = [
      { x: 0, y: 0 },                      // Top left
      { x: canvas.width, y: 0 },           // Top right
      { x: 0, y: canvas.height },          // Bottom left
      { x: canvas.width, y: canvas.height } // Bottom right
    ];
    
    // Animation function
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update game time
      gameTime += 1;
      
      // Switch ghost behavior between scatter and chase every few seconds
      if (gameTime % ghostScatterInterval === 0) {
        ghostsScatterMode = !ghostsScatterMode;
        
        // Make scatter periods shorter as game progresses
        if (gameTime > 1800) { // After 30 seconds
          ghostScatterInterval = 180; // 3 seconds
        }
      }
      
      // Draw the maze and paths
      drawPaths();
      
      // Draw dots with improved spacing
      dots.forEach((dot, index) => {
        if (dot.visible) {
          // Every 10th dot is a power pellet
          if (index % 10 === 0) {
            drawPowerPellet(dot.x, dot.y, gameTime);
          } else {
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, DOT_SIZE / 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
      
      // Update pacman position with improved movement
      const pacmanMove = moveCharacter(
        pacmanX, 
        pacmanY, 
        pacmanDirection, 
        pacmanSpeed,
        "pacman"
      );
      pacmanX = pacmanMove.x;
      pacmanY = pacmanMove.y;
      pacmanDirection = pacmanMove.direction;
      
      // Update ghost positions with improved AI
      // Determine ghost targets based on mode
      let ghost1TargetX = pacmanX;
      let ghost1TargetY = pacmanY;
      let ghost2TargetX = pacmanX;
      let ghost2TargetY = pacmanY;
      
      if (ghostsScatterMode) {
        // In scatter mode, ghosts go to corners
        const target1 = scatterTargets[gameTime % 4];
        const target2 = scatterTargets[(gameTime + 2) % 4];
        
        ghost1TargetX = target1.x;
        ghost1TargetY = target1.y;
        ghost2TargetX = target2.x;
        ghost2TargetY = target2.y;
      } else {
        // In chase mode, red ghost targets pacman directly
        ghost1TargetX = pacmanX;
        ghost1TargetY = pacmanY;
        
        // Cyan ghost targets a position ahead of Pacman
        const lookAheadDistance = 80;
        switch (pacmanDirection) {
          case "right": ghost2TargetX = pacmanX + lookAheadDistance; break;
          case "left": ghost2TargetX = pacmanX - lookAheadDistance; break;
          case "up": ghost2TargetY = pacmanY - lookAheadDistance; break;
          case "down": ghost2TargetY = pacmanY + lookAheadDistance; break;
        }
      }
      
      // Move red ghost (aggressive)
      const ghostMove = moveCharacter(
        ghostX, 
        ghostY, 
        ghostDirection, 
        ghostSpeed, 
        "ghost", 
        ghost1TargetX, 
        ghost1TargetY,
        "aggressive"
      );
      ghostX = ghostMove.x;
      ghostY = ghostMove.y;
      ghostDirection = ghostMove.direction;
      
      // Move cyan ghost (ambush)
      const ghost2Move = moveCharacter(
        ghost2X, 
        ghost2Y, 
        ghost2Direction, 
        ghost2Speed, 
        "ghost", 
        ghost2TargetX, 
        ghost2TargetY,
        "ambush"
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
      
      // Draw characters in correct order (dots first, then pacman, then ghosts)
      drawPacman(pacmanX, pacmanY, pacmanDirection, pacmanMouth);
      drawGhost(ghostX, ghostY, "#ff0000", ghostDirection, gameTime); // Red ghost
      drawGhost(ghost2X, ghost2Y, "#00ffff", ghost2Direction, gameTime); // Cyan ghost
      
      // Collision detection for dots
      dots.forEach((dot, index) => {
        if (dot.visible && Math.hypot(pacmanX - dot.x, pacmanY - dot.y) < PACMAN_SIZE / 2) {
          dot.visible = false;
          
          // Power pellets give more points
          if (index % 10 === 0) {
            currentScore += 50;
          } else {
            currentScore += 10;
          }
          
          setScore(currentScore);
        }
      });
      
      // Draw score with retro-style font
      ctx.font = "14px 'Press Start 2P', monospace, Arial";
      ctx.fillStyle = "#ffffff";
      
      // Left-aligned score
      ctx.textAlign = "left";
      ctx.fillText(`SCORE: ${currentScore}`, 10, 20);
      
      // Right-aligned text
      ctx.textAlign = "right";
      if (!isMobile) {
        ctx.fillText("RETRO ARCADE", canvas.width - 10, 20);
      }
      
      // Check if all dots are collected - level complete!
      const dotsRemaining = dots.filter(dot => dot.visible).length;
      if (dotsRemaining === 0) {
        initGame(); // Reset the maze
        currentScore += 100; // Bonus for completing level
        setScore(currentScore);
      }
      
      // Visual effects for different game modes
      if (ghostsScatterMode && gameTime % 20 < 10) {
        // Add subtle blue flash in scatter mode
        ctx.fillStyle = "rgba(0, 100, 255, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Classic CRT scanline effect
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, y, canvas.width, 1);
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
    <div className="w-full bg-black overflow-hidden border-t-4 border-b-4 border-blue-500/30 relative">
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
