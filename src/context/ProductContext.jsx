import React, { createContext, useContext, useState, useMemo } from "react";
import { PRODUCTS, CATEGORIES } from "../data/products";

const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products] = useState(PRODUCTS);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("featured");
    const [priceRange, setPriceRange] = useState(4000);
    const [filterDifficulty, setFilterDifficulty] = useState("all");
    const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);

    const getProductById = (id) => {
        return products.find((p) => p.id === id);
    };

    const resetFilters = () => {
        setSelectedCategory("all");
        setSearchQuery("");
        setSortBy("featured");
        setPriceRange(4000);
        setFilterDifficulty("all");
        setPetFriendlyOnly(false);
    };

    const filteredProducts = useMemo(() => {
        return products
            .filter((item) => {
                const matchesCategory =
                    selectedCategory === "all" || item.category === selectedCategory;

                const matchesSearch =
                    searchQuery.trim() === "" ||
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.botanicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

                const matchesPrice = item.price <= priceRange;

                const matchesDifficulty =
                    filterDifficulty === "all" ||
                    item.care.difficulty.toLowerCase() === filterDifficulty.toLowerCase();

                const matchesPetFriendly = !petFriendlyOnly || item.care.petFriendly;

                return (
                    matchesCategory &&
                    matchesSearch &&
                    matchesPrice &&
                    matchesDifficulty &&
                    matchesPetFriendly
                );
            })
            .sort((a, b) => {
                if (sortBy === "price-asc") return a.price - b.price;
                if (sortBy === "price-desc") return b.price - a.price;
                if (sortBy === "rating") return b.rating - a.rating;
                if (sortBy === "reviews") return b.reviewsCount - a.reviewsCount;
                return 0; // 'featured' keeps curated order
            });
    }, [
        products,
        selectedCategory,
        searchQuery,
        sortBy,
        priceRange,
        filterDifficulty,
        petFriendlyOnly
    ]);

    return (
        <ProductContext.Provider
            value={{
                products,
                categories: CATEGORIES,
                filteredProducts,
                selectedCategory,
                setSelectedCategory,
                searchQuery,
                setSearchQuery,
                sortBy,
                setSortBy,
                priceRange,
                setPriceRange,
                filterDifficulty,
                setFilterDifficulty,
                petFriendlyOnly,
                setPetFriendlyOnly,
                getProductById,
                resetFilters
            }}
        >
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProducts must be used within a ProductProvider");
    }
    return context;
}
