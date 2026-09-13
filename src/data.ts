import { CatalogProduct, CurrencyConfig } from './types';

export const LOGO_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuA7uQx3lj68kEjmuNF5F38KkUTUY1lRNBafmsQTSeyiaXr91TAgLmsNXQza8BXvf9H09ozcKCqO38UnUKhrcDiXK34PJ2fhgET84t4N8JISqokKDrBSbkNjrLZb9dH-SC0ow6x_xqJyrfAWbJx0rJrFOPbgWvFHYApjq6CBkQGPtaYHWPpAJnGSOXl0kWdVBp9CQVZOf4K5tEnRHO_H9g72BosuawF7EriZ2DqxUQcTpUw51V5UBRGJ";

export const FALLBACK_HERO_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuCIrfroAWl-xaqkgFnqiGFdahjqSRPg6mnsJNYnSCzWHnC0YbXKhwA0s-LQWp_Zbo0kyCdIeKcHwuHw2cT2ZU8JfSqMJdkCO4Zm2SDXax3dKBrUq61G9-eKymtLLzBejsNGxkmyHJ5Ngs47nJcD744yexR0TV_p1hMP7oBlQpZoXaP2cMK-J7QY1anW5QqjltuW7SdpmwWa1iP6cQB5qN49f0oS4dVxup9M2Qvbt5c2Gcs-qJPFP-7_";

export const CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", rate: 1.0, label: "USD ($) — United States" },
  EUR: { code: "EUR", symbol: "€", rate: 0.92, label: "EUR (€) — Eurozone" },
  GBP: { code: "GBP", symbol: "£", rate: 0.79, label: "GBP (£) — United Kingdom" },
  CAD: { code: "CAD", symbol: "CA$", rate: 1.36, label: "CAD ($) — Canada" },
  AUD: { code: "AUD", symbol: "AU$", rate: 1.52, label: "AUD ($) — Australia" },
  JPY: { code: "JPY", symbol: "¥", rate: 154.0, label: "JPY (¥) — Japan" },
  INR: { code: "INR", symbol: "₹", rate: 84.0, label: "INR (₹) — India" },
  NPR: { code: "NPR", symbol: "Rs ", rate: 134.0, label: "NPR (Rs) — Nepal" }
};

