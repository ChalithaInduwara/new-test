import React from "react";
import { Link } from "react-router-dom";
import { Leaf, ArrowRight, Home, Compass } from "lucide-react";

function NotFound() {
    return (
        <div className="container">
            <div className="notfound-wrapper">
                <div className="notfound-art-circle">
                    <Compass size={48} />
                </div>

                <div className="notfound-code">404</div>
                <h1 className="notfound-title">This Leaf Has Wandered Off</h1>
                <p className="notfound-text">
                    We couldn't locate the page you were looking for. It may have been repotted,
                    renamed, or pruned from our botanical garden.
                </p>

                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "2.5rem" }}>
                    <Link to="/" className="btn btn-primary btn-lg">
                        <Home size={18} />
                        <span>Return Home</span>
                    </Link>
                    <Link to="/shop" className="btn btn-outline btn-lg">
                        <Compass size={18} />
                        <span>Browse Shop</span>
                    </Link>
                </div>

                <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1.5rem", display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
                    <span>Popular pages:</span>
                    <Link to="/shop?category=Bonsai" style={{ textDecoration: "underline", color: "var(--color-forest)" }}>Bonsai</Link>
                    <Link to="/shop?category=Cactus" style={{ textDecoration: "underline", color: "var(--color-forest)" }}>Cactus</Link>
                    <Link to="/shop?category=Succulents" style={{ textDecoration: "underline", color: "var(--color-forest)" }}>Succulents</Link>
                    <Link to="/shop?category=Flower Pots" style={{ textDecoration: "underline", color: "var(--color-forest)" }}>Ceramic Pots</Link>
                    <Link to="/contact" style={{ textDecoration: "underline", color: "var(--color-forest)" }}>Plant Care Help</Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
