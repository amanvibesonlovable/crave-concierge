import { useEffect, useMemo, useState } from "react";
import { Sparkles, Send, Star, Clock, MapPin, UtensilsCrossed, Plus, ShoppingCart } from "lucide-react";
import { RESTAURANTS, MENU_BY_CATEGORY, MENU_CATEGORIES, type Restaurant, type MenuItem } from "@/lib/swiggy-data";
import { BottomSheet } from "./BottomSheet";
import { ActionButton } from "./ActionButton";
// @ts-expect-error - JS module
import { concierge } from "@/services/api";
// @ts-expect-error - JS module
import { useApi } from "@/services/useApi";

const QUICK_PROMPTS = [
  "🌶️ Something spicy",
  "🥗 Healthy & light",
  "🍔 Comfort food",
  "⚡ Deliver in 30 mins",
  "💰 Under ₹300",
  "⭐ Top rated nearby",
];

const FILTERS = ["Veg Only 🟢", "Non-Veg", "Under ₹200", "Under ₹500", "Rating 4.0+", "Fast Delivery"];

type CartItem = { item: MenuItem; qty: number };

export function ConciergeTab() {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(RESTAURANTS);
  const [usedBackend, setUsedBackend] = useState(false);
  const [showError, setShowError] = useState(false);
  const { loading, error, execute: searchRestaurants } = useApi(concierge.search);

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [menuRestaurant, setMenuRestaurant] = useState<Restaurant | null>(null);
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0]);
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [cartRestaurant, setCartRestaurant] = useState<Restaurant | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const toggleFilter = (f: string) =>
    setActiveFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  const addToCart = (item: MenuItem, restaurant: Restaurant) => {
    if (cartRestaurant && cartRestaurant.id !== restaurant.id) {
      setCart({ [item.id]: { item, qty: 1 } });
    } else {
      setCart((prev) => ({
        ...prev,
        [item.id]: { item, qty: (prev[item.id]?.qty ?? 0) + 1 },
      }));
    }
    setCartRestaurant(restaurant);
  };

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.qty * i.item.price, 0);

  const handleSearch = async (queryOverride?: string) => {
    const searchQuery = (queryOverride ?? query).trim();
    if (!searchQuery) return;
    if (queryOverride !== undefined) setQuery(queryOverride);
    setHasSearched(true);

    const result = await searchRestaurants(searchQuery);

    if (result?.restaurants) {
      setRestaurants(result.restaurants);
      setUsedBackend(true);
    } else {
      setRestaurants(RESTAURANTS);
      setUsedBackend(false);
    }
  };

  const handleNewSearch = () => {
    setQuery("");
    setHasSearched(false);
    setRestaurants(RESTAURANTS);
    setUsedBackend(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!error) return;
    setShowError(true);
    const t = window.setTimeout(() => setShowError(false), 4000);
    return () => window.clearTimeout(t);
  }, [error]);

  const showCartBar = useMemo(() => cartCount > 0 && !cartOpen, [cartCount, cartOpen]);

  return (
    <div className="pb-4">
      {/* Hero Input */}
      <div className="px-4 pt-4">
        <div className="relative bg-card rounded-2xl shadow-[var(--shadow-card)] flex items-center pl-4 pr-2 h-14">
          <Sparkles size={20} className="text-primary shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="What are you craving right now?"
            className="flex-1 bg-transparent border-0 outline-none px-3 text-[15px] text-foreground placeholder:text-muted-foreground"
          />
          <button
            onClick={() => handleSearch()}
            disabled={!query.trim()}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-opacity ${
              query.trim() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground opacity-50"
            }`}
            aria-label="Send"
          >
            <Send size={18} />
          </button>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => handleSearch(p)}
              className="shrink-0 h-9 px-4 rounded-full bg-card border border-border text-[13px] text-foreground hover:bg-secondary"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar px-4">
        {FILTERS.map((f) => {
          const active = activeFilters.includes(f);
          return (
            <button
              key={f}
              onClick={() => toggleFilter(f)}
              className={`shrink-0 h-8 px-3 rounded-full text-[12px] font-medium border transition-colors ${
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Response area */}
      <div className="px-4 mt-6">
        {!hasSearched ? (
          <div className="flex flex-col items-center text-center py-16">
            <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center">
              <div className="relative">
                <UtensilsCrossed size={36} className="text-primary" />
                <Sparkles size={16} className="text-primary absolute -top-2 -right-3" />
              </div>
            </div>
            <p className="mt-5 text-[14px] text-muted-foreground max-w-[260px] leading-relaxed">
              Describe your craving above and I'll find the perfect meal for you
            </p>
          </div>
        ) : loading ? (
          <>
            <p className="text-center text-[14px] text-muted-foreground animate-pulse">
              🤔 Finding the perfect meal for you...
            </p>
            <div className="mt-4 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[18px] text-foreground">
                {usedBackend
                  ? "Here's what I found for you 🍽️"
                  : "Here's what we think you'll love 🍽️"}
              </h2>
              <button
                onClick={handleNewSearch}
                className="shrink-0 h-7 px-2.5 rounded-lg border border-primary text-primary text-[12px] font-semibold hover:bg-primary/5"
              >
                ✨ New Search
              </button>
            </div>
            {showError && (
              <div
                className="mt-3 rounded-xl p-3 border"
                style={{ background: "#FFF0F0", borderColor: "#FFD0D0" }}
              >
                <p className="text-[13px]" style={{ color: "#CC0000" }}>
                  ⚠️ Couldn't reach the server — showing popular restaurants instead
                </p>
              </div>
            )}
            <div className="mt-4 space-y-4">
              {restaurants.map((r) => (
                <RestaurantCard
                  key={r.id}
                  r={r}
                  onView={() => {
                    setMenuRestaurant(r);
                    setActiveCategory(MENU_CATEGORIES[0]);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating cart bar */}
      {showCartBar && cartRestaurant && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-[68px] w-full max-w-[430px] px-3 z-30">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full bg-primary text-primary-foreground rounded-t-2xl rounded-b-md px-4 h-14 flex items-center justify-between shadow-[0_-4px_16px_rgba(252,128,25,0.35)]"
          >
            <span className="flex items-center gap-2 text-[14px] font-semibold">
              <ShoppingCart size={18} /> {cartCount} {cartCount === 1 ? "item" : "items"}
            </span>
            <span className="text-[14px] font-semibold truncate max-w-[120px]">{cartRestaurant.name}</span>
            <span className="text-[14px] font-bold">View Cart →</span>
          </button>
        </div>
      )}

      {/* Menu sheet */}
      <BottomSheet
        open={!!menuRestaurant}
        onClose={() => setMenuRestaurant(null)}
        title={menuRestaurant?.name}
        showClose
      >
        {menuRestaurant && (
          <>
            <div className="sticky top-0 z-10 bg-card border-b border-border">
              <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3">
                {MENU_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={`shrink-0 h-8 px-3 rounded-full text-[12px] font-medium border transition-colors ${
                      activeCategory === c
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-4 py-2 divide-y divide-border">
              {MENU_BY_CATEGORY[activeCategory].map((item) => (
                <div key={item.id} className="py-4 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block w-3.5 h-3.5 border ${item.veg ? "border-success" : "border-destructive"} flex items-center justify-center`}
                      >
                        <span className={`block w-1.5 h-1.5 rounded-full ${item.veg ? "bg-success" : "bg-destructive"}`} />
                      </span>
                      <h4 className="font-semibold text-[14px] text-foreground">{item.name}</h4>
                    </div>
                    <p className="mt-1 text-[12px] text-muted-foreground line-clamp-1">{item.desc}</p>
                    <p className="mt-1 text-primary font-bold text-[14px]">₹{item.price}</p>
                  </div>
                  <button
                    onClick={() => addToCart(item, menuRestaurant)}
                    className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0"
                    aria-label="Add"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              ))}
            </div>
            <div className="h-4" />
          </>
        )}
      </BottomSheet>

      {/* Cart sheet */}
      <BottomSheet open={cartOpen} onClose={() => setCartOpen(false)} title={cartRestaurant?.name ?? "Your Cart"} showClose heightClass="h-[70vh]">
        <div className="px-4 py-3">
          {cartItems.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-12">Your cart is empty</p>
          ) : (
            <>
              <div className="divide-y divide-border">
                {cartItems.map(({ item, qty }) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="font-medium text-[14px] text-foreground truncate">{item.name}</p>
                      <p className="text-[12px] text-muted-foreground">₹{item.price} × {qty}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-accent rounded-lg p-1">
                      <button
                        onClick={() =>
                          setCart((prev) => {
                            const next = { ...prev };
                            const cur = next[item.id];
                            if (!cur) return next;
                            if (cur.qty <= 1) delete next[item.id];
                            else next[item.id] = { ...cur, qty: cur.qty - 1 };
                            return next;
                          })
                        }
                        className="w-7 h-7 rounded text-primary font-bold"
                      >−</button>
                      <span className="w-5 text-center text-[13px] font-semibold text-primary">{qty}</span>
                      <button
                        onClick={() => setCart((prev) => ({ ...prev, [item.id]: { item, qty: qty + 1 } }))}
                        className="w-7 h-7 rounded text-primary font-bold"
                      >+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-[14px] text-muted-foreground">Total</span>
                <span className="text-[18px] font-bold text-foreground">₹{cartTotal}</span>
              </div>
              <div className="mt-4">
                <ActionButton
                  label={`Proceed to Checkout — ₹${cartTotal}`}
                  onComplete={() => {
                    setCart({});
                    setCartRestaurant(null);
                    setCartOpen(false);
                  }}
                />
              </div>
            </>
          )}
        </div>
      </BottomSheet>
    </div>
  );
}

function RestaurantCard({ r, onView }: { r: Restaurant; onView: () => void }) {
  return (
    <div className="bg-card rounded-2xl shadow-[var(--shadow-card)] overflow-hidden">
      <div
        className="h-40 relative flex items-end p-4"
        style={{ background: `linear-gradient(135deg, ${r.bannerFrom}, ${r.bannerTo})` }}
      >
        <h3 className="text-white font-bold text-[18px] drop-shadow">{r.name}</h3>
      </div>
      <div className="p-4">
        <p className="text-[12px] text-muted-foreground">{r.cuisines}</p>
        <div className="mt-2 flex items-center gap-3 text-[13px]">
          <span className="flex items-center gap-1 font-bold text-primary">
            <Star size={14} fill="currentColor" /> {r.rating}
          </span>
          <span className="text-muted-foreground/40">|</span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock size={13} /> {r.deliveryMins} mins
          </span>
          <span className="text-muted-foreground/40">|</span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <MapPin size={13} /> {r.distanceKm} km
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[13px] text-muted-foreground">₹{r.costForTwo} for two</span>
          {r.offer && (
            <span className="text-[11px] font-bold text-success bg-success/10 px-2 py-0.5 rounded">
              OFFER · {r.offer}
            </span>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={onView}
            className="flex-1 h-10 rounded-xl border border-primary text-primary font-semibold text-[13px] hover:bg-primary/5"
          >
            View Menu
          </button>
          <button
            onClick={onView}
            className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground font-semibold text-[13px] hover:bg-primary/90"
          >
            Quick Order
          </button>
        </div>
      </div>
    </div>
  );
}
