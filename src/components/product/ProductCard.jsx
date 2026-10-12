import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Star } from "lucide-react";
import { useCart } from "../../context/CartContext";

export function ProductCard({ product }) {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    return (
        <div className="product-card">
            <Link to={`/product/${product.id}`} className="product-image-container">
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-card-img"
                    loading="lazy"
                />
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
                <span className="product-card-botanical">{product.botanicalName}</span>

                <div className="product-card-meta">
                    <div className="product-price-group">
                        <span className="product-price-current">Rs. {product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                            <span className="product-price-original">
                                Rs. {product.originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>

                    <div className="rating-stars">
                        <Star size={14} fill="currentColor" />
                        <span>{product.rating}</span>
                        <span className="rating-count">({product.reviewsCount})</span>
                    </div>
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
