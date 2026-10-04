import { Brand } from "@byte-quest/ui/components/brand";
import { cn } from "@byte-quest/ui/lib/utils";

import type { StudentDetails, VolunteerPhoto } from "./data";
import { idCard, validationCopy } from "./data";

interface VolunteerIdCardProps {
  photo: VolunteerPhoto | null;
  reference: string;
  roles: string[];
  student: StudentDetails;
}

interface IdCardRenderOptions {
  photoUrl: string | null;
  reference: string;
  roles: string[];
  student: StudentDetails;
}

interface FontStyle {
  size: number;
  weight?: number;
  font?: string;
}

interface TextStyle extends FontStyle {
  colour: string;
}

const CARD_WIDTH = 1012;
const CARD_HEIGHT = 638;
const CARD_MARGIN = 48;
const BAR_COUNT = 24;

const DISPLAY_FONT = '"Space Grotesk", ui-sans-serif, system-ui, sans-serif';
const MONO_FONT = '"JetBrains Mono", ui-monospace, monospace';

const barcodeBars = (reference: string) =>
  Array.from({ length: BAR_COUNT }, (_, index) => {
    const code = reference.codePointAt(index % reference.length) ?? 0;
    return {
      filled: (code + index) % 2 === 0,
      key: `${index}-${code}`,
      width: 3 + (code % 4),
    };
  });

const setFont = (ctx: CanvasRenderingContext2D, style: FontStyle) => {
  ctx.font = `${style.weight ?? 500} ${style.size}px ${style.font ?? MONO_FONT}`;
};

const fillText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  style: TextStyle
) => {
  ctx.fillStyle = style.colour;
  setFont(ctx, style);
  ctx.fillText(text, x, y);
};

const loadImage = async (src: string): Promise<HTMLImageElement | null> => {
  const image = new Image();
  image.src = src;
  try {
    await image.decode();
    return image;
  } catch {
    return null;
  }
};

const drawImageCover = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const ratio = Math.max(width / image.width, height / image.height);
  const drawWidth = image.width * ratio;
  const drawHeight = image.height * ratio;
  ctx.drawImage(
    image,
    x + (width - drawWidth) / 2,
    y + (height - drawHeight) / 2,
    drawWidth,
    drawHeight
  );
};

const drawRoundedFrame = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
};

const drawBackground = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = "#020807";
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  const teal = ctx.createRadialGradient(
    CARD_WIDTH,
    0,
    0,
    CARD_WIDTH,
    0,
    CARD_WIDTH * 0.72
  );
  teal.addColorStop(0, "rgba(0,169,154,0.35)");
  teal.addColorStop(1, "rgba(0,169,154,0)");
  ctx.fillStyle = teal;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  const gold = ctx.createRadialGradient(
    0,
    CARD_HEIGHT,
    0,
    0,
    CARD_HEIGHT,
    CARD_WIDTH * 0.6
  );
  gold.addColorStop(0, "rgba(212,175,55,0.22)");
  gold.addColorStop(1, "rgba(212,175,55,0)");
  ctx.fillStyle = gold;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  const base = ctx.createLinearGradient(140, 0, CARD_WIDTH * 0.75, CARD_HEIGHT);
  base.addColorStop(0, "#0a2a20");
  base.addColorStop(0.7, "#020807");
  base.addColorStop(1, "#020807");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  const stripe = ctx.createLinearGradient(0, 0, CARD_WIDTH, 0);
  stripe.addColorStop(0, "#00a99a");
  stripe.addColorStop(0.4, "#52ff3d");
  stripe.addColorStop(0.7, "#b7f000");
  stripe.addColorStop(1, "#d4af37");
  ctx.fillStyle = stripe;
  ctx.fillRect(0, 0, CARD_WIDTH, 8);

  ctx.strokeStyle = "rgba(242,247,244,0.18)";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, CARD_WIDTH - 2, CARD_HEIGHT - 2);
};

