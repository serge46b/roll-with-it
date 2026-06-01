import type { ReactNode } from "react";

import { Frame } from "@/components/StyledModal";
import twclsx from "@/shared/utils/twClassMerge";

export const panelLabelClass = "text-xs uppercase tracking-wider text-white/70";
export const panelInputClass =
  "h-11 w-full min-w-0 border border-white/40 bg-black/30 px-3 text-sm text-white placeholder:text-white/45 outline-none transition-colors focus:border-white/80";
export const panelSubmitClass =
  "mx-auto h-11 w-full shrink-0 border border-white/70 bg-white/10 text-sm tracking-widest text-white transition-colors hover:bg-white/20";

export const authInputClass = panelInputClass;
export const authButtonClass =
  `${panelSubmitClass} disabled:cursor-not-allowed disabled:opacity-50`;
export const authLabelClass = panelLabelClass;

export function AuthMessage({
  tone = "neutral",
  children,
  role,
}: {
  tone?: "error" | "neutral";
  children: ReactNode;
  role?: "alert" | "status";
}) {
  return (
    <p
      role={role}
      className={twclsx(
        "rounded-md border px-3 py-2 text-sm",
        tone === "error"
          ? "border-red-400/60 bg-red-950/30 text-red-200"
          : "border-white/25 bg-white/5 text-white/80",
      )}
    >
      {children}
    </p>
  );
}

export function AuthPanel({
  title,
  children,
  footer,
  frame = "default",
  bodyClassName,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  frame?: "default" | "compact" | "tall-compact";
  bodyClassName?: string;
}) {

  return (
    <Frame>
      <div className={twclsx("flex h-full flex-col text-white p-5 px-10", frame === "default" ? "w-[560px]" : "w-[500px]")}>
        <h1 className="shrink-0 pt-2 text-center text-3xl font-light tracking-wide">{title}</h1>
        <div className={twclsx("mt-6 flex min-h-0 flex-1 flex-col gap-4", bodyClassName)}>{children}</div>
        {footer ? <div className="mt-5 shrink-0">{footer}</div> : null}
      </div>
    </Frame>
  );
}
