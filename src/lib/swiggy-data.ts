export type Restaurant = {
  id: string;
  name: string;
  cuisines: string;
  rating: number;
  deliveryMins: number;
  distanceKm: number;
  costForTwo: number;
  offer?: string;
  bannerFrom: string;
  bannerTo: string;
};

export const RESTAURANTS: Restaurant[] = [
  { id: "behrouz", name: "Behrouz Biryani", cuisines: "Biryani • Mughlai", rating: 4.4, deliveryMins: 38, distanceKm: 2.1, costForTwo: 600, offer: "Free delivery", bannerFrom: "#3a1f12", bannerTo: "#7a3a18" },
  { id: "box8", name: "Box8", cuisines: "North Indian • Bowls", rating: 4.2, deliveryMins: 28, distanceKm: 1.2, costForTwo: 350, offer: "20% off up to ₹100", bannerFrom: "#1f2a3a", bannerTo: "#3a5478" },
  { id: "faasos", name: "Faasos", cuisines: "Wraps • Rolls • Biryani", rating: 4.1, deliveryMins: 25, distanceKm: 0.9, costForTwo: 300, bannerFrom: "#3a2f12", bannerTo: "#7a6018" },
  { id: "mainland", name: "Mainland China", cuisines: "Chinese • Asian", rating: 4.5, deliveryMins: 45, distanceKm: 3.4, costForTwo: 800, offer: "Flat ₹125 off", bannerFrom: "#2a1a2f", bannerTo: "#5e3a78" },
];

export type MenuItem = { id: string; name: string; desc: string; price: number; veg: boolean };
export const MENU_CATEGORIES = ["Recommended", "Starters", "Mains", "Desserts", "Drinks"];

export const MENU_BY_CATEGORY: Record<string, MenuItem[]> = {
  Recommended: [
    { id: "r1", name: "Hyderabadi Chicken Biryani", desc: "Long-grain basmati, slow dum-cooked with aromatic spices", price: 349, veg: false },
    { id: "r2", name: "Paneer Tikka Masala", desc: "Charred paneer cubes in a rich tomato-cashew gravy", price: 289, veg: true },
    { id: "r3", name: "Butter Naan (2 pcs)", desc: "Freshly baked naan brushed with butter", price: 89, veg: true },
    { id: "r4", name: "Chicken 65", desc: "Crispy fried chicken tossed in curry leaves and chillies", price: 249, veg: false },
    { id: "r5", name: "Gulab Jamun (2 pcs)", desc: "Soft milk dumplings soaked in cardamom syrup", price: 79, veg: true },
  ],
  Starters: [
    { id: "s1", name: "Veg Spring Rolls", desc: "Crispy rolls with mixed vegetable filling", price: 169, veg: true },
    { id: "s2", name: "Chilli Chicken Dry", desc: "Indo-Chinese style spicy chicken bites", price: 259, veg: false },
    { id: "s3", name: "Paneer 65", desc: "Fried paneer with curry leaves and chilli", price: 219, veg: true },
    { id: "s4", name: "Hara Bhara Kebab", desc: "Spinach and pea patties with mint chutney", price: 189, veg: true },
    { id: "s5", name: "Tandoori Wings", desc: "Smoky chicken wings marinated in yogurt and spices", price: 279, veg: false },
  ],
  Mains: [
    { id: "m1", name: "Dal Makhani", desc: "Creamy black lentils slow-cooked overnight", price: 229, veg: true },
    { id: "m2", name: "Chicken Tikka Masala", desc: "Boneless chicken in spiced tomato gravy", price: 309, veg: false },
    { id: "m3", name: "Veg Hakka Noodles", desc: "Wok-tossed noodles with crunchy vegetables", price: 189, veg: true },
    { id: "m4", name: "Mutton Rogan Josh", desc: "Tender mutton in a Kashmiri-style red gravy", price: 389, veg: false },
    { id: "m5", name: "Veg Biryani", desc: "Aromatic basmati layered with mixed vegetables", price: 249, veg: true },
  ],
  Desserts: [
    { id: "d1", name: "Phirni", desc: "Slow-cooked rice pudding with cardamom and pistachio", price: 119, veg: true },
    { id: "d2", name: "Choco Lava Cake", desc: "Warm cake with a molten chocolate centre", price: 149, veg: true },
    { id: "d3", name: "Rasmalai (2 pcs)", desc: "Soft cottage cheese discs in saffron milk", price: 129, veg: true },
    { id: "d4", name: "Kulfi Falooda", desc: "Classic kulfi with vermicelli and rose syrup", price: 139, veg: true },
    { id: "d5", name: "Tiramisu Cup", desc: "Coffee-soaked layers with mascarpone cream", price: 179, veg: true },
  ],
  Drinks: [
    { id: "dr1", name: "Sweet Lassi", desc: "Chilled yogurt drink whisked with sugar", price: 99, veg: true },
    { id: "dr2", name: "Masala Chaas", desc: "Spiced buttermilk with mint and cumin", price: 79, veg: true },
    { id: "dr3", name: "Cold Coffee", desc: "Blended coffee with ice cream", price: 149, veg: true },
    { id: "dr4", name: "Fresh Lime Soda", desc: "Sparkling lime with a hint of mint", price: 89, veg: true },
    { id: "dr5", name: "Mango Smoothie", desc: "Thick mango smoothie with yogurt", price: 159, veg: true },
  ],
};

