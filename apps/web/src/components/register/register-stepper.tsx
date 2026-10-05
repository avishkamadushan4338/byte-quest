import { registerSteps, stepOrder } from "./data";

interface RegisterStepperProps {
  current: number;
  maxStep: number;
  done: boolean;
  onSelect: (index: number) => void;
}

const stepColors = (isCurrent: boolean, isComplete: boolean) => {
  if (isComplete) {
    return {
      fg: "#D5E1DB",
      dotBg: "#52FF3D",
      dotFg: "#020807",
      dotBorder: "#52FF3D",
    };
  }
  if (isCurrent) {
    return {
      fg: "#F2F7F4",
      dotBg: "transparent",
      dotFg: "#52FF3D",
      dotBorder: "rgba(82,255,61,0.5)",
    };
  }
  return {
    fg: "#6F877C",
    dotBg: "transparent",
    dotFg: "#6F877C",
    dotBorder: "rgba(185,245,208,0.15)",
  };
};

export const RegisterStepper = ({
  current,
  maxStep,
  done,
  onSelect,
}: RegisterStepperProps) => {
  const total = stepOrder.length;
  const percent = `${((current + 1) / total) * 100}%`;

  return (
    <aside className="bg-surface max-w-full flex-[1_1_260px] rounded-[20px] border border-[rgba(185,245,208,0.09)] p-5 min-[1100px]:sticky min-[1100px]:top-[100px]">
      <div className="text-muted-2 font-mono text-[10.5px] tracking-[0.16em]">
        STEP {current + 1} OF {total}
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-[4px] bg-[rgba(185,245,208,0.08)]">
        <div
          className="h-full bg-[linear-gradient(90deg,#00A99A,#52FF3D)] transition-[width] duration-[350ms]"
          style={{ width: percent }}
        />
      </div>
      <ol className="m-0 mt-[18px] hidden list-none gap-0.5 p-0 min-[1100px]:grid">
        {stepOrder.map((key, index) => {
          const isCurrent = index === current;
          const isComplete = index < current || done;
          const locked = index > maxStep || done;
          const colors = stepColors(isCurrent, isComplete);
          return (
            <li key={key}>
              <button
                aria-current={isCurrent ? "step" : undefined}
                className="flex w-full items-center gap-3 rounded-[10px] border-none p-2.5 text-left font-sans text-[14px]"
                disabled={locked}
                onClick={() => onSelect(index)}
                style={{
                  background: isCurrent
                    ? "rgba(82,255,61,0.07)"
                    : "transparent",
                  color: colors.fg,
                  cursor: locked ? "default" : "pointer",
                }}
                type="button"
              >
                <span
                  className="flex size-[26px] shrink-0 items-center justify-center rounded-[8px] font-mono text-[11px]"
                  style={{
                    background: colors.dotBg,
                    color: colors.dotFg,
                    border: `1px solid ${colors.dotBorder}`,
                  }}
                >
                  {isComplete ? "✓" : String(index + 1).padStart(2, "0")}
                </span>
                {registerSteps[key].label}
              </button>
            </li>
          );
        })}
      </ol>
      <div className="font-display mt-2.5 text-[16px] font-semibold min-[1100px]:hidden">
        {registerSteps[stepOrder[current]].label}
      </div>
    </aside>
  );
};
