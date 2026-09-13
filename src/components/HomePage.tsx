import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeroScrollSection } from './HeroScrollSection';
import { CartItem } from '../types';
import { formatPrice } from '../data';

interface HomePageProps {
  onAddToCart: (item: CartItem) => void;
  currency: string;
}

export function HomePage({ onAddToCart, currency }: HomePageProps) {
  const navigate = useNavigate();

  return (
    <main className="w-full bg-background">
      <div className="flex flex-col w-full">
        <div className="relative w-full overflow-hidden">
          <div className="absolute -top-32 left-1/4 w-96 h-96 bg-primary-container/5 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute top-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-[160px] pointer-events-none"></div>

          {/* 1. OPTION A: FULLSCREEN PURE ISOLINE ANIMATION + EXPLODED HEADPHONE SCROLL */}
          <HeroScrollSection onAddToCart={onAddToCart} currency={currency} />

          {/* 2. SPECIFICATIONS & HARDWARE OVERVIEW (revealed after scroll animation) */}
          <section id="specs-section" className="relative max-w-7xl mx-auto px-margin pt-space-xl pb-space-xl">
            <div className="mt-space-xl grid grid-cols-2 md:grid-cols-4 gap-gutter bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-md shadow-md">
              <div className="flex items-center gap-space-md p-space-sm bg-surface-container/60 rounded-lg border border-outline-variant/20">
                <div className="p-space-sm rounded-lg bg-surface-container-high text-primary">
                  <span className="material-symbols-outlined text-[22px]">speed</span>
                </div>
                <div>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-medium block">0.01ms</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Synaptic Latency</span>
                </div>
              </div>
              <div className="flex items-center gap-space-md p-space-sm bg-surface-container/60 rounded-lg border border-outline-variant/20">
                <div className="p-space-sm rounded-lg bg-surface-container-high text-secondary">
                  <span className="material-symbols-outlined text-[22px]">electric_bolt</span>
                </div>
                <div>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-medium block">120W</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Rapid Charge Bus</span>
                </div>
              </div>
              <div className="flex items-center gap-space-md p-space-sm bg-surface-container/60 rounded-lg border border-outline-variant/20">
                <div className="p-space-sm rounded-lg bg-surface-container-high text-primary">
                  <span className="material-symbols-outlined text-[22px]">diamond</span>
                </div>
                <div>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-medium block">Grade 5</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Forged Titanium</span>
                </div>
              </div>
              <div className="flex items-center gap-space-md p-space-sm bg-surface-container/60 rounded-lg border border-outline-variant/20">
                <div className="p-space-sm rounded-lg bg-surface-container-high text-secondary">
                  <span className="material-symbols-outlined text-[22px]">graphic_eq</span>
                </div>
                <div>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-medium block">Acoustic</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Natural ANC Seal</span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. TRENDING ACCESSORIES (matching provided HTML structure + shiny buttons) */}
          <section className="max-w-7xl mx-auto px-margin py-space-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
              <div>
                <div className="flex items-center gap-space-xs text-primary mb-space-xs">
                  <span className="material-symbols-outlined text-[16px]">all_inclusive</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest font-semibold">Modular Collection</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-normal">Trending Accessories</h2>
              </div>
              <div className="flex items-center gap-space-xs">
                <Link to="/shop-catalog" className="px-space-md py-1.5 rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/30 hover:border-primary hover:text-primary transition-all font-label-md text-label-md uppercase">
                  View Catalog
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {/* Card 1 */}
              <div className="group relative bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-md flex flex-col justify-between shadow-sm hover:border-outline hover:bg-surface-container transition-all duration-300">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-lowest mb-space-md">
                  <img alt="AURORA Wireless Headphones" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIrfroAWl-xaqkgFnqiGFdahjqSRPg6mnsJNYnSCzWHnC0YbXKhwA0s-LQWp_Zbo0kyCdIeKcHwuHw2cT2ZU8JfSqMJdkCO4Zm2SDXax3dKBrUq61G9-eKymtLLzBejsNGxkmyHJ5Ngs47nJcD744yexR0TV_p1hMP7oBlQpZoXaP2cMK-J7QY1anW5QqjltuW7SdpmwWa1iP6cQB5qN49f0oS4dVxup9M2Qvbt5c2Gcs-qJPFP-7_" />
                  <div className="absolute top-space-sm left-space-sm px-space-sm py-0.5 rounded-lg bg-surface-container-lowest/85 backdrop-blur-md border border-outline-variant/30">
                    <span className="font-label-sm text-label-sm uppercase font-semibold text-primary tracking-wider">Planar Flux</span>
                  </div>
                </div>
                <div className="flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-normal">AURORA Headphones</h3>
                    <span className="font-label-lg text-label-lg text-primary font-semibold">{formatPrice(349.99, currency)}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                    Over-ear planar magnetic acoustic architecture with tactile matte chassis and pure wireless transmission.
                  </p>
                </div>
                <div className="mt-space-md pt-space-sm border-t border-outline-variant/20 flex items-center justify-between">
                  <Link to="/flagship-detail" className="text-primary hover:underline font-label-sm text-[12px] uppercase">Details</Link>
                  <button 
                    onClick={() => onAddToCart({ id: "aurora-hp", name: "AURORA Headphones", price: 349.99, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIrfroAWl-xaqkgFnqiGFdahjqSRPg6mnsJNYnSCzWHnC0YbXKhwA0s-LQWp_Zbo0kyCdIeKcHwuHw2cT2ZU8JfSqMJdkCO4Zm2SDXax3dKBrUq61G9-eKymtLLzBejsNGxkmyHJ5Ngs47nJcD744yexR0TV_p1hMP7oBlQpZoXaP2cMK-J7QY1anW5QqjltuW7SdpmwWa1iP6cQB5qN49f0oS4dVxup9M2Qvbt5c2Gcs-qJPFP-7_", category: "Planar Flux", quantity: 1 })} 
                    className="btn-shiny px-space-md py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/40 text-on-surface hover:bg-primary hover:text-on-primary hover:border-primary font-label-sm text-label-sm uppercase font-semibold transition-all flex items-center gap-1 cursor-pointer" 
                    type="button"
                  >
                    <span>Add</span>
                    <span className="material-symbols-outlined text-[15px]">add_shopping_cart</span>
                  </button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-md flex flex-col justify-between shadow-sm hover:border-outline hover:bg-surface-container transition-all duration-300">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-lowest mb-space-md">
                  <img alt="MAG-VORTEX Wireless Pad" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGvhAQL71FaFD0NW_Ja40zL_ddebgXLpIqxCG791VoSTJYnJRjXcouV7PahU_h7FSr9bRayZjm_2AsbVQ8w50tm1YBzlTWwGNk1wPvHGBGrvaeDoZr4GhuG5kgeOll1nRLwBXqf9dkvQUWuNRwyB3tXwPqsReNOv8h_2_exAZBzm9X35PdUiHht5SrfR09tD37GMjEHzbUVVlXbFxmZaYecdcYeyx2Oa-m7eGR7vUFJTSzKPxgbdaJ" />
                  <div className="absolute top-space-sm left-space-sm px-space-sm py-0.5 rounded-lg bg-surface-container-lowest/85 backdrop-blur-md border border-outline-variant/30">
                    <span className="font-label-sm text-label-sm uppercase font-semibold text-secondary tracking-wider">Magnetic Dock</span>
                  </div>
                </div>
                <div className="flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-normal">MAG-VORTEX Pad</h3>
                    <span className="font-label-lg text-label-lg text-primary font-semibold">{formatPrice(89.99, currency)}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                    Sculpted slate charging dock station with anodized bronze core and rapid thermal diffusion.
                  </p>
                </div>
                <div className="mt-space-md pt-space-sm border-t border-outline-variant/20 flex items-center justify-between">
                  <Link to="/shop-catalog" className="text-primary hover:underline font-label-sm text-[12px] uppercase">Catalog</Link>
                  <button 
                    onClick={() => onAddToCart({ id: "mag-pad", name: "MAG-VORTEX Pad", price: 89.99, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGvhAQL71FaFD0NW_Ja40zL_ddebgXLpIqxCG791VoSTJYnJRjXcouV7PahU_h7FSr9bRayZjm_2AsbVQ8w50tm1YBzlTWwGNk1wPvHGBGrvaeDoZr4GhuG5kgeOll1nRLwBXqf9dkvQUWuNRwyB3tXwPqsReNOv8h_2_exAZBzm9X35PdUiHht5SrfR09tD37GMjEHzbUVVlXbFxmZaYecdcYeyx2Oa-m7eGR7vUFJTSzKPxgbdaJ", category: "Magnetic Dock", quantity: 1 })} 
                    className="btn-shiny px-space-md py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/40 text-on-surface hover:bg-primary hover:text-on-primary hover:border-primary font-label-sm text-label-sm uppercase font-semibold transition-all flex items-center gap-1 cursor-pointer" 
                    type="button"
                  >
                    <span>Add</span>
                    <span className="material-symbols-outlined text-[15px]">add_shopping_cart</span>
                  </button>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group relative bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-md flex flex-col justify-between shadow-sm hover:border-outline hover:bg-surface-container transition-all duration-300">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-lowest mb-space-md">
                  <img alt="CYBER-PODS Pro" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAVwl50YxOlQV-gLftxP5syzarG8xJKrMts82kfyW0iMrObBODZnJ6wEY8JuSsNzJ49ytEOekW1XKEQLXSk--wdFLyAdpW6xj8o7xQksvUkAvlOBERModhbPYNZEhAvdCCIWSXrARvLwmnzpLImR0d12gPsP4qZyHX3Nh5CcM0b43pcBetdw45jk_ZeGey1D80K_1HRaRbNywmfV7kAL4zVxulQo41b_FxJKQvgy6sV5ui_5a5-308" />
                  <div className="absolute top-space-sm left-space-sm px-space-sm py-0.5 rounded-lg bg-surface-container-lowest/85 backdrop-blur-md border border-outline-variant/30">
                    <span className="font-label-sm text-label-sm uppercase font-semibold text-primary tracking-wider">Acoustic IEM</span>
                  </div>
                </div>
                <div className="flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-normal">CYBER-PODS Pro</h3>
                    <span className="font-label-lg text-label-lg text-primary font-semibold">{formatPrice(189.99, currency)}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                    Organic balanced in-ear monitors housed in a brushed mineral shell with anatomical silicone seals.
                  </p>
                </div>
                <div className="mt-space-md pt-space-sm border-t border-outline-variant/20 flex items-center justify-between">
                  <Link to="/shop-catalog" className="text-primary hover:underline font-label-sm text-[12px] uppercase">Catalog</Link>
                  <button 
                    onClick={() => onAddToCart({ id: "cyber-pods", name: "CYBER-PODS Pro", price: 189.99, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAVwl50YxOlQV-gLftxP5syzarG8xJKrMts82kfyW0iMrObBODZnJ6wEY8JuSsNzJ49ytEOekW1XKEQLXSk--wdFLyAdpW6xj8o7xQksvUkAvlOBERModhbPYNZEhAvdCCIWSXrARvLwmnzpLImR0d12gPsP4qZyHX3Nh5CcM0b43pcBetdw45jk_ZeGey1D80K_1HRaRbNywmfV7kAL4zVxulQo41b_FxJKQvgy6sV5ui_5a5-308", category: "Acoustic IEM", quantity: 1 })} 
                    className="btn-shiny px-space-md py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/40 text-on-surface hover:bg-primary hover:text-on-primary hover:border-primary font-label-sm text-label-sm uppercase font-semibold transition-all flex items-center gap-1 cursor-pointer" 
                    type="button"
                  >
                    <span>Add</span>
                    <span className="material-symbols-outlined text-[15px]">add_shopping_cart</span>
                  </button>
                </div>
              </div>

              {/* Card 4 */}
              <div className="group relative bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-md flex flex-col justify-between shadow-sm hover:border-outline hover:bg-surface-container transition-all duration-300">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-lowest mb-space-md flex items-center justify-center">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Titan Kevlar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl8kME0NZemfK9LhShaiwKGmTwjx46pLZnHAnvzkM4PEwjlTkHh5Qu4dX7u9lGEAzCB74hUWMxYFmx5ont1oZ0NOjx_tT0e7muNxonbhQB4UVctcybR8SjAykAZP266Kf76MzKRqDdWFfUj-ND2Zj-5ODWGi4RrXQTeRo_uwqN2W0AmQjVP261IAZAqbKDxg4jQlr6H_R03xCkJJcae9d4eWPeXjSE8428cZzWVt9gB2fruJku0Li3" />
                  <div className="absolute top-space-sm left-space-sm px-space-sm py-0.5 rounded-lg bg-surface-container-lowest/85 backdrop-blur-md border border-outline-variant/30">
                    <span className="font-label-sm text-label-sm uppercase font-semibold text-secondary tracking-wider">Reinforced</span>
                  </div>
                </div>
                <div className="flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-normal">TITAN KEVLAR Pack</h3>
                    <span className="font-label-lg text-label-lg text-primary font-semibold">{formatPrice(49.99, currency)}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                    Tactile braided cabling wrapped in natural aramid fibers with solid milled copper alloy housing.
                  </p>
                </div>
                <div className="mt-space-md pt-space-sm border-t border-outline-variant/20 flex items-center justify-between">
                  <Link to="/shop-catalog" className="text-primary hover:underline font-label-sm text-[12px] uppercase">Catalog</Link>
                  <button 
                    onClick={() => onAddToCart({ id: "titan-kevlar", name: "TITAN KEVLAR Pack", price: 49.99, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBl8kME0NZemfK9LhShaiwKGmTwjx46pLZnHAnvzkM4PEwjlTkHh5Qu4dX7u9lGEAzCB74hUWMxYFmx5ont1oZ0NOjx_tT0e7muNxonbhQB4UVctcybR8SjAykAZP266Kf76MzKRqDdWFfUj-ND2Zj-5ODWGi4RrXQTeRo_uwqN2W0AmQjVP261IAZAqbKDxg4jQlr6H_R03xCkJJcae9d4eWPeXjSE8428cZzWVt9gB2fruJku0Li3", category: "Reinforced", quantity: 1 })} 
                    className="btn-shiny px-space-md py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/40 text-on-surface hover:bg-primary hover:text-on-primary hover:border-primary font-label-sm text-label-sm uppercase font-semibold transition-all flex items-center gap-1 cursor-pointer" 
                    type="button"
                  >
                    <span>Add</span>
                    <span className="material-symbols-outlined text-[15px]">add_shopping_cart</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 4. PROMOTIONAL ECOSYSTEM SECTION matching provided HTML */}
          <section className="max-w-7xl mx-auto px-margin pb-space-xl">
            <div className="relative overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-low p-space-lg lg:p-space-xl shadow-lg">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
              <div className="absolute -left-20 -top-20 w-80 h-80 bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
                <div className="lg:col-span-8 flex flex-col gap-space-sm">
                  <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-lg bg-surface-container-high border border-outline-variant/30 text-primary w-fit">
                    <span className="material-symbols-outlined text-[16px]">hub</span>
                    <span className="font-label-sm text-label-sm uppercase tracking-widest font-semibold">Synapse Ecosystem v3</span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-normal">
                    DEERHORN Synapse Architecture
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-xl font-light leading-relaxed">
                    Sync your instruments across a coherent sensory environment. Effortless handoff between tactile mobile nodes, planar transducers, and sculptured charging surfaces.
                  </p>
                  <div className="mt-space-md flex items-center gap-3 max-w-md p-space-sm rounded-lg bg-surface-container border border-outline-variant/30">
                    <span className="font-label-sm text-label-sm text-primary font-mono tracking-wider">SYNC: 99.4%</span>
                    <div className="flex-1 flex items-end gap-1 h-5">
                      <div className="w-1.5 h-3 bg-primary rounded-xs"></div>
                      <div className="w-1.5 h-4 bg-primary rounded-xs"></div>
                      <div className="w-1.5 h-2 bg-primary/50 rounded-xs"></div>
                      <div className="w-1.5 h-5 bg-secondary rounded-xs"></div>
                      <div className="w-1.5 h-3 bg-secondary/80 rounded-xs"></div>
                      <div className="w-1.5 h-4 bg-primary rounded-xs"></div>
                      <div className="w-1.5 h-2.5 bg-primary/70 rounded-xs"></div>
                      <div className="w-1.5 h-5 bg-secondary rounded-xs"></div>
                      <div className="w-1.5 h-2 bg-secondary/40 rounded-xs"></div>
                      <div className="w-1.5 h-3 bg-primary/80 rounded-xs"></div>
                      <div className="w-1.5 h-4.5 bg-secondary rounded-xs"></div>
                    </div>
                    <span className="font-label-sm text-label-sm text-secondary font-mono tracking-wider">LAT: 0.01ms</span>
                  </div>
                </div>
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-space-sm justify-center items-start lg:items-end">
                  <button 
                    onClick={() => navigate('/shop-catalog')} 
                    className="btn-shiny w-full sm:w-auto px-space-xl py-space-md rounded-lg bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider font-semibold hover:bg-primary-fixed-dim transition-all flex items-center justify-center gap-space-xs shadow-sm cursor-pointer" 
                    type="button"
                  >
                    <span>Connect All Units</span>
                    <span className="material-symbols-outlined text-[18px]">sync</span>
                  </button>
                  <Link to="/flagship-detail" className="w-full sm:w-auto px-space-lg py-space-md rounded-lg bg-surface-container-high border border-outline-variant/40 text-on-surface hover:text-primary hover:border-primary/50 font-label-md text-label-md uppercase tracking-wider font-medium transition-all text-center">
                    Read Architecture Monograph
                  </Link>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
