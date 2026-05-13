import { useState } from "react";
import { Clock, X, MapPin, CreditCard, RotateCw } from "lucide-react";
import { USUALS, PAST_ORDERS, type Usual } from "@/lib/swiggy-data";
import { BottomSheet } from "./BottomSheet";
import { ActionButton } from "./ActionButton";

export function ReordersTab() {
  const [nudgeOpen, setNudgeOpen] = useState(true);
  const [reorderTarget, setReorderTarget] = useState<Usual | null>(null);

  return (
    <div className="px-4 py-4 pb-6 space-y-6">
      {nudgeOpen && (
        <div className="rounded-xl bg-accent border border-primary/20 p-3 flex items-start gap-3">
          <Clock size={20} className="text-primary shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-foreground leading-snug">
              You haven't ordered from <span className="font-semibold">Paradise Biryani</span> in 32 days — craving it again?
            </p>
            <button
              onClick={() => setReorderTarget(USUALS[0])}
              className="mt-1 text-[13px] font-bold text-primary"
            >
              Order Now
            </button>
          </div>
          <button
            onClick={() => setNudgeOpen(false)}
            className="text-muted-foreground p-1 -m-1"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <section>
        <h2 className="font-bold text-[18px] text-foreground">Your Usuals</h2>
        <p className="text-[13px] text-muted-foreground">Tap to reorder instantly</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {USUALS.map((u) => (
            <UsualCard key={u.id} u={u} onReorder={() => setReorderTarget(u)} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-bold text-[18px] text-foreground">Past Orders</h2>
        <div className="mt-3 space-y-3">
          {PAST_ORDERS.map((o) => (
            <div key={o.id} className="bg-card rounded-2xl shadow-[var(--shadow-card)] p-3 flex items-center gap-3">
              <div
                className="w-[60px] h-[60px] rounded-xl shrink-0"
                style={{ background: `linear-gradient(135deg, ${o.bannerFrom}, ${o.bannerTo})` }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[14px] text-foreground truncate">{o.restaurant}</p>
                <p className="text-[12px] text-muted-foreground truncate">{o.summary}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{o.date}</p>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="font-bold text-[14px] text-foreground">₹{o.amount}</span>
                <button
                  onClick={() =>
                    setReorderTarget({
                      id: o.id,
                      name: o.summary,
                      restaurant: o.restaurant,
                      price: o.amount,
                      timesOrdered: 0,
                      lastOrdered: o.date,
                      bannerFrom: o.bannerFrom,
                      bannerTo: o.bannerTo,
                    })
                  }
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
        open={!!reorderTarget}
        onClose={() => setReorderTarget(null)}
        title="Confirm Reorder"
        showClose
        heightClass="h-auto max-h-[85vh]"
      >
        {reorderTarget && (
          <div className="px-4 py-4 space-y-4">
            <div className="bg-secondary rounded-xl p-3 flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-lg shrink-0"
                style={{ background: `linear-gradient(135deg, ${reorderTarget.bannerFrom}, ${reorderTarget.bannerTo})` }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[14px] text-foreground truncate">{reorderTarget.name}</p>
                <p className="text-[12px] text-muted-foreground truncate">{reorderTarget.restaurant}</p>
                <p className="text-primary font-bold text-[14px] mt-0.5">₹{reorderTarget.price}</p>
              </div>
            </div>

            <div className="border border-border rounded-xl p-3 flex items-start gap-3">
              <MapPin size={18} className="text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-muted-foreground">Deliver to</p>
                <p className="text-[13px] font-medium text-foreground truncate">Home — 14B, Linking Road, Bandra West</p>
              </div>
              <button className="text-[12px] font-bold text-primary shrink-0">Change</button>
            </div>

            <div className="border border-border rounded-xl p-3 flex items-start gap-3">
              <CreditCard size={18} className="text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-muted-foreground">Payment</p>
                <p className="text-[13px] font-medium text-foreground">UPI — Google Pay</p>
              </div>
              <button className="text-[12px] font-bold text-primary shrink-0">Change</button>
            </div>

            <ActionButton
              label={`Place Reorder — ₹${reorderTarget.price}`}
              onComplete={() => setReorderTarget(null)}
            />
            <p className="text-center text-[12px] text-muted-foreground">Estimated delivery: 28–35 mins</p>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

function UsualCard({ u, onReorder }: { u: Usual; onReorder: () => void }) {
  return (
    <div className="bg-card rounded-2xl shadow-[var(--shadow-card)] overflow-hidden flex flex-col">
      <div className="relative">
        <div
          className="w-full h-[100px]"
          style={{ background: `linear-gradient(135deg, ${u.bannerFrom}, ${u.bannerTo})` }}
        />
        <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
          Ordered {u.timesOrdered}x
        </span>
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <p className="font-semibold text-[14px] text-foreground line-clamp-2 leading-tight min-h-[34px]">{u.name}</p>
        <p className="text-[12px] text-muted-foreground truncate mt-1">{u.restaurant}</p>
        <p className="text-primary font-bold text-[14px] mt-1">₹{u.price}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">Last: {u.lastOrdered}</p>
        <button
          onClick={onReorder}
          className="mt-3 h-9 rounded-xl bg-primary text-primary-foreground text-[12px] font-bold flex items-center justify-center gap-1 hover:bg-primary/90"
        >
          <RotateCw size={13} /> Reorder
        </button>
      </div>
    </div>
  );
}
