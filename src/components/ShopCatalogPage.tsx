import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartItem, CatalogProduct } from '../types';
import { CATALOG_ITEMS, formatPrice } from '../data';

interface ShopCatalogPageProps {
  onAddToCart: (item: CartItem) => void;
  currency: string;
  products?: CatalogProduct[];
}

export function ShopCatalogPage({ onAddToCart, currency, products }: ShopCatalogPageProps) {
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("new");
  const [addedId, setAddedId] = useState<string | null>(null);

  const activeCatalog = (products && products.length > 0) ? products : CATALOG_ITEMS;

  const filteredItems = activeCatalog.filter(item => {
    if (filterCategory === "all") return true;
    return item.cat === filterCategory;
  }).sort((a, b) => {
    if (sortOrder === "price") {
      return a.price - b.price;
    }
    if (sortOrder === "rating") {
      return parseFloat(b.rating) - parseFloat(a.rating);
    }
    return 0; // default "new"
  });

  const handleAdd = (item: CatalogProduct) => {
    setAddedId(item.id);
    onAddToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.img,
      category: item.tag,
      quantity: 1
    });
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <main className="w-full pt-20 bg-background">
      <div className="flex flex-col w-full">
        <div className="relative w-full overflow-hidden bg-surface-dim py-space-xl">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-[100px] pointer-events-none"></div>
          <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-secondary-container/20 blur-[120px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-margin relative z-10">
            {/* Header section matching provided HTML */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center gap-space-sm">
                  <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-lg bg-surface-container-high border border-outline-variant/40 text-primary text-label-sm font-label-sm uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Quantum Mesh Catalog v4.2
                  </span>
                  <span className="text-on-surface-variant/80 text-label-sm font-label-sm tracking-wider">SEC_LVL // UNRESTRICTED</span>
                </div>
                <h2 className="text-display-lg font-display-lg text-on-surface tracking-tight">
                  Hardware <span className="text-primary italic font-normal">Matrix</span>
                </h2>
                <p className="text-body-md font-body-md text-on-surface-variant max-w-xl">
                  Synthesized aerospace alloy, photonic wave transmission, and cryogenic planar acoustic arrays ready for immediate tactical deployment.
                </p>
              </div>
              <div className="flex items-center gap-space-md bg-surface-container-low border border-outline-variant/30 px-space-lg py-space-md rounded-xl shadow-lg">
                <div className="flex items-center gap-space-sm text-primary">
                  <span className="material-symbols-outlined text-[26px]">rocket_launch</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface font-semibold">Priority Orbital Transit</span>
                  <span className="text-body-sm font-body-sm text-on-surface-variant">Complimentary courier on payloads over $150</span>
                </div>
              </div>
            </div>

            {/* Filter bar matching provided HTML */}
            <div className="bg-surface-container/60 border border-outline-variant/30 rounded-xl p-space-md shadow-xl flex flex-col gap-space-md mb-space-xl">
              <div className="flex flex-wrap items-center justify-between gap-space-md">
                <div className="flex flex-wrap items-center gap-space-xs">
                  {[
                    { id: "all", label: "All Hardware", count: activeCatalog.length },
                    { id: "phones", label: "Flagship Phones", count: activeCatalog.filter(i => i.cat === 'phones').length },
                    { id: "audio", label: "Audio & Earphones", count: activeCatalog.filter(i => i.cat === 'audio').length },
                    { id: "power", label: "Power & Docks", count: activeCatalog.filter(i => i.cat === 'power').length }
                  ].map(cat => {
                    const isSelected = filterCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setFilterCategory(cat.id)}
                        className={`group flex items-center gap-1.5 px-space-md py-space-sm rounded-lg font-label-sm text-label-sm uppercase tracking-wider transition-all cursor-pointer ${
                          isSelected
                            ? "bg-primary text-on-primary font-semibold shadow-sm"
                            : "bg-surface-container-high border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-bright font-medium"
                        }`}
                        type="button"
                      >
                        <span>{cat.label}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] ${isSelected ? "bg-on-primary/15 text-on-primary font-bold" : "bg-surface-container-lowest text-on-surface-variant"}`}>
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-space-sm">
                  <div className="flex items-center gap-space-xs bg-surface-container-lowest border border-outline-variant/40 px-space-md py-1.5 rounded-lg">
                    <span className="material-symbols-outlined text-primary text-[18px]">sort</span>
                    <span className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">Sort:</span>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="bg-transparent text-on-surface text-label-sm font-label-sm uppercase tracking-wider focus:outline-none cursor-pointer pr-1"
                    >
                      <option className="bg-surface-container-high text-on-surface" value="new">Newest Drops</option>
                      <option className="bg-surface-container-high text-on-surface" value="price">Price: Low to High</option>
                      <option className="bg-surface-container-high text-on-surface" value="rating">Top Rated</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Catalog Grid matching provided HTML */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {filteredItems.map(item => (
                <div key={item.id} className="group relative flex flex-col bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-md shadow-md hover:border-primary/40 hover:bg-surface-container transition-all duration-300">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-lowest flex items-center justify-center mb-space-md border border-outline-variant/20">
                    <img alt={item.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" src={item.img} />
                    <div className="absolute top-space-sm left-space-sm flex flex-col gap-1">
                      <span className="px-space-sm py-0.5 rounded bg-primary-container/90 text-on-primary-container text-label-sm font-label-sm font-semibold uppercase tracking-wider border border-primary/20">
                        {item.tag}
                      </span>
                      <span className="px-space-sm py-0.5 rounded bg-surface-container-lowest/80 text-on-surface-variant text-label-sm font-label-sm backdrop-blur-sm border border-outline-variant/20">
                        {item.subtag}
                      </span>
                    </div>
                    <button className="absolute top-space-sm right-space-sm p-1.5 rounded-lg bg-surface-container-lowest/70 backdrop-blur-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-lowest transition-all cursor-pointer" type="button">
                      <span className="material-symbols-outlined text-[18px]">favorite</span>
                    </button>
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-space-sm py-1 rounded bg-surface-container-lowest/90 backdrop-blur-md text-[11px] font-label-sm text-on-surface-variant border border-outline-variant/20">
                      <span className="flex items-center gap-1 text-primary">
                        <span className="material-symbols-outlined text-[14px]">bolt</span> {item.pill1}
                      </span>
                      <span>{item.pill2}</span>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 justify-between gap-space-md">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant/80">{item.specNode}</span>
                        <div className="flex items-center gap-1 text-primary">
                          <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="text-label-sm font-label-sm text-on-surface font-semibold">{item.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-headline-sm font-headline-sm text-on-surface font-normal group-hover:text-primary transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-body-sm font-body-sm text-on-surface-variant line-clamp-2 mt-1">
                        {item.desc}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-space-sm border-t border-outline-variant/20">
                      <div className="flex flex-col">
                        <span className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant/70">Unit Price</span>
                        <span className="text-headline-sm font-headline-sm text-primary font-medium tracking-tight">{formatPrice(item.price, currency)}</span>
                      </div>
                      <div className="flex items-center gap-space-xs">
                        <Link to="/flagship-detail" className="px-space-md py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-on-surface hover:text-primary hover:border-primary/40 font-label-sm text-label-sm uppercase tracking-wider transition-all">
                          Specs
                        </Link>
                        <button
                          onClick={() => handleAdd(item)}
                          className={`btn-shiny p-2 rounded-lg transition-all active:scale-95 cursor-pointer ${
                            addedId === item.id ? "bg-secondary-container text-on-secondary-container" : "bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary"
                          }`}
                          title="Add to Loadout"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {addedId === item.id ? "check" : "add_shopping_cart"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
