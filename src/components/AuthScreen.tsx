import { useState } from "react";

export function AuthScreen({ onConnect }: { onConnect: () => void }) {
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleConnect = () => {
    if (loading) return;
    setLoading(true);
    window.setTimeout(() => onConnect(), 1500);
  };

  return (
    <div className="min-h-screen w-full bg-background flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col items-center justify-center px-6 py-10">
        {/* Top */}
        <div className="flex flex-col items-center">
          <h1 className="font-extrabold text-[28px] text-primary tracking-tight">SwiggyAI</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Your AI-powered food companion</p>
          <div
            className="mt-6 w-[120px] h-[120px] rounded-full flex items-center justify-center"
            style={{ background: "#FFF0E6" }}
          >
            <span className="text-[48px] leading-none">🍕</span>
          </div>
        </div>

        {/* Middle */}
        <div className="mt-8 flex flex-col items-center w-full">
          <h2 className="font-bold text-[20px] text-foreground text-center">
            Connect your Swiggy account
          </h2>
          <p className="text-[14px] text-muted-foreground text-center mt-2 max-w-[280px]">
            Sign in with Swiggy to order food, reorder your favourites, and let AI find your next
            meal
          </p>

          <ul className="mt-8 max-w-[280px] w-full flex flex-col gap-3">
            {[
              { icon: "🍕", text: "AI finds meals based on your mood" },
              { icon: "🔁", text: "Reorder favourites in one tap" },
              { icon: "⚡", text: "Faster than opening the Swiggy app" },
            ].map((f) => (
              <li key={f.text} className="flex items-center gap-3">
                <span className="text-[24px] leading-none w-7 text-center">{f.icon}</span>
                <span className="text-[14px] text-foreground">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom */}
        <div className="mt-10 w-full flex flex-col items-center">
          <button
            onClick={handleConnect}
            disabled={loading}
            className="w-full max-w-[320px] rounded-2xl bg-primary text-primary-foreground font-bold text-[16px] flex items-center justify-center transition-opacity disabled:opacity-90"
            style={{ paddingTop: 18, paddingBottom: 18 }}
          >
            {loading ? (
              <span
                className="inline-block w-5 h-5 rounded-full animate-spin"
                style={{
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTopColor: "#fff",
                }}
              />
            ) : (
              "Connect Swiggy Account"
            )}
          </button>
          <p className="text-[12px] text-muted-foreground mt-3 text-center">
            We never store your Swiggy password
          </p>
          <button
            onClick={() => setShowInfo((s) => !s)}
            className="mt-4 text-[12px] text-primary underline"
          >
            How does this work?
          </button>
          {showInfo && (
            <div
              className="mt-3 max-w-[320px] w-full rounded-xl p-4 animate-fade-in"
              style={{ background: "#FFF0E6" }}
            >
              <p className="text-[13px] text-muted-foreground" style={{ lineHeight: 1.6 }}>
                SwiggyAI uses Swiggy's official OAuth login. You'll be redirected to Swiggy's secure
                login page, then brought back here. We only access your orders, addresses, and menu
                data — nothing else.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
