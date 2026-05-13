import { useEffect, useRef, useState } from "react";
import { Pizza, RotateCcw, MapPin, Sparkles } from "lucide-react";
import { ConciergeTab } from "./ConciergeTab";
import { ReordersTab } from "./ReordersTab";
import { AuthScreen } from "./AuthScreen";
import { ToastHost } from "./Toast";

type Tab = "concierge" | "reorders";

export function SwiggyAIApp() {
  const [tab, setTab] = useState<Tab>("concierge");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    const onExpiry = () => {
      setIsAuthenticated(false);
      setSessionExpired(true);
    };
    window.addEventListener("swiggy_session_expired", onExpiry);
    return () => window.removeEventListener("swiggy_session_expired", onExpiry);
  }, []);

  const handleTabChange = (next: Tab) => {
    setTab(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
    mainRef.current?.scrollTo?.({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Offline banner */}
      {!isOnline && (
        <div
          className="fixed top-0 left-0 right-0 z-[99999] flex items-center justify-center text-white text-[13px]"
          style={{ background: "#1C1C1C", height: 36 }}
        >
          📵 You're offline — showing cached data
        </div>
      )}

      {/* Auth overlay */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-[400ms] ${
          isAuthenticated ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{ marginTop: !isOnline ? 36 : 0 }}
      >
        <AuthScreen
          onConnect={() => {
            setIsAuthenticated(true);
            setSessionExpired(false);
          }}
          sessionExpired={sessionExpired}
          onClearSessionExpired={() => setSessionExpired(false)}
        />
      </div>

      {/* Main app */}
      <div
        className={`flex justify-center transition-opacity duration-[400ms] ${
          isAuthenticated ? "opacity-100" : "opacity-0"
        }`}
        style={{ paddingTop: !isOnline ? 36 : 0 }}
      >
        <div className="w-full max-w-[430px] min-h-screen relative bg-background flex flex-col">
          <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
            <div className="h-14 px-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles size={20} className="text-primary" />
                <span className="font-extrabold text-[18px] text-primary tracking-tight">
                  SwiggyAI
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-[13px] text-foreground">
                  <MapPin size={14} className="text-primary" />
                  <span className="font-semibold">Bandra, Mumbai</span>
                </div>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="text-[11px] text-muted-foreground hover:text-foreground transition-transform duration-150 active:scale-95"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </header>

          <main ref={mainRef} className="flex-1 pb-20">
            {tab === "concierge" ? <ConciergeTab /> : <ReordersTab />}
          </main>

          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border z-40">
            <div className="grid grid-cols-2 h-16">
              <TabButton
                active={tab === "concierge"}
                onClick={() => handleTabChange("concierge")}
                icon={<Pizza size={22} />}
                label="Concierge"
              />
              <TabButton
                active={tab === "reorders"}
                onClick={() => handleTabChange("reorders")}
                icon={<RotateCcw size={22} />}
                label="Reorders"
              />
            </div>
          </nav>
        </div>
      </div>

      <ToastHost />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center justify-center gap-1 transition-transform duration-150 active:scale-95"
    >
      <span className={active ? "text-primary" : "text-muted-foreground"}>{icon}</span>
      <span
        className={`text-[11px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}
      >
        {label}
      </span>
      {active && <span className="absolute bottom-0 h-0.5 w-10 bg-primary rounded-full" />}
    </button>
  );
}
