import React, { useState, useEffect, useRef } from 'react';
import { FALLBACK_HERO_IMG } from '../data';

interface HeroScrollSectionProps {
  onAddToCart?: (item: any) => void;
  currency?: string;
  onScrollProgress?: (progress: number) => void;
}

const TOTAL_FRAMES = 300;

export function HeroScrollSection({ onAddToCart, currency, onScrollProgress }: HeroScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isolineCanvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const fallbackImgRef = useRef<HTMLImageElement | null>(null);

  // Background animated isoline wave topology
  useEffect(() => {
    const canvas = isolineCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resizeIsolines = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };

    resizeIsolines();
    window.addEventListener('resize', resizeIsolines);

    const drawIsolines = () => {
      time += 0.007;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const rings = 20;

      // Draw concentric isoline soundwave contours
      for (let r = 1; r <= rings; r++) {
        const radius = (r / rings) * Math.min(w, h) * 0.75;
        ctx.beginPath();
        const segments = 120;

        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const wave =
            Math.sin(angle * 5 + time * 1.5 + r * 0.4) * (8 + r * 1.8) +
            Math.cos(angle * 3 - time * 0.8) * 6;
          const currentR = radius + wave;
          const x = cx + Math.cos(angle) * currentR;
          const y = cy + Math.sin(angle) * currentR;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();

        const alpha = Math.max(0.02, (1 - r / rings) * 0.14);
        ctx.strokeStyle = `rgba(229, 196, 151, ${alpha})`;
        ctx.lineWidth = r % 3 === 0 ? 1.5 : 0.75;
        if (r % 4 === 0) {
          ctx.setLineDash([6, 6]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();
      }

      animationId = requestAnimationFrame(drawIsolines);
    };

    drawIsolines();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeIsolines);
    };
  }, []);

  // Preload frame sequence & fallback master asset
  useEffect(() => {
    const fbImg = new Image();
    fbImg.crossOrigin = 'anonymous';
    fbImg.src = FALLBACK_HERO_IMG;
    fbImg.onload = () => {
      fallbackImgRef.current = fbImg;
      renderFrame(1, 0);
    };

    const images: HTMLImageElement[] = [];

    // Frame 1
    const first = new Image();
    first.src = '/ezgif-frame-001.jpg';
    first.onload = () => {
      renderFrame(1, 0);
    };
    first.onerror = () => {
      const alt = new Image();
      alt.src = 'ezgif-frame-001.jpg';
      alt.onload = () => renderFrame(1, 0);
      images[1] = alt;
    };
    images[1] = first;

    // Remaining frames 2 to 300
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = String(i).padStart(3, '0');
      img.src = `/ezgif-frame-${num}.jpg`;

      img.onerror = () => {
        const altImg = new Image();
        altImg.src = `ezgif-frame-${num}.jpg`;
        images[i] = altImg;
      };

      images[i] = img;
    }

    imagesRef.current = images;
  }, []);

  // Frame rendering with full-screen exploded rotation
  const renderFrame = (frameNum: number, progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    if (cw === 0 || ch === 0) return;

    ctx.clearRect(0, 0, cw, ch);

    // Check loaded sequence frames
    let frameImg = imagesRef.current[frameNum];
    if (!frameImg || !frameImg.complete || frameImg.naturalWidth === 0) {
      for (let k = frameNum - 1; k >= 1; k--) {
        if (imagesRef.current[k]?.complete && imagesRef.current[k].naturalWidth > 0) {
          frameImg = imagesRef.current[k];
          break;
        }
      }
    }

    // CASE 1: Render 300-frame sequence image
    if (frameImg && frameImg.complete && frameImg.naturalWidth > 0) {
      const iw = frameImg.naturalWidth;
      const ih = frameImg.naturalHeight;
      const scale = Math.min(cw / iw, ch / ih) * 0.95;
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;

      ctx.save();
      ctx.translate(cw / 2, ch / 2);
      ctx.scale(1 + progress * 0.06, 1 + progress * 0.06);
      ctx.drawImage(frameImg, -dw / 2, -dh / 2, dw, dh);
      ctx.restore();
      return;
    }

    // CASE 2: Dynamic Headphone Exploded View & 360 Rotation
    const fb = fallbackImgRef.current;
    if (fb && fb.complete && fb.naturalWidth > 0) {
      ctx.save();
      ctx.translate(cw / 2, ch / 2);

      const rotationAngle = progress * Math.PI * 2 * 0.35;
      const explodeDist = progress * 140;
      const baseScale = Math.min(cw / fb.naturalWidth, ch / fb.naturalHeight) * 0.82 * (1 + progress * 0.1);

      const dw = fb.naturalWidth * baseScale;
      const dh = fb.naturalHeight * baseScale;

      // Ambient headphone focus glow
      const glow = ctx.createRadialGradient(0, 0, 20, 0, 0, dw * 0.65);
      glow.addColorStop(0, 'rgba(229, 196, 151, 0.16)');
      glow.addColorStop(0.6, 'rgba(229, 196, 151, 0.04)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(-dw, -dh, dw * 2, dh * 2);

      // Exploded View Outer Components
      if (progress > 0.04) {
        // Right Transducer Plate
        ctx.save();
        ctx.translate(explodeDist * 0.95, -explodeDist * 0.22);
        ctx.rotate(rotationAngle * 0.35);
        ctx.globalAlpha = Math.min(1, 0.4 + progress * 0.6);
        ctx.drawImage(fb, -dw / 2, -dh / 2, dw, dh);

        ctx.beginPath();
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = 'rgba(229, 196, 151, 0.45)';
        ctx.lineWidth = 1;
        ctx.moveTo(0, 0);
        ctx.lineTo(-explodeDist * 0.95, explodeDist * 0.22);
        ctx.stroke();
        ctx.restore();

        // Left Transducer Plate
        ctx.save();
        ctx.translate(-explodeDist * 0.95, explodeDist * 0.22);
        ctx.rotate(-rotationAngle * 0.35);
        ctx.globalAlpha = Math.min(1, 0.4 + progress * 0.6);
        ctx.drawImage(fb, -dw / 2, -dh / 2, dw, dh);

        ctx.beginPath();
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = 'rgba(229, 196, 151, 0.45)';
        ctx.lineWidth = 1;
        ctx.moveTo(0, 0);
        ctx.lineTo(explodeDist * 0.95, -explodeDist * 0.22);
        ctx.stroke();
        ctx.restore();

        // Headband Arc
        ctx.save();
        ctx.translate(0, -explodeDist * 0.7);
        ctx.globalAlpha = Math.min(1, 0.45 + progress * 0.55);
        ctx.drawImage(fb, -dw / 2, -dh / 2, dw, dh);

        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = 'rgba(229, 196, 151, 0.35)';
        ctx.lineWidth = 1;
        ctx.moveTo(0, 0);
        ctx.lineTo(0, explodeDist * 0.7);
        ctx.stroke();
        ctx.restore();
      }

      // Core rotated headphone unit
      ctx.save();
      ctx.rotate(rotationAngle);
      ctx.globalAlpha = 1;
      ctx.drawImage(fb, -dw / 2, -dh / 2, dw, dh);
      ctx.restore();

      ctx.restore();
    }
  };

  const updateCanvasSize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    renderFrame(currentFrame, scrollProgress);
  };

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [currentFrame, scrollProgress]);

  // Scroll listener tracking the complete scroll animation sequence
  useEffect(() => {
    let animationFrameId: number | null = null;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScrolled = -rect.top;
      const rawProgress = currentScrolled / totalScrollable;
      const progress = Math.max(0, Math.min(1, rawProgress));

      setScrollProgress(progress);
      onScrollProgress?.(progress);

      const targetFrame = Math.min(
        TOTAL_FRAMES,
        Math.max(1, Math.floor(progress * (TOTAL_FRAMES - 1)) + 1)
      );

      setCurrentFrame(targetFrame);
      renderFrame(targetFrame, progress);
    };

    const onScrollThrottled = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScrollThrottled, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScrollThrottled);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [onScrollProgress]);

  return (
    <section ref={containerRef} className="relative w-full h-[260vh] bg-background">
      {/* Sticky Fullscreen Viewport Stage: PURE isoline animation + exploded scroll sequence */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Fullscreen Interactive Isoline Wave Canvas */}
        <canvas
          ref={isolineCanvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
        />

        {/* Ambient radial lighting */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[70vw] h-[70vh] max-w-5xl max-h-[700px] bg-primary/10 rounded-full blur-[160px]"></div>
          <div className="absolute w-[45vw] h-[45vh] max-w-3xl max-h-[450px] bg-secondary/8 rounded-full blur-[120px]"></div>
        </div>

        {/* Fullscreen Centered Headphone Exploded View Canvas Stage */}
        <div className="relative z-10 w-full h-full max-w-6xl flex items-center justify-center p-4">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain select-none cursor-grab active:cursor-grabbing drop-shadow-[0_30px_70px_rgba(0,0,0,0.7)]"
          />
        </div>

        {/* Minimal Scroll Progression Indicator */}
        <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center justify-center gap-2 pointer-events-none z-20">
          <div className="w-52 h-1 bg-surface-container-high/80 rounded-full overflow-hidden border border-outline-variant/30 backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-primary via-secondary to-primary transition-all duration-75 ease-out"
              style={{ width: `${Math.max(5, scrollProgress * 100)}%` }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
