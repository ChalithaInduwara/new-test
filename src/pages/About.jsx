import React from "react";
import { Link } from "react-router-dom";
import {
    Leaf,
    Sparkles,
    ShieldCheck,
    Heart,
    Truck,
    ArrowRight,
    Users
} from "lucide-react";

function About() {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <span className="badge badge-green" style={{ marginBottom: "1rem" }}>
                        Our Botanic Philosophy
                    </span>
                    <h1>Connecting Modern Spaces to Living Nature</h1>
                    <p>
                        We founded Leaf &amp; Clay with a simple conviction: bringing living greenery into our homes
                        and desks transforms stress into tranquility and elevates everyday design.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <div className="container">
                <div className="about-story-grid">
                    <div className="about-story-content">
                        <span className="section-tagline">Our Origins</span>
                        <h2 className="section-title">From A Passionate Nursery to Your Sanctuary</h2>
                        <p style={{ color: "var(--color-text-muted)", marginBottom: "1.25rem", lineHeight: 1.7 }}>
                            Leaf &amp; Clay started in 2021 as a weekend botanical experiment in Colombo. Too often,
                            plants bought from commercial greenhouses looked lush on day one, only to wither in a week
                            because they were forced under unnatural chemical fertilizers and potted in suffocating soil.
                        </p>
                        <p style={{ color: "var(--color-text-muted)", marginBottom: "1.75rem", lineHeight: 1.7 }}>
                            We set out to do things differently. Every single bonsai, succulent, and cactus in our nursery
                            is conditioned to adapt to authentic indoor ambient light. We formulate our own living soil blends
                            enriched with beneficial micro-fungi and organic compost, and collaborate directly with master
                            Sri Lankan ceramic potters to craft pots that allow roots to breathe freely.
                        </p>
                        <Link to="/shop" className="btn btn-primary">
                            <span>Browse Our Plants</span>
                            <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="about-story-img-frame">
                        <div className="about-placeholder-visual">
                            <Leaf size={56} strokeWidth={1.2} />
                            <span>Our Nursery Story</span>
                        </div>
                    </div>
                </div>

                {/* Values & Principles */}
                <div className="section-header" style={{ marginBottom: "2rem" }}>
                    <span className="section-tagline">What We Stand For</span>
                    <h2 className="section-title">Our Guiding Pillars</h2>
                    <p className="section-description">
                        Every leaf, branch, and glaze is treated with deep reverence for nature and craftsmanship.
                    </p>
                </div>

                <div className="values-grid">
                    <div className="value-card">
                        <div className="value-card-icon">
                            <Leaf size={28} />
                        </div>
                        <h3>Ethical Nursery Growing</h3>
                        <p>
                            We never use synthetic growth inhibitors or unnatural hormones. Plants grow at their own
                            harmonious pace so they remain hardy and resilient in your home.
                        </p>
                    </div>

                    <div className="value-card">
                        <div className="value-card-icon">
                            <Sparkles size={28} />
                        </div>
                        <h3>Hand-Thrown Earthware</h3>
                        <p>
                            Each ceramic planter is wheel-thrown by local potters using natural Sri Lankan stoneware,
                            finished in soothing neutral glazes with dedicated drainage holes.
                        </p>
                    </div>

                    <div className="value-card">
                        <div className="value-card-icon">
                            <Truck size={28} />
                        </div>
                        <h3>Zero-Plastic Packaging</h3>
                        <p>
                            Our proprietary shipping transit pods use compostable coconut coir, unbleached craft paper,
                            and biodegradable cellulose cushioning to protect fragile stems.
                        </p>
                    </div>

                    <div className="value-card">
                        <div className="value-card-icon">
                            <ShieldCheck size={28} />
                        </div>
                        <h3>14-Day Wellness Promise</h3>
                        <p>
                            Moving to a new home can be an adjustment for plants. If your greenery shows signs of distress
                            within 14 days, our team diagnoses and replaces it at zero cost.
                        </p>
                    </div>

                    <div className="value-card">
                        <div className="value-card-icon">
                            <Users size={28} />
                        </div>
                        <h3>Lifetime Plant Parent Care</h3>
                        <p>
                            Got questions about yellowing foliage, repotting, or winter sun? Our botanists are just a
                            message away on WhatsApp and email for as long as you have your plant.
                        </p>
                    </div>

                    <div className="value-card">
                        <div className="value-card-icon">
                            <Heart size={28} />
                        </div>
                        <h3>Support Local Artisans</h3>
                        <p>
                            100% of our pottery collection supports hereditary ceramic artisan families in traditional
                            pottery villages across Kelaniya and Kegalle.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
