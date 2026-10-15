import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Star, Leaf } from "lucide-react";
import { useCart } from "../../context/CartContext";

export function ProductCard({ product }) {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    const price = Number(product.price) || 0;
    const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;

    return (
        <div className="product-card">
            <Link to={`/product/${product.id}`} className="product-image-container">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-card-img"
                        loading="lazy"
                    />
                ) : (
                    <div className="product-card-placeholder-fallback">
                        <Leaf size={44} strokeWidth={1.2} />
                        <span>Botanical Specimen</span>
                    </div>
                )}
                {product.badge && (
                    <div className="product-badge-overlay">
                        <span className="badge badge-green">{product.badge}</span>
                    </div>
                )}
            </Link>

            <div className="product-card-content">
                <span className="product-card-category">{product.category}</span>
                <Link to={`/product/${product.id}`}>
                    <h3 className="product-card-title">{product.name}</h3>
                </Link>
                {product.botanicalName && (
                    <span className="product-card-botanical">{product.botanicalName}</span>
                )}

                <div className="product-card-meta">
                    <div className="product-price-group">
                        <span className="product-price-current">Rs. {price.toLocaleString()}</span>
                        {originalPrice && (
                            <span className="product-price-original">
                                Rs. {originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {product.rating ? (
                        <div className="rating-stars">
                            <Star size={14} fill="currentColor" />
                            <span>{product.rating}</span>
                            {product.reviewsCount > 0 && (
                                <span className="rating-count">({product.reviewsCount})</span>
                            )}
                        </div>
                    ) : null}
                </div>

                <div className="product-card-footer">
                    <button
                        onClick={handleAddToCart}
                        className="product-add-btn"
                        aria-label={`Add ${product.name} to cart`}
                    >
                        <ShoppingBag size={15} />
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
