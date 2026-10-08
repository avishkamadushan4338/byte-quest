import {
  ArrowRightIcon,
  CaretDownIcon,
  CaretRightIcon,
  CaretUpIcon,
  CheckIcon,
  InfoIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  PlusIcon,
  WarningCircleIcon,
  XIcon,
} from "@phosphor-icons/react";
import type { ComponentProps } from "react";

import { cn } from "@byte-quest/ui/lib/utils";

type IconProps = Omit<ComponentProps<typeof CheckIcon>, "weight">;

const createIcon = (
  Icon: typeof CheckIcon,
  weight: ComponentProps<typeof CheckIcon>["weight"] = "bold"
) => {
  const Wrapped = ({ className, ...props }: IconProps) => (
    <Icon
      aria-hidden="true"
      className={cn("size-4 shrink-0", className)}
      weight={weight}
      {...props}
    />
  );
  return Wrapped;
};

const ChevronDown = createIcon(CaretDownIcon);
const ChevronUp = createIcon(CaretUpIcon);
const ChevronRight = createIcon(CaretRightIcon);
const Check = createIcon(CheckIcon);
const Close = createIcon(XIcon);
const Search = createIcon(MagnifyingGlassIcon);
const Plus = createIcon(PlusIcon);
const Minus = createIcon(MinusIcon);
const ArrowRight = createIcon(ArrowRightIcon);
const Alert = createIcon(WarningCircleIcon, "duotone");
const Info = createIcon(InfoIcon, "duotone");

export {
  Alert,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Close,
  Info,
  Minus,
  Plus,
  Search,
};
