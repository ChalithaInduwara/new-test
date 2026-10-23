import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
    Mail,
    Phone,
    MapPin,
    MessageCircle,
    Send,
    ChevronDown,
    ChevronUp,
    Clock,
    ChevronRight,
    CheckCircle2
} from "lucide-react";

import { useStore } from "../context/StoreContext";

function Contact() {
    const { showToast } = useCart();
    const { createMessage, siteSettings } = useStore();

    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "care",
        message: ""
    });
    const [submitted, setSubmitted] = useState(false);

    // FAQ Accordion State
    const [openFaq, setOpenFaq] = useState(0);

    const faqs = [
        {
            q: "How do you package and ship living plants without damaging delicate leaves?",
            a: "We developed customized cylindrical transit pods that anchor the ceramic pot securely with breathable organic ties, while the upper foliage remains suspended in an air-cushioned protective shell. Soil is carefully sealed with moisture-retaining moss so not a single grain spills during delivery."
        },
        {
            q: "What happens if my plant arrives distressed or wilts after arrival?",
            a: "Every plant comes with our 14-Day Healthy Plant Guarantee. If your plant experiences transit shock or wilts within two weeks of delivery, simply take a quick photo and message us. We will guide you with recovery steps or send a healthy replacement free of charge."
        },
        {
            q: "Do your ceramic and terracotta flower pots feature drainage holes?",
            a: "Yes! Over 95% of indoor plant issues stem from root rot caused by stagnant water. All our decorative pots and planters come with precision-drilled central drainage holes and matching detachable ceramic drip saucers."
        },
        {
            q: "I'm a complete beginner. Which plants are the easiest to keep alive?",
            a: "We highly recommend starting with our Golden Barrel Cactus, Rosette Echeveria, or Variegated Snake Plant. These varieties thrive on minimal watering (once every 2-3 weeks) and adapt gracefully to varying indoor humidity and lighting conditions."
        },
        {
            q: "Can you provide bulk corporate gifting or custom ceramic branding?",
            a: "Absolutely! We collaborate with companies for curated green gifting, desk bonsai sets, and custom embossed ceramics. Please select 'Corporate Gifting' in our contact form or call our studio directly."
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        createMessage({
            name: form.name,
            email: form.email,
            subject: form.subject,
            message: form.message
        });
        setSubmitted(true);
        showToast("Message sent! Our botanists will reply within 24 hours. 🌿");
        setForm({ name: "", email: "", subject: "care", message: "" });
    };

    return (
        <div className="contact-page-layout">
            <div className="container">
                {/* Breadcrumbs */}
                <div className="breadcrumb-nav">
                    <Link to="/">Home</Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <span>Contact &amp; Plant Care</span>
                </div>

                <div className="section-header" style={{ textAlign: "left", marginBottom: "2.5rem" }}>
                    <span className="section-tagline">We're Here For You</span>
                    <h1 className="section-title" style={{ marginBottom: 0 }}>Plant Care &amp; Studio Inquiries</h1>
                </div>

                <div className="contact-grid">
                    {/* Contact Form */}
                    <div className="contact-form-card">
                        <h2 style={{ fontSize: "1.4rem", marginBottom: "1.25rem", color: "var(--color-forest)" }}>
                            Send Our Botanists a Message
                        </h2>

                        {submitted ? (
                            <div style={{ textAlign: "center", padding: "2rem 0" }}>
                                <CheckCircle2 size={48} style={{ color: "#257a46", marginBottom: "1rem" }} />
                                <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>Message Dispatched!</h3>
                                <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
                                    Thank you for reaching out. A botanical specialist will review your inquiry and reply via email shortly.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="btn btn-primary"
                                >
                                    Send Another Note
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="contact-name">Your Full Name</label>
                                    <input
                                        type="text"
                                        id="contact-name"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="e.g. Kasun Fernando"
                                        className="form-control"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="contact-email">Email Address</label>
                                    <input
                                        type="email"
                                        id="contact-email"
                                        required
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder="kasun@example.com"
                                        className="form-control"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="contact-subject">Topic / Nature of Inquiry</label>
                                    <select
                                        id="contact-subject"
                                        value={form.subject}
                                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                        className="form-control"
                                    >
                                        <option value="care">Plant Care Diagnosis &amp; Watering Advice</option>
                                        <option value="order">Order Tracking &amp; Delivery Status</option>
                                        <option value="pottery">Custom Ceramics &amp; Pottery Orders</option>
                                        <option value="corporate">Corporate Gifts &amp; Bulk Orders</option>
                                        <option value="general">General Inquiries</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="contact-msg">Your Message</label>
                                    <textarea
                                        id="contact-msg"
                                        required
                                        rows="4"
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        placeholder="Tell us about your room lighting, watering routine, or question..."
                                        className="form-control"
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary btn-block btn-lg">
                                    <Send size={18} />
                                    <span>Dispatch Message</span>
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Studio Information & Hours */}
                    <div className="contact-info-column">
                        <div className="contact-info-card">
                            <h3 style={{ fontSize: "1.2rem", marginBottom: "1.25rem", color: "var(--color-forest)" }}>
                                Botanical Studio &amp; Nursery
                            </h3>

                            <div className="footer-contact-items" style={{ color: "var(--color-text-main)", marginBottom: "1.5rem" }}>
                                {siteSettings?.storeAddress ? (
                                    <div className="contact-item">
                                        <MapPin size={20} style={{ color: "var(--color-sage)" }} />
                                        <span>{siteSettings.storeAddress}</span>
                                    </div>
                                ) : null}
                                {siteSettings?.storePhone ? (
                                    <div className="contact-item">
                                        <Phone size={20} style={{ color: "var(--color-sage)" }} />
                                        <span>{siteSettings.storePhone}</span>
                                    </div>
                                ) : null}
                                {siteSettings?.storeEmail ? (
                                    <div className="contact-item">
                                        <Mail size={20} style={{ color: "var(--color-sage)" }} />
                                        <span>{siteSettings.storeEmail}</span>
                                    </div>
                                ) : null}
                                {!siteSettings?.storeAddress && !siteSettings?.storePhone && !siteSettings?.storeEmail && (
                                    <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                                        Send us a direct message using the form to reach our store botanists.
                                    </p>
                                )}
                            </div>

                            <h4 style={{ fontSize: "1rem", marginBottom: "0.75rem", color: "var(--color-forest)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <Clock size={16} />
                                <span>Studio &amp; Greenhouse Visiting Hours</span>
                            </h4>

                            <div className="studio-hours-row">
                                <span>Monday – Friday</span>
                                <strong>9:00 AM – 6:30 PM</strong>
                            </div>
                            <div className="studio-hours-row">
                                <span>Saturday</span>
                                <strong>9:30 AM – 7:00 PM</strong>
                            </div>
                            <div className="studio-hours-row" style={{ borderBottom: "none" }}>
                                <span>Sunday &amp; Poya Days</span>
                                <strong>10:00 AM – 4:00 PM</strong>
                            </div>
                        </div>

                        {/* Quick Tip Box */}
                        <div className="botanical-guarantee-box">
                            <div style={{ fontWeight: 700, color: "var(--color-forest)", marginBottom: "0.2rem" }}>
                                💡 Plant Emergency Tip:
                            </div>
                            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                                When in doubt, underwater rather than overwater! Over 80% of houseplant troubles
                                are caused by watering while the lower root substrate is still saturated. Feel the soil first.
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQ Accordion Section */}
                <div className="faq-accordion-group">
                    <div className="section-header" style={{ marginBottom: "1.5rem" }}>
                        <span className="section-tagline">Frequently Asked Questions</span>
                        <h2 className="section-title">Common Plant Parent Queries</h2>
                    </div>

                    {faqs.map((faq, index) => {
                        const isOpen = openFaq === index;
                        return (
                            <div key={index} className="faq-card">
                                <button
                                    onClick={() => setOpenFaq(isOpen ? null : index)}
                                    className="faq-question-btn"
                                >
                                    <span>{faq.q}</span>
                                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                                {isOpen && <div className="faq-answer-body">{faq.a}</div>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Contact;