export function formatPrice(amountUSD: number, currencyCode: string = "USD"): string {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const converted = amountUSD * curr.rate;
  if (curr.code === "JPY") {
    return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
  }
  return `${curr.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const CATALOG_ITEMS: CatalogProduct[] = [
  {
    id: "p1",
    cat: "phones",
    name: "DEERHORN Phone Alpha",
    tag: "FLAGSHIP 01",
    subtag: "Aero-Titanium",
    rating: "4.9 (128)",
    specNode: "Cellular Node // MK IX",
    price: 849.99,
    desc: "Milled seamless titanium chassis with integrated photonic waveguide display & holographic OS projection.",
    pill1: "240W Hyper-Induction",
    pill2: "120Hz Holographic",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDogaMrhUOOJrmyIZNrXj8ofloAfHRcfGO2ABRHrblO0HG6jQnkNBdkmSq66D8AvQIqByv7L0AdMH_COY10nYpevPFT7JqfpBn4HL1joMzNLDDaJfGoF8Ot6E4sVj2ZPTIaR_ppKV1ZyYaxfxBeGdOnpV7OcwCfyzc44u9bsPjyucjturZ6_FO6C18R3WT4VqnvZTPRjlR2okEpCgNI_Dl_XNt4VFUlYWgqMuS4VUf37NUCPuLqL2DS"
  },
  {
    id: "p2",
    cat: "audio",
    name: "AURORA Studio Wireless",
    tag: "ACOUSTIC MATRIX",
    subtag: "50mm Planar Driver",
    rating: "4.8 (94)",
    specNode: "Aural Immersion // Gen 3",
    price: 349.99,
    desc: "Closed-back planar magnetic monitors with laser-calibrated active noise cancellation and refined acoustic resonance.",
    pill1: "96kHz / 32-Bit DAC",
    pill2: "72 Hr Battery",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIrfroAWl-xaqkgFnqiGFdahjqSRPg6mnsJNYnSCzWHnC0YbXKhwA0s-LQWp_Zbo0kyCdIeKcHwuHw2cT2ZU8JfSqMJdkCO4Zm2SDXax3dKBrUq61G9-eKymtLLzBejsNGxkmyHJ5Ngs47nJcD744yexR0TV_p1hMP7oBlQpZoXaP2cMK-J7QY1anW5QqjltuW7SdpmwWa1iP6cQB5qN49f0oS4dVxup9M2Qvbt5c2Gcs-qJPFP-7_"
  },
  {
    id: "p3",
    cat: "power",
    name: "MAG-VORTEX Flux Pad",
    tag: "FLUX INDUCTION",
    subtag: "Dual Coil Levitation",
    rating: "4.7 (210)",
    specNode: "Power Transfer // Hexagon",
    price: 89.99,
    desc: "Cybernetic faceted wireless launchpad with synchronized warm perimeter ring and ceramic magnetic tethering.",
    pill1: "65W Superflux",
    pill2: "Active Cooling Core",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGvhAQL71FaFD0NW_Ja40zL_ddebgXLpIqxCG791VoSTJYnJRjXcouV7PahU_h7FSr9bRayZjm_2AsbVQ8w50tm1YBzlTWwGNk1wPvHGBGrvaeDoZr4GhuG5kgeOll1nRLwBXqf9dkvQUWuNRwyB3tXwPqsReNOv8h_2_exAZBzm9X35PdUiHht5SrfR09tD37GMjEHzbUVVlXbFxmZaYecdcYeyx2Oa-m7eGR7vUFJTSzKPxgbdaJ"
  },
  {
    id: "p4",
    cat: "audio",
    name: "CYBER-PODS Ultra ANC",
    tag: "OPERATIVE GEAR",
    subtag: "Sub-Millimeter ANC",
    rating: "4.9 (340)",
    specNode: "Personal Audio // Armor Grade",
    price: 189.99,
    desc: "Reinforced exo-skeleton micro buds, dynamic atmospheric pressure vent, and luminous charge dock readout.",
    pill1: "Low-Latency 18ms",
    pill2: "IP68 Ruggedized",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAVwl50YxOlQV-gLftxP5syzarG8xJKrMts82kfyW0iMrObBODZnJ6wEY8JuSsNzJ49ytEOekW1XKEQLXSk--wdFLyAdpW6xj8o7xQksvUkAvlOBERModhbPYNZEhAvdCCIWSXrARvLwmnzpLImR0d12gPsP4qZyHX3Nh5CcM0b43pcBetdw45jk_ZeGey1D80K_1HRaRbNywmfV7kAL4zVxulQo41b_FxJKQvgy6sV5ui_5a5-308"
  },
  {
    id: "p5",
    cat: "phones",
    name: "DEERHORN Phone Apex",
    tag: "APEX COLLECTOR",
    subtag: "1TB Cryo-Flash",
    rating: "5.0 (62)",
    specNode: "Cellular Node // Limited Run",
    price: 899.00,
    desc: "Dark obsidian electroplate casing with unlocked neuro-silicon frequency and dual spectrum emitter.",
    pill1: "Quantum Shield Armor",
    pill2: "1000 Nits Edge",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDogaMrhUOOJrmyIZNrXj8ofloAfHRcfGO2ABRHrblO0HG6jQnkNBdkmSq66D8AvQIqByv7L0AdMH_COY10nYpevPFT7JqfpBn4HL1joMzNLDDaJfGoF8Ot6E4sVj2ZPTIaR_ppKV1ZyYaxfxBeGdOnpV7OcwCfyzc44u9bsPjyucjturZ6_FO6C18R3WT4VqnvZTPRjlR2okEpCgNI_Dl_XNt4VFUlYWgqMuS4VUf37NUCPuLqL2DS"
  },
  {
    id: "p6",
    cat: "power",
    name: "NEO-DOCK Wireless Station",
    tag: "DESK TERMINAL",
    subtag: "3-Node Transfer",
    rating: "4.6 (85)",
    specNode: "Energy Conduit // Multi-Core",
    price: 129.99,
    desc: "Charges phone, watch, and pods concurrently with thermal exhaust channels and ambient base luminescence.",
    pill1: "Triple Simultaneous",
    pill2: "OLED Wattage HUD",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGvhAQL71FaFD0NW_Ja40zL_ddebgXLpIqxCG791VoSTJYnJRjXcouV7PahU_h7FSr9bRayZjm_2AsbVQ8w50tm1YBzlTWwGNk1wPvHGBGrvaeDoZr4GhuG5kgeOll1nRLwBXqf9dkvQUWuNRwyB3tXwPqsReNOv8h_2_exAZBzm9X35PdUiHht5SrfR09tD37GMjEHzbUVVlXbFxmZaYecdcYeyx2Oa-m7eGR7vUFJTSzKPxgbdaJ"
  }
];
