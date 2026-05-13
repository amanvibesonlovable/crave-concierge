import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";

export function BottomSheet({
  open,
  onClose,
  heightClass = "h-[80vh]",
  children,
  showClose = false,
  title,
}: {
  open: boolean;
  onClose: () => void;
  heightClass?: string;
  children: ReactNode;
  showClose?: boolean;
  title?: string;
}) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    } else if (mounted) {
      setVisible(false);
      timer.current = window.setTimeout(() => setMounted(false), 220);
    }
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [open, mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`relative w-full max-w-[430px] bg-card ${heightClass} rounded-t-3xl flex flex-col transition-transform duration-200 ease-out ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ boxShadow: "0 -8px 32px rgba(0,0,0,0.18)" }}
      >
        <div className="pt-2 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>
        {(title || showClose) && (
          <div className="px-4 pt-1 pb-3 flex items-center justify-between shrink-0 border-b border-border">
            <h3 className="font-bold text-base text-foreground truncate">{title}</h3>
            {showClose && (
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-secondary text-foreground hover:bg-muted"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </div>
  );
}
