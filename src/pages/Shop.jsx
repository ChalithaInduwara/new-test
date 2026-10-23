import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/product/ProductCard";
import { SlidersHorizontal, RotateCcw, Frown, ChevronRight, Filter, X, Sparkles } from "lucide-react";

function Shop() {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const {
        products,
        categories,
        filteredProducts,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        priceRange,
        setPriceRange,
        filterDifficulty,
        setFilterDifficulty,
        petFriendlyOnly,
        setPetFriendlyOnly,
        resetFilters,
        searchQuery
    } = useProducts();

    return (
        <div className="shop-page">
            {/* Header Banner */}
            <div className="shop-page-header">
                <div className="container">
                    <div className="breadcrumb-nav">
                        <Link to="/">Home</Link>
                        <ChevronRight size={14} className="breadcrumb-separator" />
                        <span>Catalog</span>
                        {selectedCategory !== "all" && (
                            <>
                                <ChevronRight size={14} className="breadcrumb-separator" />
                                <span>{selectedCategory}</span>
                            </>
                        )}
                    </div>

                    <div className="shop-header-content">
                        <h1 className="section-title" style={{ marginBottom: 0 }}>
                            {selectedCategory === "all"
                                ? "Botanical Nursery & Pottery"
                                : `${selectedCategory} Collection`}
                        </h1>
                        {searchQuery && (
                            <p className="section-description" style={{ marginTop: "0.5rem" }}>
                                Showing results matching "{searchQuery}"
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Catalog Section */}
            <div className="container">
                <div className="shop-main-layout">
                    {/* Filters Sidebar */}
                    <aside className={`shop-filters-sidebar ${mobileFiltersOpen ? "mobile-filters-expanded" : ""}`}>
                        <div className="filters-header">
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <SlidersHorizontal size={18} />
                                <h3>Filter Plants</h3>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <button
                                    onClick={resetFilters}
                                    className="filter-reset-btn"
                                    title="Reset all filters"
                                >
                                    <RotateCcw size={13} style={{ display: "inline", marginRight: "3px" }} />
                                    Reset
                                </button>
                                <button
                                    className="mobile-filters-close-btn"
                                    onClick={() => setMobileFiltersOpen(false)}
                                    aria-label="Close filters"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="filter-group">
                            <span className="filter-title">Category</span>
                            <div className="category-pills-list">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        className={`category-pill-btn ${selectedCategory === cat.id ? "active" : ""}`}
                                        onClick={() => setSelectedCategory(cat.id)}
                                    >
                                        <span>{cat.name}</span>
                                        <span className="filter-count-tag">({cat.count})</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div className="filter-group">
                            <span className="filter-title">Max Price (Rs. {priceRange.toLocaleString()})</span>
                            <input
                                type="range"
                                min="900"
                                max="4000"
                                step="100"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="price-range-slider"
                            />
                            <div className="price-labels">
                                <span>Rs. 900</span>
                                <span>Rs. 4,000+</span>
                            </div>
                        </div>

                        {/* Care Difficulty */}
                        <div className="filter-group">
                            <span className="filter-title">Care Difficulty</span>
                            <div className="category-pills-list">
                                <button
                                    className={`category-pill-btn ${filterDifficulty === "all" ? "active" : ""}`}
                                    onClick={() => setFilterDifficulty("all")}
                                >
                                    <span>All Difficulties</span>
                                </button>
                                <button
                                    className={`category-pill-btn ${filterDifficulty === "Easy" ? "active" : ""}`}
                                    onClick={() => setFilterDifficulty("Easy")}
                                >
                                    <span>Easy (Beginner Friendly)</span>
                                </button>
                                <button
                                    className={`category-pill-btn ${filterDifficulty === "Moderate" ? "active" : ""}`}
                                    onClick={() => setFilterDifficulty("Moderate")}
                                >
                                    <span>Moderate</span>
                                </button>
                            </div>
                        </div>

                        {/* Pet Friendly */}
                        <div className="filter-group" style={{ marginBottom: 0 }}>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={petFriendlyOnly}
                                    onChange={(e) => setPetFriendlyOnly(e.target.checked)}
                                />
                                <span>Pet-Friendly Non-Toxic Only</span>
                            </label>
                        </div>
                    </aside>

                    {/* Catalog Content Area */}
                    <main className="shop-content-area">
                        {/* Toolbar: Sorting & Count */}
                        <div className="shop-toolbar">
                            <div className="shop-toolbar-left">
                                <button
                                    className="mobile-filter-trigger-btn"
                                    onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                                    aria-label="Toggle filters"
                                >
                                    <Filter size={16} />
                                    <span>Filters</span>
                                    {selectedCategory !== "all" && <span className="active-dot">•</span>}
                                </button>
                                <span className="shop-results-count">
                                    Showing <strong>{filteredProducts.length}</strong> items
                                </span>
                            </div>

                            <div className="shop-sort-control">
                                <label htmlFor="shop-sort">Sort by:</label>
                                <select
                                    id="shop-sort"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="shop-sort-select"
                                >
                                    <option value="featured">Featured Curations</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="reviews">Most Popular</option>
                                </select>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="products-grid">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="empty-catalog-state">
                                <Sparkles size={50} className="empty-catalog-icon" style={{ color: "var(--color-sage)" }} />
                                <h3 className="empty-catalog-title">No products in the catalog yet</h3>
                                <p className="empty-catalog-text">
                                    The store is fresh and ready for inventory. Products added via the admin panel will display here.
                                </p>
                            </div>
                        ) : (
                            <div className="empty-catalog-state">
                                <Frown size={50} className="empty-catalog-icon" />
                                <h3 className="empty-catalog-title">No plants match your active filters</h3>
                                <p className="empty-catalog-text">
                                    Try expanding your price range, clearing the search query, or selecting another category.
                                </p>
                                <button onClick={resetFilters} className="btn btn-primary">
                                    Reset All Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Shop;
