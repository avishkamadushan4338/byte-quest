import { Button } from "@byte-quest/ui/primitives/button";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";

export interface CredentialsProps {
  username: string;
  password: string;
  /** Hides the username row when only a password is being handed over. */
  showUsername?: boolean;
  passwordLabel?: string;
  className?: string;
}

type CopyTarget = "username" | "password" | "all";

/**
 * One-time login details handed to an admin so they can pass them on.
 *
 * Passwords are generated server-side and returned exactly once, so the admin
 * has to be able to copy them out reliably - typing them by hand from a
 * low-contrast paragraph is how they end up wrong. Copying never signs anyone
 * in: it only writes to the clipboard.
 */
export const Credentials = ({
  username,
  password,
  showUsername = true,
  passwordLabel = "Password",
  className,
}: CredentialsProps) => {
  const [copied, setCopied] = useState<CopyTarget | null>(null);

  const copy = async (target: CopyTarget, value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(target);
      toast.success(`${label} copied to clipboard`);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error(`Could not copy the ${label.toLowerCase()}`);
    }
  };

  const rows = [
    ...(showUsername
      ? [
          {
            key: "username" as const,
            label: "Username (Handle)",
            value: username,
          },
        ]
      : []),
    { key: "password" as const, label: passwordLabel, value: password },
  ];

  return (
    <div
      className={`bg-ink/70 rounded-[14px] border border-[rgba(185,245,208,0.14)] p-4 ${className ?? ""}`}
    >
      {rows.map((row, index) => (
        <div
          className={
            index === 0
              ? ""
              : "mt-3 border-t border-[rgba(185,245,208,0.1)] pt-3"
          }
          key={row.key}
        >
          <span className="text-muted-2 block font-mono text-[11px] tracking-[0.14em] uppercase">
            {row.label}
          </span>
          <div className="mt-1.5 flex items-center justify-between gap-3">
            <code className="text-volt min-w-0 font-mono text-[16px] font-bold tracking-wider break-all select-all">
              {row.key === "username" ? `@${row.value}` : row.value}
            </code>
            <Button
              aria-label={`Copy ${row.label.toLowerCase()} to clipboard`}
              className="shrink-0"
              onClick={() => copy(row.key, row.value, row.label)}
              size="sm"
              variant={copied === row.key ? "primary" : "outline"}
            >
              {copied === row.key ? (
                <>
                  <CheckIcon aria-hidden="true" className="mr-1.5 size-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <CopyIcon aria-hidden="true" className="mr-1.5 size-3.5" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      ))}

      <Button
        className="mt-4 w-full"
        onClick={() =>
          copy(
            "all",
            showUsername ? `${username} / ${password}` : password,
            "Credentials"
          )
        }
        size="sm"
        variant="outline"
      >
        {copied === "all" ? (
          <>
            <CheckIcon aria-hidden="true" className="mr-1.5 size-3.5" />
            Copied
          </>
        ) : (
          <>
            <CopyIcon aria-hidden="true" className="mr-1.5 size-3.5" />
            {showUsername ? "Copy username and password" : "Copy password"}
          </>
        )}
      </Button>
    </div>
  );
};
