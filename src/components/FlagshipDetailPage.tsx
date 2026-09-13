import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../types';
import { formatPrice } from '../data';

interface FlagshipDetailPageProps {
  onAddToCart: (item: CartItem) => void;
  currency: string;
}

export function FlagshipDetailPage({ onAddToCart, currency }: FlagshipDetailPageProps) {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("Obsidian Amber");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const gallery = [
    {
      label: "Front Angle",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIrfroAWl-xaqkgFnqiGFdahjqSRPg6mnsJNYnSCzWHnC0YbXKhwA0s-LQWp_Zbo0kyCdIeKcHwuHw2cT2ZU8JfSqMJdkCO4Zm2SDXax3dKBrUq61G9-eKymtLLzBejsNGxkmyHJ5Ngs47nJcD744yexR0TV_p1hMP7oBlQpZoXaP2cMK-J7QY1anW5QqjltuW7SdpmwWa1iP6cQB5qN49f0oS4dVxup9M2Qvbt5c2Gcs-qJPFP-7_"
    },
    {
      label: "Side Profile",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAD1AaF6vpHZXhvdfsoJNdPZszMJBpdR0X-LGYF3papzOKKcZLftcBH8J6eHfuyqS5AqK-9kkMlEIJjtVb5LqWfgssx4ghI87aD1dO6n9XAl9B3ArjwNNkw-QNQfMqFxPQjQMtiDnz3MSA11FVPXHTb7zR84sWsQTgusTwyt4Uq06VZA0yuTUrXsG1jFMmwVKUT22F1H-EYuPg_hOIDlOtm7VncOIWw88vIMZL89OjYV6JFrTYZ3vXT"
    },
    {
      label: "Planar Core",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkLabOc8IrUzBDuK-vgFas_xa_1aZSaQ175yFQ0a0x7Bk6IltMaAocFqKOLwu-hWLiyIK4hlb3JsVBlw3q24W0guwDQrSKG3aiAxzGIesVoftYupfD_NVk-JGfddTJMHSBVrv3CXLQxubdoUJ0fbTQk7usBJPluxxfBJ_VkAxNySLm5ZFrXPw8kLl8ftD7rTkhE_O9pTxrkVMdpnl-qLjut90PWwskyrvwk4ValiF9j3dyqaBUThrP"
    },
    {
      label: "Obsidian Case",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDP7t-Ns5IS8rWw-9WQbxwupfu9if_XgBQWsYvzIAK8Q38WPkIOhxpvAmIxC_7IXXdDpzKlKdo1Tv4s2OKw2cPk-HT5fQi-k-c4NpOXZJGcsf1cMBTddQsMGx0viBLjfBu6_2xk8kgjRAmYgf0ASNBVa_ZeUtj99XYk3cPJO-Nt9wulIIRCnxS1LyYeXKS7rNTPyp7NcQ51Vk-ZmpJphJF8DPudOOuw_05l_YOotpcY3Ll6w2Ix9v2A"
    }
  ];

  const colors = [
    { name: "Obsidian Amber", bg: "bg-primary" },
    { name: "Muted Sage", bg: "bg-secondary" },
    { name: "Titanium Stealth", bg: "bg-tertiary" },
    { name: "Smoked Slate", bg: "bg-surface-variant" }
  ];

  const handleAddAction = () => {
    setIsAdding(true);
    onAddToCart({
      id: "aurora-flagship",
      name: "AURORA Studio Cybernetic Wireless Headphones",
      price: 349.99,
      image: gallery[selectedImgIndex].src,
      category: "Flagship Planar",
      quantity
    });
    setTimeout(() => setIsAdding(false), 1800);
  };

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <main className="w-full pt-20 bg-background">
      <div className="flex flex-col w-full">
        <section className="relative w-full overflow-hidden pb-space-xl">
          <div className="max-w-7xl mx-auto px-margin">
            {/* Breadcrumbs matching provided HTML */}
            <div className="py-space-md flex items-center gap-space-xs font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
              <Link className="hover:text-primary transition-colors" to="/">Audio</Link>
              <span className="text-outline-variant">/</span>
              <Link className="hover:text-primary transition-colors" to="/shop-catalog">Over-Ear</Link>
              <span className="text-outline-variant">/</span>
              <span className="text-primary font-medium">AURORA Studio</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
              {/* Left Column: Image Preview + Gallery Thumbnails + HUD Spec */}
              <div className="lg:col-span-7 flex flex-col gap-space-lg">
                <div className="relative w-full rounded-xl bg-surface-container-low border border-outline-variant/30 p-space-xl flex flex-col items-center justify-center min-h-[560px] overflow-hidden group">
                  <div className="absolute inset-0 bg-radial from-surface-variant/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                  <div className="absolute top-space-md left-space-md z-10 flex items-center gap-space-xs bg-surface-container-high/90 border border-outline-variant/40 px-space-md py-1 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">Optic Node Active</span>
                  </div>
                  <div className="absolute top-space-md right-space-md z-10 flex items-center gap-space-xs">
                    <button className="w-9 h-9 rounded bg-surface-container-high/80 border border-outline-variant/40 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-all cursor-pointer" type="button">
                      <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
                    </button>
                    <button className="w-9 h-9 rounded bg-surface-container-high/80 border border-outline-variant/40 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all cursor-pointer" type="button">
                      <span className="material-symbols-outlined text-[18px]">favorite_border</span>
                    </button>
                  </div>
                  <div className="relative z-10 w-full max-w-md aspect-square flex items-center justify-center p-space-md">
                    <img
                      alt="AURORA Studio Cybernetic Wireless Headphones"
                      className="w-full h-full object-contain filter contrast-105 transition-all duration-300 scale-100 group-hover:scale-102"
                      src={gallery[selectedImgIndex].src}
                    />
                  </div>
                  <div className="relative z-10 w-full flex items-center justify-between px-space-md pt-space-md mt-auto">
                    <div className="flex items-center gap-space-sm bg-surface-container/80 border border-outline-variant/30 px-space-md py-1.5 rounded">
                      <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">Freq Response</span>
                      <span className="font-label-sm text-label-sm text-primary font-medium">4Hz - 48kHz Hi-Res</span>
                    </div>
                    <div className="flex items-center gap-space-xs bg-surface-container/80 border border-outline-variant/30 px-space-md py-1.5 rounded">
                      <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">THD</span>
                      <span className="font-label-sm text-label-sm text-secondary font-medium">&lt; 0.03%</span>
                    </div>
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-space-md">
                  {gallery.map((thumb, idx) => {
                    const isCurrent = idx === selectedImgIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedImgIndex(idx)}
                        className={`relative rounded-lg p-2 transition-all duration-200 group cursor-pointer ${
                          isCurrent
                            ? "bg-surface-container-high border border-primary/60"
                            : "bg-surface-container-low border border-outline-variant/30 hover:bg-surface-container-high"
                        }`}
                        type="button"
                      >
                        <div className="w-full aspect-square rounded overflow-hidden bg-surface-container-lowest flex items-center justify-center">
                          <img alt={thumb.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={thumb.src} />
                        </div>
                        <span className={`block mt-1.5 font-label-sm text-label-sm text-center truncate ${isCurrent ? "text-primary" : "text-on-surface-variant"}`}>
                          {thumb.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Acoustic HUD Spec */}
                <div className="rounded-xl bg-surface-container-low border border-outline-variant/30 p-space-lg flex flex-col gap-space-md">
                  <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-normal">Acoustic HUD Telemetry</span>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-space-sm py-0.5 rounded">Architectural Spec</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                    <div className="rounded-lg bg-surface-container border border-outline-variant/30 p-space-md flex flex-col gap-1.5">
                      <span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider">Active Drivers</span>
                      <span className="font-headline-sm text-headline-sm text-primary">50mm Planar</span>
                      <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden mt-1">
                        <div className="bg-primary h-full w-[94%] rounded-full"></div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-surface-container border border-outline-variant/30 p-space-md flex flex-col gap-1.5">
                      <span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider">ANC Attenuation</span>
                      <span className="font-headline-sm text-headline-sm text-secondary">-42 dB Neural</span>
                      <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden mt-1">
                        <div className="bg-secondary h-full w-[88%] rounded-full"></div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-surface-container border border-outline-variant/30 p-space-md flex flex-col gap-1.5">
                      <span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider">Wireless Latency</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface">11 ms Sub-Band</span>
                      <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden mt-1">
                        <div className="bg-outline h-full w-[98%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Details & Actions matching provided HTML */}
              <div className="lg:col-span-5 flex flex-col gap-space-lg">
                <div className="flex flex-col gap-space-sm">
                  <div className="flex flex-wrap items-center gap-space-sm">
                    <span className="inline-flex items-center gap-1.5 px-space-md py-0.5 rounded bg-primary/10 border border-primary/30 text-primary font-label-sm text-label-sm uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Flagship Edition
                    </span>
                    <span className="inline-flex items-center px-space-sm py-0.5 rounded bg-surface-container-high border border-outline-variant/40 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                      In Stock (Ships in 24h)
                    </span>
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1 font-normal">
                    AURORA Studio Cybernetic Wireless Headphones
                  </h1>
                  <div className="flex items-center gap-space-md mt-0.5">
                    <div className="flex items-center text-primary">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                      <span className="ml-1.5 font-headline-sm text-headline-sm text-on-surface">4.9</span>
                    </div>
                    <span className="text-outline-variant text-body-sm">|</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant underline-offset-4 cursor-pointer hover:text-primary">142 verified operatives</span>
                  </div>
                </div>

                <div className="rounded-xl bg-surface-container-low border border-outline-variant/30 p-space-md flex flex-col gap-space-xs">
                  <div className="flex items-baseline gap-space-md">
                    <span className="font-display-lg-mobile sm:font-display-lg sm:text-display-lg text-primary tracking-tight font-light leading-none">{formatPrice(349.99, currency)}</span>
                    <span className="font-headline-sm text-headline-sm text-outline line-through">$429.00</span>
                    <span className="px-space-sm py-0.5 rounded bg-secondary-container text-secondary font-label-sm text-label-sm uppercase font-semibold border border-secondary/20">Save $79</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5 mt-1">
                    <span className="material-symbols-outlined text-[18px] text-primary">credit_score</span>
                    <span>or 4 interest-free payments of <strong className="text-on-surface font-medium">$87.50</strong> with <span className="text-primary font-semibold">Klarna</span></span>
                  </p>
                </div>

                <div className="flex flex-col gap-space-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface">Finish Tone:</span>
                    <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-medium">{selectedColor}</span>
                  </div>
                  <div className="flex items-center gap-space-md">
                    {colors.map(col => (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(col.name)}
                        className={`relative w-9 h-9 rounded p-0.5 transition-all duration-200 cursor-pointer ${
                          selectedColor === col.name ? "bg-surface-container-highest border border-primary" : "bg-surface-container border border-outline-variant/40 hover:border-outline"
                        }`}
                        type="button"
                      >
                        <span className="block w-full h-full rounded bg-surface-container-lowest relative flex items-center justify-center">
                          <span className={`w-3.5 h-3.5 rounded-full ${col.bg}`}></span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-space-md pt-space-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-surface-container-high rounded border border-outline-variant/40 p-0.5">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded bg-surface-container hover:bg-surface-bright flex items-center justify-center text-on-surface transition-colors cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">remove</span>
                      </button>
                      <span className="w-10 text-center font-label-md text-label-md text-on-surface font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 rounded bg-surface-container hover:bg-surface-bright flex items-center justify-center text-on-surface transition-colors cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">14 units remaining in current batch</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-space-sm">
                    {/* Shiny button effect for primary CTA */}
                    <button
                      onClick={handleAddAction}
                      className="btn-shiny w-full relative group overflow-hidden rounded-lg py-3.5 px-space-xl bg-primary text-on-primary font-headline-sm text-headline-sm font-medium tracking-wide hover:bg-primary-fixed-dim active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-space-sm shadow-md cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[22px]">
                        {isAdding ? "done" : "shopping_cart"}
                      </span>
                      <span className="relative z-10">
                        {isAdding ? "Added to Matrix Loadout" : `Add To Cart • ${formatPrice(349.99 * quantity, currency)}`}
                      </span>
                    </button>
                    <Link
                      to="/cart"
                      className="w-full rounded-lg py-3 px-space-xl bg-surface-container-high border border-outline-variant/50 hover:bg-surface-bright text-on-surface font-label-lg text-label-lg uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-space-sm"
                    >
                      <span className="material-symbols-outlined text-primary text-[18px]">fingerprint</span>
                      <span>Buy with NeuralPay 1-Click</span>
                    </Link>
                  </div>
                </div>

                {/* Accordions matching provided HTML */}
                <div className="flex flex-col gap-space-xs pt-space-xs">
                  {[
                    {
                      title: "Box Contents",
                      content: "• 1x AURORA Studio Cybernetic Planar Magnetic Headphone\n• 1x Molded Obsidian Armor Travel Case\n• 1x 2.4GHz Transceiver Node\n• 1x Braided 1.8m Zero-Loss Cable"
                    },
                    {
                      title: "Warranty & Lifetime Firmware",
                      content: "Backed by DEERHORN's 3-Year Zero-Tolerance Mechanical Warranty. Direct over-the-air DSP profiles through VIP Terminal."
                    },
                    {
                      title: "Global Express Shipping",
                      content: "Orders dispatched within 24 hours via Priority Air Courier with end-to-end cryptographic tracking keys."
                    }
                  ].map((item, i) => (
                    <div key={i} className="rounded-lg bg-surface-container-low border border-outline-variant/30 overflow-hidden transition-all">
                      <button
                        onClick={() => toggleAccordion(i)}
                        className="w-full px-space-md py-space-md flex items-center justify-between text-left hover:bg-surface-container transition-colors cursor-pointer"
                        type="button"
                      >
                        <span className="font-headline-sm text-headline-sm text-on-surface text-[18px]">{item.title}</span>
                        <span
                          className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${
                            openAccordion === i ? "rotate-180" : ""
                          }`}
                        >
                          expand_more
                        </span>
                      </button>
                      {openAccordion === i && (
                        <div className="px-space-md pb-space-md text-on-surface-variant font-body-sm text-body-sm whitespace-pre-line border-t border-outline-variant/20 pt-space-sm">
                          {item.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
