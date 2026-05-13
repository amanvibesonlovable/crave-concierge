import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";
type ToastPayload = { message: string; type?: ToastType };

const COLORS: Record<ToastType, { bg: string; border: string; text: string; icon: string }> = {
  success: { bg: "#F0FFF4", border: "#2ECC71", text: "#1A7A3C", icon: "✅" },
  error: { bg: "#FFF0F0", border: "#E74C3C", text: "#CC0000", icon: "❌" },
  info: { bg: "#FFF8F0", border: "#FC8019", text: "#FC8019", icon: "ℹ️" },
};

export function showToast(message: string, type: ToastType = "success") {
  window.dispatchEvent(new CustomEvent<ToastPayload>("swiggy_toast", { detail: { message, type } }));
}

export function ToastHost() {
  const [toast, setToast] = useState<ToastPayload | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ToastPayload>).detail;
      setToast(detail);
    };
    window.addEventListener("swiggy_toast", handler);
    return () => window.removeEventListener("swiggy_toast", handler);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(t);
  }, [toast]);

  if (!toast) return null;
  const c = COLORS[toast.type ?? "success"];

  return (
    <div
      className="fixed left-1/2 z-[100000] w-[90%] max-w-[400px] flex items-center gap-2 rounded-xl px-4 py-3 shadow-lg"
      style={{
        bottom: 96,
        background: c.bg,
        border: `1px solid ${c.border}`,
        animation: "slideUp 200ms ease-out",
        transform: "translateX(-50%)",
      }}
    >
      <span className="text-[16px] leading-none">{c.icon}</span>
      <p className="flex-1 text-[13px] font-medium" style={{ color: c.text }}>
        {toast.message}
      </p>
      <button
        onClick={() => setToast(null)}
        className="text-[12px] shrink-0"
        style={{ color: c.text }}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