const drawHeader = (
  ctx: CanvasRenderingContext2D,
  crest: HTMLImageElement | null
) => {
  if (crest) {
    const height = 58;
    const width = crest.width * (height / crest.height);
    ctx.drawImage(crest, CARD_MARGIN, 56, width, height);
  }

  const wordmarkX = CARD_MARGIN + 78;
  fillText(ctx, "BYTE", wordmarkX, 96, {
    colour: "#f2f7f4",
    font: DISPLAY_FONT,
    size: 32,
    weight: 700,
  });
  const byteWidth = ctx.measureText("BYTE").width;
  fillText(ctx, "/", wordmarkX + byteWidth, 96, {
    colour: "#52ff3d",
    font: DISPLAY_FONT,
    size: 32,
    weight: 700,
  });
  fillText(ctx, "QUEST", wordmarkX + byteWidth + 14, 96, {
    colour: "#f2f7f4",
    font: DISPLAY_FONT,
    size: 32,
    weight: 700,
  });

  const chipText = idCard.chip;
  setFont(ctx, { size: 15, weight: 700 });
  const chipWidth = ctx.measureText(chipText).width + 30;
  const chipHeight = 32;
  const chipX = CARD_WIDTH - CARD_MARGIN - chipWidth;
  ctx.fillStyle = "#52ff3d";
  drawRoundedFrame(ctx, chipX, 68, chipWidth, chipHeight, 6);
  ctx.fill();
  fillText(ctx, chipText, chipX + 15, 90, {
    colour: "#020807",
    size: 15,
    weight: 700,
  });

  ctx.textAlign = "right";
  fillText(ctx, idCard.schoolLine, chipX - 24, 90, {
    colour: "#6f877c",
    size: 14,
  });
  ctx.textAlign = "left";
};