export type Usual = {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  timesOrdered: number;
  lastOrdered: string;
  bannerFrom: string;
  bannerTo: string;
};

export const USUALS: Usual[] = [
  { id: "u1", name: "Chicken Biryani (Full)", restaurant: "Paradise Biryani", price: 320, timesOrdered: 14, lastOrdered: "2 days ago", bannerFrom: "#3a1f12", bannerTo: "#7a3a18" },
  { id: "u2", name: "Paneer Butter Masala + Naan", restaurant: "Dhaba Express", price: 380, timesOrdered: 9, lastOrdered: "5 days ago", bannerFrom: "#2f1f3a", bannerTo: "#6b3a78" },
  { id: "u3", name: "Veg Hakka Noodles", restaurant: "Wok to Walk", price: 220, timesOrdered: 7, lastOrdered: "8 days ago", bannerFrom: "#1f3a2a", bannerTo: "#3a785e" },
  { id: "u4", name: "Chicken Shawarma Wrap", restaurant: "Shawarma Station", price: 180, timesOrdered: 11, lastOrdered: "1 day ago", bannerFrom: "#3a2f12", bannerTo: "#7a6018" },
  { id: "u5", name: "Butter Chicken + Rice", restaurant: "Maa ki Daal", price: 420, timesOrdered: 6, lastOrdered: "12 days ago", bannerFrom: "#3a1212", bannerTo: "#7a2a18" },
  { id: "u6", name: "Classic Veg Burger", restaurant: "Burger Singh", price: 149, timesOrdered: 8, lastOrdered: "4 days ago", bannerFrom: "#3a3012", bannerTo: "#7a6a18" },
];

export type PastOrder = {
  id: string;
  restaurant: string;
  summary: string;
  date: string;
  amount: number;
  bannerFrom: string;
  bannerTo: string;
};

export const PAST_ORDERS: PastOrder[] = [
  { id: "p1", restaurant: "Paradise Biryani", summary: "Chicken Biryani + 1 more", date: "May 9, 2026", amount: 640, bannerFrom: "#3a1f12", bannerTo: "#7a3a18" },
  { id: "p2", restaurant: "Shawarma Station", summary: "Chicken Shawarma Wrap", date: "May 7, 2026", amount: 180, bannerFrom: "#3a2f12", bannerTo: "#7a6018" },
  { id: "p3", restaurant: "Burger Singh", summary: "Classic Veg Burger + Fries", date: "May 5, 2026", amount: 299, bannerFrom: "#3a3012", bannerTo: "#7a6a18" },
  { id: "p4", restaurant: "Dhaba Express", summary: "Paneer Butter Masala + Naan", date: "May 3, 2026", amount: 380, bannerFrom: "#2f1f3a", bannerTo: "#6b3a78" },
  { id: "p5", restaurant: "Wok to Walk", summary: "Veg Hakka Noodles", date: "Apr 30, 2026", amount: 220, bannerFrom: "#1f3a2a", bannerTo: "#3a785e" },
  { id: "p6", restaurant: "Maa ki Daal", summary: "Butter Chicken + Rice + Dal", date: "Apr 28, 2026", amount: 670, bannerFrom: "#3a1212", bannerTo: "#7a2a18" },
];
