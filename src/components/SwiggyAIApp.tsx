import { useState } from "react";
import { Pizza, RotateCcw, MapPin, Sparkles } from "lucide-react";
import { ConciergeTab } from "./ConciergeTab";
import { ReordersTab } from "./ReordersTab";
import { AuthScreen } from "./AuthScreen";

type Tab = "concierge" | "reorders";

export function SwiggyAIApp() {
  const [tab, setTab] = useState<Tab>("concierge");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Auth overlay */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-[400ms] ${
          isAuthenticated ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <AuthScreen onConnect={() => setIsAuthenticated(true)} />
      </div>

      {/* Main app */}
      <div
        className={`flex justify-center transition-opacity duration-[400ms] ${
          isAuthenticated ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-full max-w-[430px] min-h-screen relative bg-background flex flex-col">
          {/* Header */}
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
                  className="text-[11px] text-muted-foreground hover:text-foreground"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 pb-20">
            {tab === "concierge" ? <ConciergeTab /> : <ReordersTab />}
          </main>

          {/* Bottom tab bar */}
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border z-40">
            <div className="grid grid-cols-2 h-16">
              <TabButton
                active={tab === "concierge"}
                onClick={() => setTab("concierge")}
                icon={<Pizza size={22} />}
                label="Concierge"
              />
              <TabButton
                active={tab === "reorders"}
                onClick={() => setTab("reorders")}
                icon={<RotateCcw size={22} />}
                label="Reorders"
              />
            </div>
          </nav>
        </div>
      </div>
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
      className="relative flex flex-col items-center justify-center gap-1 transition-colors"
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
