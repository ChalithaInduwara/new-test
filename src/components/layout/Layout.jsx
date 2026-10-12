import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Toast from "../common/Toast";

function Layout() {
    const { pathname } = useLocation();

    // Auto-scroll to top on route change
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname]);

    return (
        <div className="app-shell">
            <Navbar />
            <main className="main-viewport">
                <Outlet />
            </main>
            <Footer />
            <Toast />
        </div>
    );
}

export default Layout;
