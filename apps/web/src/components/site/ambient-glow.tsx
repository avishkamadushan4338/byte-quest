export interface AmbientBlob {
  id: string;
  top: number;
  left: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

const PALETTE = [
  "82,255,61",
  "0,169,154",
  "183,240,0",
  "212,175,55",
  "240,216,117",
];

const randomBetween = (min: number, max: number) =>
  min + Math.random() * (max - min);

/** Runs once per request on the server (inside the root loader), so the
 * client hydrates with the exact same values instead of re-rolling them. */
export const generateAmbientBlobs = (count = 7): AmbientBlob[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `ambient-${index}`,
    top: randomBetween(-10, 100),
    left: randomBetween(-10, 100),
    size: randomBetween(260, 620),
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)] ?? PALETTE[0],
    duration: randomBetween(3, 6),
    delay: randomBetween(0, 3),
  }));

export const AmbientGlow = ({ blobs }: { blobs: AmbientBlob[] }) => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 -z-10 mix-blend-screen"
  >
    {blobs.map((blob) => (
      <span
        className="animate-ambient-drift absolute rounded-full blur-[90px]"
        key={blob.id}
        style={{
          top: `${blob.top}%`,
          left: `${blob.left}%`,
          width: blob.size,
          height: blob.size,
          background: `radial-gradient(circle, rgba(${blob.color},0.4), transparent 70%)`,
          animationDuration: `${blob.duration}s`,
          animationDelay: `${blob.delay}s`,
        }}
      />
    ))}
  </div>
);
