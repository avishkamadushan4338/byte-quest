import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DownloadSimpleIcon,
} from "@phosphor-icons/react";
import type { ReactNode } from "react";

const LABEL_PATTERN = /^(?<leading>←s*)?(?<text>.*?)(?<trailing>s*[→↓])?$/su;
const DOWN_ARROW = "↓";

interface ArrowLabelProps {
  children: string;
  className?: string;
}

/**
 * Renders a label whose leading "←" or trailing "→" / "↓" glyph is swapped for a
 * Phosphor icon, so copy stored in data files stays plain text.
 */
export const ArrowLabel = ({
  children,
  className,
}: ArrowLabelProps): ReactNode => {
  const { leading, text, trailing } =
    LABEL_PATTERN.exec(children)?.groups ?? {};
  const isDownload = trailing?.includes(DOWN_ARROW) ?? false;

  return (
    <>
      {leading ? (
        <ArrowLeftIcon
          aria-hidden="true"
          className={className ?? "mr-2 inline-block shrink-0"}
          weight="bold"
        />
      ) : null}
      {text ?? children}
      {trailing && isDownload ? (
        <DownloadSimpleIcon
          aria-hidden="true"
          className={className ?? "ml-2 inline-block shrink-0"}
          weight="bold"
        />
      ) : null}
      {trailing && !isDownload ? (
        <ArrowRightIcon
          aria-hidden="true"
          className={className ?? "ml-2 inline-block shrink-0"}
          weight="bold"
        />
      ) : null}
    </>
  );
};
