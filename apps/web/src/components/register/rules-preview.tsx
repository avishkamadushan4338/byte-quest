import * as pdfjs from "pdfjs-dist";
import { useEffect, useRef, useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PREVIEW_SCALE = 1.4;

type PreviewStatus = "loading" | "ready" | "error";

const renderPage = async (
  doc: pdfjs.PDFDocumentProxy,
  pageNumber: number
): Promise<HTMLCanvasElement> => {
  const page = await doc.getPage(pageNumber);
  const viewport = page.getViewport({ scale: PREVIEW_SCALE });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas 2D context unavailable");
  }
  await page.render({ canvas, canvasContext: context, viewport }).promise;
  return canvas;
};

export const RulesPreview = ({
  src,
  title,
}: {
  src: string;
  title: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<PreviewStatus>("loading");

  useEffect(() => {
    const container = containerRef.current;
    let cancelled = false;
    const loadingTask = pdfjs.getDocument({ url: src });

    const run = async () => {
      try {
        const doc = await loadingTask.promise;
        const pageNumbers = Array.from(
          { length: doc.numPages },
          (_, i) => i + 1
        );
        const canvases = await Promise.all(
          pageNumbers.map((pageNumber) => renderPage(doc, pageNumber))
        );
        if (cancelled) {
          return;
        }
        container?.replaceChildren(...canvases);
        setStatus("ready");
      } catch {
        if (!cancelled) {
          setStatus("error");
        }
      }
    };

    run();

    return () => {
      cancelled = true;
      loadingTask.destroy();
      container?.replaceChildren();
    };
  }, [src]);

  return (
    <div className="mt-4">
      {status === "loading" ? (
        <p className="text-muted-2 m-0 text-[14px]">Loading preview…</p>
      ) : null}
      {status === "error" ? (
        <p className="text-muted-2 m-0 text-[14px]">
          Preview unavailable. Use the download link below.
        </p>
      ) : null}
      <div
        aria-label={title}
        className="max-h-[560px] overflow-y-auto rounded-[10px] bg-[#0b1411] p-3 [&_canvas]:mx-auto [&_canvas]:mb-3 [&_canvas]:block [&_canvas]:w-full [&_canvas]:max-w-full [&_canvas]:rounded-[4px]"
        ref={containerRef}
        role="document"
      />
    </div>
  );
};
