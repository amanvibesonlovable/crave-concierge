import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

export function ActionButton({
  label,
  onComplete,
  className = "",
}: {
  label: string;
  onComplete?: () => void;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => {
    if (state !== "loading") return;
    const t = window.setTimeout(() => {
      setState("done");
      const t2 = window.setTimeout(() => {
        onComplete?.();
        setState("idle");
      }, 1200);
      return () => window.clearTimeout(t2);
    }, 1500);
    return () => window.clearTimeout(t);
  }, [state, onComplete]);

  return (
    <button
      disabled={state !== "idle"}
      onClick={() => setState("loading")}
      className={`w-full h-12 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-colors ${
        state === "done"
          ? "bg-success text-success-foreground"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      } ${className}`}
    >
      {state === "idle" && label}
      {state === "loading" && <Loader2 className="animate-spin" size={20} />}
      {state === "done" && (
        <>
          <Check size={20} /> Order Placed!
        </>
      )}
    </button>
  );
}
