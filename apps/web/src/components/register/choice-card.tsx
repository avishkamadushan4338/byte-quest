import type { ReactNode } from "react";

interface ChoiceCardProps {
  name: string;
  selected: boolean;
  color: string;
  kicker: string;
  title: string;
  description: string;
  onSelect: () => void;
  children?: ReactNode;
}

export const ChoiceCard = ({
  name,
  selected,
  color,
  kicker,
  title,
  description,
  onSelect,
  children,
}: ChoiceCardProps) => {
  const border = selected ? color : "rgba(185,245,208,0.12)";
  return (
    <label
      className="text-fg has-[:focus-visible]:outline-volt relative flex cursor-pointer flex-col gap-3 rounded-[18px] p-[22px] text-left font-sans transition-all duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[3px]"
      style={{
        background: selected
          ? "linear-gradient(160deg,#0A2A20,#020807)"
          : "#020807",
        border: `1px solid ${border}`,
      }}
    >
      <input
        checked={selected}
        className="sr-only"
        name={name}
        onChange={onSelect}
        type="radio"
      />
      <span
        aria-hidden="true"
        className="absolute top-[18px] right-[18px] flex size-5 items-center justify-center rounded-full"
        style={{ border: `1px solid ${border}` }}
      >
        <span
          className="size-2.5 rounded-full"
          style={{ background: selected ? color : "transparent" }}
        />
      </span>
      <span
        className="font-mono text-[10.5px] tracking-[0.14em]"
        style={{ color }}
      >
        {kicker}
      </span>
      <span className="font-display text-[32px] leading-none font-bold tracking-[-0.03em]">
        {title}
      </span>
      <span className="text-muted text-[13.5px] leading-[1.5]">
        {description}
      </span>
      {children}
    </label>
  );
};
