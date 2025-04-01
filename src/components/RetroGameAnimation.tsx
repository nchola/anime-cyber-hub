
import React, { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// Character and game element sizes
const PACMAN_SIZE = 30;
const DOT_SIZE = 6;
const GHOST_SIZE = 30;

const RetroGameAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMobile = useIsMobile();
  
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
    let pacmanAngle = 0;
    let pacmanMouth = 0;
    let mouthDirection = 1;
    let ghostX = canvas.width - GHOST_SIZE;
    let dots: {x: number, y: number, visible: boolean}[] = [];
    
    // Initialize dots
    const initDots = () => {
      dots = [];
      const dotsCount = Math.floor(canvas.width / 40);
      const centerY = canvas.height / 2;
      
      for (let i = 0; i < dotsCount; i++) {
        dots.push({
          x: 40 + i * 40,
          y: centerY,
          visible: true
        });
      }
    };
    
    initDots();
    
    // Animation function
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw maze-like paths
      ctx.strokeStyle = "#1a1a6c";
      ctx.lineWidth = 2;
      
      // Draw horizontal path
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      
      // Draw some vertical maze elements
      for (let i = 1; i < 8; i++) {
        const x = canvas.width / 8 * i;
        ctx.beginPath();
        if (i % 2 === 0) {
          ctx.moveTo(x, canvas.height / 2);
          ctx.lineTo(x, canvas.height / 4);
        } else {
          ctx.moveTo(x, canvas.height / 2);
          ctx.lineTo(x, canvas.height / 4 * 3);
        }
        ctx.stroke();
      }
      
      // Draw dots
      ctx.fillStyle = "#ffffff";
      dots.forEach(dot => {
        if (dot.visible) {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, DOT_SIZE / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // Draw Pacman
      ctx.fillStyle = "#ffff00";
      ctx.beginPath();
      ctx.arc(
        pacmanX + PACMAN_SIZE / 2,
        canvas.height / 2,
        PACMAN_SIZE / 2,
        pacmanAngle + pacmanMouth * Math.PI / 10,
        pacmanAngle + (2 - pacmanMouth / 10) * Math.PI,
        false
      );
      ctx.lineTo(pacmanX + PACMAN_SIZE / 2, canvas.height / 2);
      ctx.fill();
      
      // Draw Ghost
      ctx.fillStyle = "#ff0000";
      ctx.beginPath();
      // Ghost body (semi-circle + rectangle)
      ctx.arc(
        ghostX + GHOST_SIZE / 2,
        canvas.height / 2 - GHOST_SIZE / 4,
        GHOST_SIZE / 2,
        Math.PI,
        0,
        false
      );
      ctx.lineTo(ghostX + GHOST_SIZE, canvas.height / 2 + GHOST_SIZE / 4);
      
      // Ghost "skirt" with zigzag bottom
      const zigzagWidth = GHOST_SIZE / 4;
      for (let i = 0; i < 4; i++) {
        const xPos = ghostX + GHOST_SIZE - i * zigzagWidth;
        if (i % 2 === 0) {
          ctx.lineTo(xPos, canvas.height / 2 + GHOST_SIZE / 2);
        } else {
          ctx.lineTo(xPos, canvas.height / 2 + GHOST_SIZE / 4);
        }
      }
      
      ctx.lineTo(ghostX, canvas.height / 2 - GHOST_SIZE / 4);
      ctx.fill();
      
      // Ghost eyes
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(ghostX + GHOST_SIZE / 4, canvas.height / 2 - GHOST_SIZE / 8, GHOST_SIZE / 8, 0, Math.PI * 2);
      ctx.arc(ghostX + GHOST_SIZE * 3 / 4, canvas.height / 2 - GHOST_SIZE / 8, GHOST_SIZE / 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "#0000ff";
      ctx.beginPath();
      ctx.arc(ghostX + GHOST_SIZE / 4 - 2, canvas.height / 2 - GHOST_SIZE / 8, GHOST_SIZE / 16, 0, Math.PI * 2);
      ctx.arc(ghostX + GHOST_SIZE * 3 / 4 - 2, canvas.height / 2 - GHOST_SIZE / 8, GHOST_SIZE / 16, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw score and pixel game text
      ctx.font = "16px 'Press Start 2P', monospace, Arial";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.fillText("SCORE: 100", 10, 30);
      
      ctx.textAlign = "right";
      ctx.fillText("CYBER ARCADE", canvas.width - 10, 30);
      
      // Update animations
      pacmanX += 2;
      pacmanMouth += 0.2 * mouthDirection;
      
      if (pacmanMouth >= 2 || pacmanMouth <= 0) {
        mouthDirection *= -1;
      }
      
      ghostX -= 1.5;
      
      // Collision detection for dots
      dots.forEach(dot => {
        if (dot.visible && Math.abs(pacmanX + PACMAN_SIZE / 2 - dot.x) < PACMAN_SIZE / 2) {
          dot.visible = false;
        }
      });
      
      // Reset positions when they go off-screen
      if (pacmanX > canvas.width) {
        pacmanX = -PACMAN_SIZE;
        ghostX = canvas.width;
        initDots();
      }
      
      if (ghostX < -GHOST_SIZE) {
        ghostX = canvas.width;
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
      <div className="absolute top-2 left-2 right-2 flex justify-between">
        <div className="text-xs text-white font-orbitron hidden sm:block">←→: MOVE</div>
        <div className="text-xs text-white font-orbitron">PIXEL ARCADE DEMO</div>
        <div className="text-xs text-white font-orbitron hidden sm:block">SPACE: ACTION</div>
      </div>
      
      <div className="scanlines absolute inset-0 opacity-20"></div>
      
      <canvas
        ref={canvasRef}
        className="pixel-corners w-full"
        style={{ imageRendering: "pixelated" }}
      />
      
      <div className="absolute bottom-0 left-0 right-0 bg-black h-6 flex justify-center items-center">
        <div className="h-2 w-2 bg-cyber-accent mx-1 animate-pulse"></div>
        <div className="h-2 w-2 bg-cyber-purple mx-1 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
        <div className="h-2 w-2 bg-cyber-accent mx-1 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
      </div>
    </div>
  );
};

export default RetroGameAnimation;
