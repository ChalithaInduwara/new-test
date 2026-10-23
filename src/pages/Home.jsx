import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/product/ProductCard";
import {
    Trees,
    Sun,
    Flower2,
    Archive,
    ArrowRight,
    Sparkles,
    CheckCircle,
    Shield,
    Leaf,
    Heart
} from "lucide-react";

import { useStore } from "../context/StoreContext";

function Home() {
    const { products, setSelectedCategory } = useProducts();
    const { siteSettings } = useStore();
    const navigate = useNavigate();

    // Featured items
    const featuredProducts = products.slice(0, 4);

    const handleCategoryClick = (categoryName) => {
        setSelectedCategory(categoryName);
        navigate("/shop");
    };

    return (
        <div className="home-page">
            {/* HERO BANNER SECTION */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-grid">
                        <div className="hero-content">
                            <div className="hero-pill-badge">
                                <Sparkles size={14} />
                                <span>{siteSettings?.heroBadge || "Spring Nursery Release • 2026 Collection"}</span>
                            </div>

                            <h1 className="hero-title" style={{ marginBottom: "2rem" }}>
                                {siteSettings?.heroTitle || "Living Art for Mindful Spaces."}
                            </h1>

                            <div className="hero-cta-group">
                                <Link to="/shop" className="btn btn-primary btn-lg">
                                    <span>Explore Catalog</span>
                                    <ArrowRight size={18} />
                                </Link>
                                <button
                                    onClick={() => handleCategoryClick("Flower Pots")}
                                    className="btn btn-outline btn-lg"
                                >
                                    <span>Artisan Pots</span>
                                </button>
                            </div>

                            <div className="hero-stats-row">
                                <div className="hero-stat-item">
                                    <span className="stat-number">100%</span>
                                    <span className="stat-label">Live Arrival Guarantee</span>
                                </div>
                                <div className="hero-stat-item">
                                    <span className="stat-number">Organic</span>
                                    <span className="stat-label">Living Potting Blend</span>
                                </div>
                                <div className="hero-stat-item">
                                    <span className="stat-number">Handmade</span>
                                    <span className="stat-label">Artisan Earthware</span>
                                </div>
                            </div>
                        </div>

                        <div className="hero-media-wrapper">
                            <div className="hero-main-card">
                                <div className="hero-placeholder-visual">
                                    <Leaf size={64} strokeWidth={1.2} />
                                    <span>Your Botanical Collection</span>
                                </div>
                            </div>
                            <div className="hero-floating-badge">
                                <div className="badge-icon-plant">
                                    <Leaf size={20} />
                                </div>
                                <div>
                                    <div className="badge-text-title">Bespoke Transit Pods</div>
                                    <div className="badge-text-sub">Zero soil spillage guarantee</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CURATED CATEGORIES SECTION */}
            <section className="section-wrapper">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tagline">Botanical Collections</span>
                        <h2 className="section-title" style={{ marginBottom: 0 }}>Explore by Specimen Type</h2>
                    </div>

                    <div className="categories-grid">
                        <div
                            className="category-card"
                            onClick={() => handleCategoryClick("Bonsai")}
                        >
                            <div className="category-icon-wrapper">
                                <Trees size={32} />
                            </div>
                            <h3 className="category-name">Sculptural Bonsai</h3>
                            <p className="category-desc">
                                Ancient living sculptures wired with Japanese patience and care.
                            </p>
                        </div>

                        <div
                            className="category-card"
                            onClick={() => handleCategoryClick("Cactus")}
                        >
                            <div className="category-icon-wrapper">
                                <Sun size={32} />
                            </div>
                            <h3 className="category-name">Desert Cacti</h3>
                            <p className="category-desc">
                                Architectural, geometric specimens requiring minimal watering.
                            </p>
                        </div>

                        <div
                            className="category-card"
                            onClick={() => handleCategoryClick("Succulents")}
                        >
                            <div className="category-icon-wrapper">
                                <Flower2 size={32} />
                            </div>
                            <h3 className="category-name">Plump Succulents</h3>
                            <p className="category-desc">
                                Fleshy rosettes and trailing emerald strands with pastel blushes.
                            </p>
                        </div>

                        <div
                            className="category-card"
                            onClick={() => handleCategoryClick("Flower Pots")}
                        >
                            <div className="category-icon-wrapper">
                                <Archive size={32} />
                            </div>
                            <h3 className="category-name">Ceramic Pots</h3>
                            <p className="category-desc">
                                Hand-thrown stoneware, porous terracotta, and glazed planters with drainage.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section className="section-wrapper" style={{ background: "var(--color-cream)" }}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-tagline">Curator's Highlights</span>
                        <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Flora &amp; Pottery</h2>
                    </div>

                    {featuredProducts.length > 0 ? (
                        <>
                            <div className="products-grid">
                                {featuredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
                                <Link to="/shop" className="btn btn-outline btn-lg">
                                    <span>View Full Collection ({products.length} Items)</span>
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="empty-catalog-state" style={{ padding: "3rem 1.5rem" }}>
                            <Sparkles size={44} style={{ color: "var(--color-sage)", marginBottom: "1rem" }} />
                            <h3 className="empty-catalog-title">No products added yet</h3>
                            <p className="empty-catalog-text">
                                Add your first products through the admin panel to see them featured here.
                            </p>
                            <Link to="/shop" className="btn btn-primary">
                                <span>Visit Shop</span>
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* WHY CHOOSE US / VALUES */}
            <section className="section-wrapper">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tagline">The Leaf &amp; Clay Difference</span>
                        <h2 className="section-title" style={{ marginBottom: 0 }}>Plants Grown for Longevity</h2>
                    </div>

                    <div className="values-grid" style={{ paddingBottom: 0 }}>
                        <div className="value-card">
                            <div className="value-card-icon">
                                <Shield size={28} />
                            </div>
                            <h3>14-Day Wellness Warranty</h3>
                            <p>
                                If your specimen arrives wilted or doesn't adjust to your room within 14 days,
                                our botanists replace it free of charge.
                            </p>
                        </div>

                        <div className="value-card">
                            <div className="value-card-icon">
                                <CheckCircle size={28} />
                            </div>
                            <h3>Biological Potting Blend</h3>
                            <p>
                                Potted with aerated pine bark, perlite, and worm humus—optimizing oxygen
                                circulation to prevent root rot.
                            </p>
                        </div>

                        <div className="value-card">
                            <div className="value-card-icon">
                                <Heart size={28} />
                            </div>
                            <h3>Artisanal Earthware</h3>
                            <p>
                                Crafted by master Sri Lankan potters. Breathable clay walls maintain ideal root
                                moisture without soggy bottoms.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;