import { useEffect } from "react";

export function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const t = window.setTimeout(onDismiss, 4000);
    return () => window.clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className="rounded-xl p-3 flex items-start gap-2 animate-fade-in"
      style={{ background: "#FFF0F0", border: "1px solid #FFD0D0" }}
    >
      <p className="flex-1 text-[13px]" style={{ color: "#CC0000" }}>
        ⚠️ {message}
      </p>
      <button
        onClick={onDismiss}
        className="text-[12px] shrink-0"
        style={{ color: "#CC0000" }}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
