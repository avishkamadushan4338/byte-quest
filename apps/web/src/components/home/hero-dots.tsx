import { useEffect, useRef } from "react";

const POINT_COUNT = 1100;
const FOV_DEGREES = 38;
const CAMERA_Z = 9;
const POINT_SIZE = 0.018;
const DESKTOP_OFFSET_X = -2.2;
const MOBILE_BREAKPOINT = 900;
const MAX_PIXEL_RATIO = 2;
const SPIN_SPEED = 0.03;
const EASING = 0.05;
const SCROLL_LIMIT = 1.5;
const REDUCED_SPEED = 0.15;
const DOT_COLOR = "rgba(185,245,208,0.5)";

interface Point {
  x: number;
  y: number;
  z: number;
}

const createPoints = (): Point[] =>
  Array.from({ length: POINT_COUNT }, () => {
    const radius = 3 + Math.random() * 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    return {
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.sin(phi) * Math.sin(theta) * 0.6,
      z: radius * Math.cos(phi),
    };
  });

export const HeroDots = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !parent || !context) {
      return;
    }

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const speed = reduce ? REDUCED_SPEED : 1;
    const points = createPoints();
    const tanHalf = Math.tan((FOV_DEGREES * Math.PI) / 360);
    const start = performance.now();
    let width = 0;
    let height = 0;
    let rootX = 0;
    let rootY = 0;
    let frame = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      canvas.style.opacity = width < MOBILE_BREAKPOINT ? "0.6" : "1";
    };

    const draw = () => {
      const scrollProgress = window.scrollY / window.innerHeight;
      if (scrollProgress < SCROLL_LIMIT && width > 0) {
        const elapsed = (performance.now() - start) / 1000;
        const spin = elapsed * SPIN_SPEED * speed;
        rootY += (scrollProgress * 0.8 - rootY) * EASING;
        rootX += (scrollProgress * 0.3 - rootX) * EASING;
        const cameraZ = CAMERA_Z + scrollProgress * 3;
        const offsetX = width < MOBILE_BREAKPOINT ? 0 : DESKTOP_OFFSET_X;
        const aspect = width / height;
        const spinCos = Math.cos(spin);
        const spinSin = Math.sin(spin);
        const yCos = Math.cos(rootY);
        const ySin = Math.sin(rootY);
        const xCos = Math.cos(rootX);
        const xSin = Math.sin(rootX);

        context.clearRect(0, 0, width, height);
        context.fillStyle = DOT_COLOR;
        for (const point of points) {
          const dx = point.x * spinCos + point.z * spinSin;
          const dz = -point.x * spinSin + point.z * spinCos;
          const rx = dx * yCos + dz * ySin;
          const rz = -dx * ySin + dz * yCos;
          const wy = point.y * xCos - rz * xSin;
          const wz = point.y * xSin + rz * xCos;
          const distance = cameraZ - wz;
          if (distance > 0.1) {
            const screenX =
              width / 2 +
              ((rx + offsetX) / (distance * tanHalf * aspect)) * (width / 2);
            const screenY =
              height / 2 - (wy / (distance * tanHalf)) * (height / 2);
            const size = (POINT_SIZE * (height / 2)) / distance;
            context.fillRect(screenX, screenY, size, size);
          }
        }
      }
      frame = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      aria-hidden="true"
      className="absolute inset-0 block size-full"
      ref={canvasRef}
    />
  );
};
