import { useEffect, useState } from "react";
import { Check, Loader2, RefreshCw, X } from "lucide-react";
import { BottomSheet } from "./BottomSheet";
import { ActionButton } from "./ActionButton";
// @ts-expect-error - JS module
import { orders, addresses } from "@/services/api";

type Usual = {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  timesOrdered: number;
  lastOrdered: string;
};

type PastOrder = {
  id: string;
  restaurant: string;
  summary: string;
  date: string;
  amount: number;
};

const MOCK_USUALS: Usual[] = [
  { id: "u1", name: "Chicken Biryani (Full)", restaurant: "Paradise Biryani", price: 320, timesOrdered: 14, lastOrdered: "2 days ago" },
  { id: "u2", name: "Paneer Butter Masala + Naan", restaurant: "Dhaba Express", price: 380, timesOrdered: 9, lastOrdered: "5 days ago" },
  { id: "u3", name: "Veg Hakka Noodles", restaurant: "Wok to Walk", price: 220, timesOrdered: 7, lastOrdered: "8 days ago" },
  { id: "u4", name: "Chicken Shawarma Wrap", restaurant: "Shawarma Station", price: 180, timesOrdered: 11, lastOrdered: "1 day ago" },
  { id: "u5", name: "Butter Chicken + Rice", restaurant: "Maa ki Daal", price: 420, timesOrdered: 6, lastOrdered: "12 days ago" },
  { id: "u6", name: "Classic Veg Burger", restaurant: "Burger Singh", price: 149, timesOrdered: 8, lastOrdered: "4 days ago" },
];

const MOCK_ORDERS: PastOrder[] = [
  { id: "p1", restaurant: "Paradise Biryani", summary: "Chicken Biryani (Full) + 1 more", date: "May 9, 2026", amount: 640 },
  { id: "p2", restaurant: "Shawarma Station", summary: "Chicken Shawarma Wrap", date: "May 7, 2026", amount: 180 },
  { id: "p3", restaurant: "Burger Singh", summary: "Classic Veg Burger + Fries Combo", date: "May 5, 2026", amount: 299 },
  { id: "p4", restaurant: "Dhaba Express", summary: "Paneer Butter Masala + Butter Naan", date: "May 3, 2026", amount: 380 },
  { id: "p5", restaurant: "Wok to Walk", summary: "Veg Hakka Noodles + Spring Rolls", date: "Apr 30, 2026", amount: 220 },
  { id: "p6", restaurant: "Maa ki Daal", summary: "Butter Chicken + Steamed Rice + Dal", date: "Apr 28, 2026", amount: 670 },
];

const MOCK_ADDRESS = "Home — 14B, Linking Road, Bandra West";

type ReorderTarget = { name: string; restaurant: string; price: number };

const padTo6 = <T extends { id: string }>(live: T[], mock: T[]): T[] => {
  if (live.length >= 6) return live.slice(0, 6);
  const have = new Set(live.map((x) => x.id));
  const fillers = mock.filter((m) => !have.has(m.id)).slice(0, 6 - live.length);
  return [...live, ...fillers];
};

