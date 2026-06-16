import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme-context";

// Each entry: [r, g, b] — alpha is applied per-particle at draw time
const THEME_RGB: Record<string, [number, number, number][]> = {
  light:  [[30, 58, 138],  [245, 158, 11],  [30, 58, 138]],
  dark:   [[30, 58, 138],  [245, 158, 11],  [99, 102, 241]],
  blue:   [[6, 182, 212],  [59, 130, 246],  [16, 185, 129]],
  purple: [[139, 92, 246], [236, 72, 153],  [99, 102, 241]],
  green:  [[16, 185, 129], [5, 150, 105],   [6, 182, 212]],
};

interface Particle {
  x: number; y: number; vx: number; vy: number; r: number; alpha: number;
  rgb: [number, number, number];
}

export function AnimatedBackground() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const palette = THEME_RGB[theme] ?? THEME_RGB.light;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();

    particlesRef.current = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: 90 + Math.random() * 130,
      alpha: 0.06 + Math.random() * 0.07,
      rgb: palette[i % palette.length],
    }));

    let lastTime = 0;
    function draw(time: number) {
      if (!ctx || !canvas) return;
      const dt = Math.min(time - lastTime, 50);
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        if (p.x < -p.r) p.x = canvas.width + p.r;
        if (p.x > canvas.width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = canvas.height + p.r;
        if (p.y > canvas.height + p.r) p.y = -p.r;

        const [r, g, b] = p.rgb;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, `rgba(${r},${g},${b},${p.alpha})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
