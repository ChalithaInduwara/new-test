import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/product/ProductCard";
import {
    Star,
    Sun,
    Droplets,
    Wind,
    ShieldCheck,
    Truck,
    ShoppingBag,
    ArrowRight,
    ChevronRight,
    HeartHandshake,
    Sparkles,
    Check
} from "lucide-react";

function Product() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProductById, products } = useProducts();
    const { addToCart } = useCart();

    const product = getProductById(id);

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);

    if (!product) {
        return (
            <div className="container" style={{ padding: "5rem 1.5rem", textAlign: "center" }}>
                <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Product Not Found</h2>
                <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>
                    The botanical specimen you're searching for is unavailable or may have been renamed.
                </p>
                <Link to="/shop" className="btn btn-primary">
                    Return to Catalog
                </Link>
            </div>
        );
    }

    const gallery = product.gallery || [product.image];
    const relatedProducts = products
        .filter((p) => p.id !== product.id && (p.category === product.category || Math.random() > 0.5))
        .slice(0, 4);

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    const handleBuyNow = () => {
        addToCart(product, quantity);
        navigate("/checkout");
    };

    const discountPercentage = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;

    return (
        <div className="product-detail-layout">
            <div className="container">
                {/* Breadcrumbs */}
                <div className="breadcrumb-nav">
                    <Link to="/">Home</Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <Link to="/shop">Shop</Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <Link to={`/shop?category=${product.category}`}>{product.category}</Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <span>{product.name}</span>
                </div>

                <div className="product-detail-grid">
                    {/* Media Gallery */}
                    <div className="product-gallery-section">
                        <div className="gallery-main-frame">
                            <img
                                src={gallery[selectedImageIndex] || product.image}
                                alt={product.name}
                            />
                        </div>

                        {gallery.length > 1 && (
                            <div className="gallery-thumbnails-row">
                                {gallery.map((imgUrl, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`gallery-thumb-btn ${selectedImageIndex === index ? "active" : ""}`}
                                    >
                                        <img src={imgUrl} alt={`${product.name} view ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details & Actions */}
                    <div className="product-info-column">
                        <div className="detail-badge-row">
                            <span className="badge badge-green">{product.category}</span>
                            {product.badge && <span className="badge badge-terracotta">{product.badge}</span>}
                            {product.inStock && (
                                <span className="badge" style={{ background: "#e8f7ee", color: "#257a46" }}>
                                    <Check size={12} style={{ display: "inline" }} /> In Stock ({product.stockCount} left)
                                </span>
                            )}
                        </div>

                        <h1 className="detail-title">{product.name}</h1>
                        <p className="detail-botanical">{product.botanicalName}</p>

                        <div className="detail-rating-row">
                            <div className="rating-stars">
                                <Star size={16} fill="currentColor" />
                                <strong style={{ marginLeft: "4px" }}>{product.rating}</strong>
                            </div>
                            <span className="rating-count">
                                ({product.reviewsCount} verified plant parent reviews)
                            </span>
                        </div>

                        <div className="detail-price-box">
                            <span className="detail-price-main">Rs. {product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                                <span className="detail-price-old">
                                    Rs. {product.originalPrice.toLocaleString()}
                                </span>
                            )}
                            {discountPercentage && (
                                <span className="detail-save-pill">Save {discountPercentage}%</span>
                            )}
                        </div>

                        <p className="detail-description">{product.description}</p>

                        {/* Botanical Care Specs */}
                        <div className="care-cards-grid">
                            <div className="care-card-item">
                                <div className="care-card-icon">
                                    <Sun size={18} />
                                </div>
                                <div>
                                    <div className="care-card-label">Light Requirement</div>
                                    <div className="care-card-value">{product.care.light}</div>
                                </div>
                            </div>

                            <div className="care-card-item">
                                <div className="care-card-icon">
                                    <Droplets size={18} />
                                </div>
                                <div>
                                    <div className="care-card-label">Watering</div>
                                    <div className="care-card-value">{product.care.water}</div>
                                </div>
                            </div>

                            <div className="care-card-item">
                                <div className="care-card-icon">
                                    <Wind size={18} />
                                </div>
                                <div>
                                    <div className="care-card-label">Humidity</div>
                                    <div className="care-card-value">{product.care.humidity}</div>
                                </div>
                            </div>

                            <div className="care-card-item">
                                <div className="care-card-icon">
                                    <Sparkles size={18} />
                                </div>
                                <div>
                                    <div className="care-card-label">Difficulty &amp; Pets</div>
                                    <div className="care-card-value">
                                        {product.care.difficulty} • {product.care.petFriendly ? "Pet-Friendly" : "Keep from pets"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quantity Stepper & Buttons */}
                        <div className="purchase-controls-row">
                            <div className="quantity-stepper">
                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="stepper-btn"
                                    aria-label="Decrease quantity"
                                >
                                    -
                                </button>
                                <span className="stepper-count">{quantity}</span>
                                <button
                                    onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                                    className="stepper-btn"
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="btn btn-primary btn-add-cart-detail"
                            >
                                <ShoppingBag size={18} />
                                <span>Add To Cart</span>
                            </button>

                            <button
                                onClick={handleBuyNow}
                                className="btn btn-terracotta"
                            >
                                <span>Buy Now</span>
                                <ArrowRight size={18} />
                            </button>
                        </div>

                        {/* Guarantee Features */}
                        <div className="botanical-guarantee-box">
                            <div className="guarantee-point">
                                <ShieldCheck size={18} />
                                <span><strong>14-Day Healthy Plant Guarantee:</strong> Free replacement if plant does not thrive.</span>
                            </div>
                            <div className="guarantee-point">
                                <Truck size={18} />
                                <span><strong>Protective Packaging:</strong> Secure botanical transit pod prevents leaf breakage.</span>
                            </div>
                            <div className="guarantee-point">
                                <HeartHandshake size={18} />
                                <span><strong>Includes Care Sheet:</strong> Detailed personalized care schedule in the box.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="related-products-section">
                        <div className="section-header" style={{ textAlign: "left", marginBottom: "2rem" }}>
                            <span className="section-tagline">Pairings &amp; Companions</span>
                            <h2 className="section-title">You Might Also Love</h2>
                        </div>

                        <div className="products-grid">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

export default Product;