const drawPhoto = (
  ctx: CanvasRenderingContext2D,
  photo: HTMLImageElement | null,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  ctx.save();
  ctx.fillStyle = "rgba(2,8,7,0.7)";
  drawRoundedFrame(ctx, x, y, width, height, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(212,175,55,0.55)";
  ctx.lineWidth = 2;
  ctx.stroke();
  if (photo) {
    drawRoundedFrame(ctx, x, y, width, height, 14);
    ctx.clip();
    drawImageCover(ctx, photo, x, y, width, height);
  } else {
    fillText(
      ctx,
      validationCopy.photoPlaceholder,
      x + width / 2 - 26,
      y + height / 2,
      { colour: "#5e7469", size: 14 }
    );
  }
  ctx.restore();
};

const drawBarcode = (ctx: CanvasRenderingContext2D, reference: string) => {
  const bars = barcodeBars(reference);
  const totalWidth = bars.reduce((total, bar) => total + bar.width + 2, 0);
  let cursorX = CARD_WIDTH - CARD_MARGIN - totalWidth;
  const top = CARD_HEIGHT - CARD_MARGIN - 58;

  for (const bar of bars) {
    if (bar.filled) {
      ctx.fillStyle = "rgba(242,247,244,0.85)";
      ctx.fillRect(cursorX, top, bar.width, 58);
    }
    cursorX += bar.width + 2;
  }
};

export const renderVolunteerIdCard = async (options: IdCardRenderOptions) => {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  await document.fonts.ready;
  const [crest, photo] = await Promise.all([
    loadImage(idCard.crestSrc),
    options.photoUrl ? loadImage(options.photoUrl) : Promise.resolve(null),
  ]);

  drawBackground(ctx);
  drawHeader(ctx, crest);
  drawPhoto(ctx, photo, CARD_MARGIN, 150, 236, 295);

  const infoX = CARD_MARGIN + 268;
  fillText(ctx, idCard.schoolLabel, infoX, 178, {
    colour: "#5e7469",
    size: 14,
  });
  fillText(ctx, options.student.school, infoX, 204, {
    colour: "#d5e1db",
    font: DISPLAY_FONT,
    size: 20,
    weight: 500,
  });
  fillText(ctx, options.student.fullName, infoX, 254, {
    colour: "#f2f7f4",
    font: DISPLAY_FONT,
    size: 38,
    weight: 700,
  });
  fillText(ctx, options.roles.join(" · "), infoX, 288, {
    colour: "#b7f000",
    font: DISPLAY_FONT,
    size: 18,
    weight: 600,
  });

  fillText(ctx, idCard.classLabel, infoX, 340, { colour: "#5e7469", size: 14 });
  fillText(
    ctx,
    `Gr ${options.student.grade ?? "—"} · ${options.student.className}`,
    infoX,
    366,
    { colour: "#d5e1db", size: 17 }
  );
  fillText(ctx, idCard.admissionLabel, infoX + 240, 340, {
    colour: "#5e7469",
    size: 14,
  });
  fillText(ctx, options.student.admissionNumber, infoX + 240, 366, {
    colour: "#d5e1db",
    size: 17,
  });

  fillText(ctx, idCard.idLabel, CARD_MARGIN, CARD_HEIGHT - 92, {
    colour: "#5e7469",
    size: 14,
  });
  fillText(ctx, options.reference, CARD_MARGIN, CARD_HEIGHT - 64, {
    colour: "#52ff3d",
    size: 24,
    weight: 700,
  });
  drawBarcode(ctx, options.reference);

  const link = document.createElement("a");
  link.download = `${options.reference}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
};

export const VolunteerIdCard = ({
  photo,
  reference,
  roles,
  student,
}: VolunteerIdCardProps) => {
  const classValue = `Gr ${student.grade ?? "—"} · ${student.className}`;

  return (
    <div className="grid gap-3">
      <div
        className="border-line-fg/18 relative flex aspect-[1.586/1] flex-col overflow-hidden rounded-[22px] border p-[clamp(14px,2vw,22px)] shadow-[0_0_60px_-20px_rgba(82,255,61,0.35)]"
        style={{
          background:
            "radial-gradient(70% 60% at 100% 0%, rgba(0,169,154,0.35), transparent 60%), radial-gradient(70% 60% at 0% 100%, rgba(212,175,55,0.22), transparent 60%), linear-gradient(150deg,#0a2a20,#020807 70%)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1"
          style={{
            background:
              "linear-gradient(90deg,#00a99a,#52ff3d,#b7f000,#d4af37)",
          }}
        />

        <div className="border-line-fg/12 flex items-center justify-between gap-3 border-b pb-[clamp(9px,1.3vw,15px)]">
          <div className="flex min-w-0 items-center gap-2.5">
            <img alt="" className="h-7 w-auto" src={idCard.crestSrc} />
            <Brand className="text-[clamp(13px,1.5vw,18px)]" />
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="text-faint font-mono text-[8.5px] tracking-[0.14em]">
              {idCard.schoolLine}
            </span>
            <span className="bg-volt text-ink rounded-[5px] px-1.5 py-[3px] font-mono text-[8.5px] tracking-[0.12em]">
              {idCard.chip}
            </span>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-[30%_1fr] items-center gap-[clamp(10px,1.8vw,22px)] pt-[clamp(9px,1.3vw,15px)]">
          {photo ? (
            <img
              alt={idCard.photoAlt}
              aria-label={idCard.photoAlt}
              className="border-gold/55 aspect-[4/5] w-full rounded-[12px] border-[1.5px] object-cover"
              src={photo.url}
            />
          ) : (
            <div className="border-gold/55 bg-ink/60 text-faint-2 flex aspect-[4/5] w-full items-center justify-center rounded-[12px] border-[1.5px] font-mono text-[10px] tracking-[0.12em]">
              {validationCopy.photoPlaceholder}
            </div>
          )}

          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-faint-2 font-mono text-[8px] tracking-[0.16em]">
              {idCard.schoolLabel}
            </span>
            <span className="text-fg-dim truncate text-[11px]">
              {student.school}
            </span>
            <h3 className="font-display text-fg line-clamp-2 text-[clamp(15px,1.7vw,22px)] leading-[1.1] tracking-[-0.03em]">
              {student.fullName}
            </h3>
            <p className="text-lime text-[clamp(10px,1vw,12px)] font-semibold">
              {roles.join(" · ")}
            </p>
            <div className="mt-auto grid grid-cols-2 gap-2 pt-2">
              <div>
                <div className="text-faint-2 font-mono text-[8px] tracking-[0.16em]">
                  {idCard.classLabel}
                </div>
                <div className="text-fg-dim font-mono text-[10.5px]">
                  {classValue}
                </div>
              </div>
              <div>
                <div className="text-faint-2 font-mono text-[8px] tracking-[0.16em]">
                  {idCard.admissionLabel}
                </div>
                <div className="text-fg-dim font-mono text-[10.5px]">
                  {student.admissionNumber}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-line-fg/12 mt-auto flex items-end justify-between gap-4 border-t pt-[clamp(8px,1.2vw,14px)]">
          <div>
            <div className="text-faint-2 font-mono text-[8px] tracking-[0.16em]">
              {idCard.idLabel}
            </div>
            <div className="text-volt font-mono text-[clamp(11px,1.2vw,14px)] tracking-[0.06em]">
              {reference}
            </div>
          </div>
          <div aria-hidden="true" className="flex h-8 items-stretch gap-[2px]">
            {barcodeBars(reference).map((bar) => (
              <span
                className={cn(
                  "h-full",
                  bar.filled ? "bg-fg/85" : "bg-transparent"
                )}
                key={bar.key}
                style={{ width: bar.width }}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-faint-2 text-center font-mono text-[10.5px] tracking-[0.18em]">
        {idCard.tagline}
      </p>
    </div>
  );
};