export function ReordersTab() {
  const [nudgeOpen, setNudgeOpen] = useState(true);
  const [target, setTarget] = useState<ReorderTarget | null>(null);

  const [usuals, setUsuals] = useState<Usual[]>(MOCK_USUALS);
  const [pastOrders, setPastOrders] = useState<PastOrder[]>(MOCK_ORDERS);
  const [deliveryAddress, setDeliveryAddress] = useState<string>(MOCK_ADDRESS);
  const [dataSource, setDataSource] = useState<"mock" | "live">("mock");
  const [pageLoading, setPageLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [reorderLoading, setReorderLoading] = useState(false);
  const [reorderSuccess, setReorderSuccess] = useState(false);

  const loadTabData = async () => {
    setPageLoading(true);
    try {
      const result: any = await orders.getAll();

      let liveUsuals: Usual[] = [];
      let livePast: PastOrder[] = [];
      let isLive = false;

      if (result?.usuals?.length > 0) {
        liveUsuals = result.usuals;
        isLive = true;
      }
      if (result?.orders?.length > 0) {
        livePast = result.orders;
      }

      if (isLive) {
        setUsuals(padTo6(liveUsuals, MOCK_USUALS));
        setPastOrders(padTo6(livePast, MOCK_ORDERS));
        setDataSource("live");
      } else {
        setDataSource("mock");
      }

      try {
        const addrResult: any = await addresses.getAll();
        if (addrResult?.addresses?.length > 0) {
          const a = addrResult.addresses[0];
          setDeliveryAddress(`${a.label} — ${a.address}`);
        }
      } catch {
        /* keep mock address */
      }
    } catch {
      setDataSource("mock");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadTabData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTabData();
    setRefreshing(false);
  };

  // Derive nudge item: live = days since lastOrdered ≥ 30; mock = hardcoded
  const liveNudge =
    dataSource === "live"
      ? usuals.find((item) => {
          if (!item.lastOrdered) return false;
          const d = new Date(item.lastOrdered);
          if (isNaN(d.getTime())) return false;
          const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
          return days >= 30;
        })
      : null;
  const liveNudgeDays = liveNudge
    ? Math.floor((Date.now() - new Date(liveNudge.lastOrdered).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const showNudge =
    nudgeOpen && (dataSource === "mock" || (dataSource === "live" && !!liveNudge));

  const handlePlaceReorder = async () => {
    if (!target) return;
    setReorderLoading(true);
    try {
      const result: any = await orders.place({
        item_name: target.name,
        restaurant: target.restaurant,
        price: target.price,
      });
      if (result?.success) {
        setReorderSuccess(true);
        setTimeout(() => {
          setReorderSuccess(false);
          setTarget(null);
        }, 1000);
      }
    } catch {
      setTimeout(() => {
        setReorderSuccess(true);
        setTimeout(() => {
          setReorderSuccess(false);
          setTarget(null);
        }, 1000);
      }, 1500);
    } finally {
      setReorderLoading(false);
    }
  };

  if (pageLoading) {
    return <ReordersSkeleton />;
  }

  return (
    <div className="px-4 py-4 pb-6 space-y-6">
      {showNudge && (
        <div
          className="rounded-xl p-4 flex items-start gap-3 animate-fade-in"
          style={{ backgroundColor: "#FFF0E6" }}
        >
          <span className="text-lg leading-none mt-0.5" aria-hidden>🕐</span>
          <p className="flex-1 min-w-0 text-[13px] text-[#1C1C1C] leading-snug line-clamp-2">
            You haven't ordered from{" "}
            <span className="font-semibold">
              {liveNudge ? liveNudge.restaurant : "Paradise Biryani"}
            </span>{" "}
            in {liveNudge ? liveNudgeDays : 32} days — craving it again?
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() =>
                setTarget(
                  liveNudge
                    ? { name: liveNudge.name, restaurant: liveNudge.restaurant, price: liveNudge.price }
                    : { name: "Chicken Biryani (Full)", restaurant: "Paradise Biryani", price: 320 },
                )
              }
              className="text-[13px] font-bold text-primary"
            >
              Order Now
            </button>
            <button
              onClick={() => setNudgeOpen(false)}
              className="text-muted-foreground p-1 -m-1"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <section>
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-[18px] text-foreground">Your Usuals</h2>
            {dataSource === "live" && (
              <span
                className="inline-flex items-center gap-1 bg-card rounded-full"
                style={{
                  border: "1px solid #2ECC71",
                  padding: "4px 10px",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#2ECC71" }} />
                <span className="text-[10px] font-semibold" style={{ color: "#2ECC71" }}>
                  Live
                </span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-[13px] text-muted-foreground">Tap to reorder instantly</p>
            {dataSource === "live" && (
              <button
                onClick={handleRefresh}
                className="text-muted-foreground p-1 -m-1"
                aria-label="Refresh"
              >
                <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {usuals.map((u) => (
            <UsualCard
              key={u.id}
              u={u}
              onReorder={() => setTarget({ name: u.name, restaurant: u.restaurant, price: u.price })}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-bold text-[18px] text-foreground mt-4">Past Orders</h2>
        <div className="mt-3 space-y-2.5">
          {pastOrders.map((o) => (
            <div
              key={o.id}
              className="bg-card rounded-xl p-3 flex items-center gap-3"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            >
              <ImageThumb size={56} radius={8} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[14px] text-foreground truncate">{o.restaurant}</p>
                <p className="text-[12px] text-muted-foreground truncate">{o.summary}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{o.date}</p>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="font-bold text-[14px] text-foreground">₹{o.amount}</span>
                <button
                  onClick={() => setTarget({ name: o.summary, restaurant: o.restaurant, price: o.amount })}
                  className="text-[12px] font-bold text-primary mt-1"
                >
                  Reorder
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BottomSheet
        open={!!target}
        onClose={() => setTarget(null)}
        title="Confirm Reorder"
        showClose
        heightClass="h-[50vh]"
      >
        {target && (
          <div className="px-4 py-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg" aria-hidden>🍽️</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[14px] text-foreground truncate">{target.name}</p>
                <p className="text-[12px] text-muted-foreground truncate">{target.restaurant}</p>
              </div>
              <span className="font-bold text-[16px] text-primary">₹{target.price}</span>
            </div>

            <div className="border-t border-border" />

            <div className="flex items-center gap-3">
              <span className="text-base" aria-hidden>📍</span>
              <p className="flex-1 min-w-0 text-[13px] font-bold text-foreground truncate">
                {deliveryAddress}
              </p>
              <button className="text-[12px] font-bold text-primary shrink-0">Change</button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-base" aria-hidden>💳</span>
              <p className="flex-1 min-w-0 text-[13px] font-bold text-foreground truncate">UPI — Google Pay</p>
              <button className="text-[12px] font-bold text-primary shrink-0">Change</button>
            </div>

            <div className="border-t border-border" />

            {dataSource === "live" ? (
              <button
                onClick={handlePlaceReorder}
                disabled={reorderLoading || reorderSuccess}
                className={`w-full h-12 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-colors ${
                  reorderSuccess
                    ? "bg-success text-success-foreground"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {reorderLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : reorderSuccess ? (
                  <>
                    <Check size={20} /> Order Placed!
                  </>
                ) : (
                  `Place Reorder — ₹${target.price}`
                )}
              </button>
            ) : (
              <ActionButton
                label={`Place Reorder — ₹${target.price}`}
                onComplete={() => setTarget(null)}
              />
            )}
            <p className="text-center text-[11px] text-muted-foreground">Estimated delivery: 28–35 mins</p>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

function ImageThumb({ size, radius }: { size: number; radius: number }) {
  return (
    <div
      className="shrink-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300"
      style={{ width: size, height: size, borderRadius: radius, fontSize: size * 0.45 }}
      aria-hidden
    >
      🍽️
    </div>
  );
}

function UsualCard({ u, onReorder }: { u: Usual; onReorder: () => void }) {
  return (
    <div
      className="bg-card rounded-2xl overflow-hidden flex flex-col"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
    >
      <div className="relative aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-4xl" aria-hidden>
        🍽️
        <span
          className="absolute top-2 left-2 rounded-full font-bold text-white"
          style={{ backgroundColor: "#FC8019", fontSize: 10, padding: "6px 10px", lineHeight: 1 }}
        >
          Ordered {u.timesOrdered}x
        </span>
      </div>
      <div className="p-2.5 flex-1 flex flex-col">
        <p className="font-bold text-[13px] text-foreground line-clamp-2 leading-tight min-h-[32px]">{u.name}</p>
        <p className="text-[11px] text-muted-foreground truncate mt-0.5">{u.restaurant}</p>
        <p className="text-primary font-bold text-[14px] mt-1">₹{u.price}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">Last: {u.lastOrdered}</p>
      </div>
      <button
        onClick={onReorder}
        className="bg-primary text-primary-foreground text-[13px] font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-primary/90"
        style={{ padding: "10px 0", borderRadius: 8, margin: 0 }}
      >
        🔁 Reorder
      </button>
    </div>
  );
}

function ReordersSkeleton() {
  return (
    <div className="px-4 py-4 pb-6 space-y-6">
      <div className="h-14 w-full rounded-xl bg-gray-200 animate-pulse" />

      <section>
        <div className="h-5 w-[120px] rounded-lg bg-gray-200 animate-pulse" />
        <div className="mt-3 grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl overflow-hidden flex flex-col"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
            >
              <div className="aspect-square w-full bg-gray-200 animate-pulse" />
              <div className="p-2.5 space-y-2">
                <div className="h-3 w-5/6 rounded bg-gray-200 animate-pulse" />
                <div className="h-3 w-3/5 rounded bg-gray-200 animate-pulse" />
                <div className="h-3 w-2/5 rounded bg-gray-200 animate-pulse" />
              </div>
              <div className="h-9 w-full bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="h-5 w-[100px] rounded-lg bg-gray-200 animate-pulse mt-4" />
        <div className="mt-3 space-y-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-xl p-3 flex items-center gap-3"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            >
              <div className="w-14 h-14 rounded-lg bg-gray-200 animate-pulse shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-3 w-3/4 rounded bg-gray-200 animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-gray-200 animate-pulse" />
              </div>
              <div className="h-3 w-12 rounded bg-gray-200 animate-pulse shrink-0" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
