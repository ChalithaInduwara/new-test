import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { PRODUCTS, CATEGORIES } from "../data/products";

const ProductContext = createContext();

const STORAGE_KEYS = {
    PRODUCTS: "leaf_clay_products_v1",
    CATEGORIES: "leaf_clay_categories_v1"
};

export function ProductProvider({ children }) {
    // -------------------------------------------------------------------------
    // Persistent Products State
    // -------------------------------------------------------------------------
    const [products, setProducts] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
            return saved ? JSON.parse(saved) : PRODUCTS;
        } catch (e) {
            console.error("Failed to parse products from localStorage", e);
            return PRODUCTS;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        } catch (e) {
            console.error("Failed to save products to localStorage", e);
        }
    }, [products]);

    // -------------------------------------------------------------------------
    // Persistent Categories State
    // -------------------------------------------------------------------------
    const [rawCategories, setRawCategories] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
            return saved ? JSON.parse(saved) : CATEGORIES;
        } catch (e) {
            console.error("Failed to parse categories from localStorage", e);
            return CATEGORIES;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(rawCategories));
        } catch (e) {
            console.error("Failed to save categories to localStorage", e);
        }
    }, [rawCategories]);

    // Compute live product counts per category
    const categories = useMemo(() => {
        return rawCategories.map((cat) => {
            if (cat.id === "all") {
                return { ...cat, count: products.length };
            }
            const count = products.filter(
                (p) => p.category?.toLowerCase() === cat.name?.toLowerCase() || p.category === cat.id
            ).length;
            return { ...cat, count };
        });
    }, [rawCategories, products]);

    // -------------------------------------------------------------------------
    // Filter & Browse State
    // -------------------------------------------------------------------------
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("featured");
    const [priceRange, setPriceRange] = useState(6000);
    const [filterDifficulty, setFilterDifficulty] = useState("all");
    const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);

    const getProductById = (id) => {
        return products.find((p) => String(p.id) === String(id));
    };

    const resetFilters = () => {
        setSelectedCategory("all");
        setSearchQuery("");
        setSortBy("featured");
        setPriceRange(6000);
        setFilterDifficulty("all");
        setPetFriendlyOnly(false);
    };

    // =========================================================================
    // PRODUCTS CRUD
    // =========================================================================
    const addProduct = (productData) => {
        const id =
            productData.id ||
            productData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "") + `-${Date.now().toString().slice(-4)}`;

        const newProduct = {
            id,
            name: productData.name || "Untitled Botanical",
            botanicalName: productData.botanicalName || "Specimen botanical",
            category: productData.category || "Succulents",
            price: Number(productData.price) || 990,
            originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
            rating: Number(productData.rating) || 5.0,
            reviewsCount: Number(productData.reviewsCount) || 1,
            inStock: productData.inStock !== false,
            stockCount: Number(productData.stockCount) || 10,
            badge: productData.badge || "",
            image:
                productData.image ||
                "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=80",
            gallery: productData.gallery?.length
                ? productData.gallery
                : [
                      productData.image ||
                          "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=80"
                  ],
            shortDescription: productData.shortDescription || "",
            description: productData.description || "",
            care: {
                light: productData.care?.light || "Bright indirect sunlight",
                water: productData.care?.water || "Water when topsoil feels dry",
                humidity: productData.care?.humidity || "Moderate (40-60%)",
                difficulty: productData.care?.difficulty || "Easy",
                petFriendly: Boolean(productData.care?.petFriendly),
                potSize: productData.care?.potSize || "14 cm Glazed Stoneware",
                height: productData.care?.height || "20 - 30 cm"
            }
        };

        setProducts((prev) => [newProduct, ...prev]);
        return newProduct;
    };

    const updateProduct = (id, updatedFields) => {
        setProducts((prev) =>
            prev.map((item) => {
                if (String(item.id) === String(id)) {
                    return {
                        ...item,
                        ...updatedFields,
                        price: updatedFields.price !== undefined ? Number(updatedFields.price) : item.price,
                        originalPrice:
                            updatedFields.originalPrice !== undefined
                                ? Number(updatedFields.originalPrice)
                                : item.originalPrice,
                        stockCount:
                            updatedFields.stockCount !== undefined
                                ? Number(updatedFields.stockCount)
                                : item.stockCount,
                        inStock:
                            updatedFields.inStock !== undefined
                                ? Boolean(updatedFields.inStock)
                                : item.stockCount > 0,
                        care: {
                            ...item.care,
                            ...(updatedFields.care || {})
                        }
                    };
                }
                return item;
            })
        );
    };

    const deleteProduct = (id) => {
        setProducts((prev) => prev.filter((item) => String(item.id) !== String(id)));
    };

    const adjustProductStock = (id, delta) => {
        setProducts((prev) =>
            prev.map((item) => {
                if (String(item.id) === String(id)) {
                    const newCount = Math.max(0, (item.stockCount || 0) + delta);
                    return {
                        ...item,
                        stockCount: newCount,
                        inStock: newCount > 0
                    };
                }
                return item;
            })
        );
    };

    // =========================================================================
    // CATEGORIES CRUD
    // =========================================================================
    const addCategory = (categoryData) => {
        const id =
            categoryData.id ||
            categoryData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");

        const newCategory = {
            id,
            name: categoryData.name,
            description: categoryData.description || "",
            icon: categoryData.icon || "Sparkles"
        };

        setRawCategories((prev) => [...prev, newCategory]);
        return newCategory;
    };

    const updateCategory = (id, updatedFields) => {
        setRawCategories((prev) =>
            prev.map((cat) => (cat.id === id ? { ...cat, ...updatedFields } : cat))
        );
    };

    const deleteCategory = (id) => {
        if (id === "all") return false; // Prevent deleting All Items
        setRawCategories((prev) => prev.filter((cat) => cat.id !== id));
        return true;
    };

    const resetProductsAndCategories = () => {
        localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
        localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
        setProducts(PRODUCTS);
        setRawCategories(CATEGORIES);
    };

    // -------------------------------------------------------------------------
    // Filtered Products Memo
    // -------------------------------------------------------------------------
    const filteredProducts = useMemo(() => {
        return products
            .filter((item) => {
                const matchesCategory =
                    selectedCategory === "all" ||
                    item.category?.toLowerCase() === selectedCategory.toLowerCase();

                const matchesSearch =
                    searchQuery.trim() === "" ||
                    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.botanicalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());

                const matchesPrice = item.price <= priceRange;

                const matchesDifficulty =
                    filterDifficulty === "all" ||
                    item.care?.difficulty?.toLowerCase() === filterDifficulty.toLowerCase();

                const matchesPetFriendly = !petFriendlyOnly || item.care?.petFriendly;

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
                categories,
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
                resetFilters,

                // CRUD
                addProduct,
                updateProduct,
                deleteProduct,
                adjustProductStock,
                addCategory,
                updateCategory,
                deleteCategory,
                resetProductsAndCategories
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
