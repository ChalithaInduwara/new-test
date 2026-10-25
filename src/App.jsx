import { Routes, Route } from "react-router-dom";
import DarkModeBackground from "./components/common/DarkModeBackground";

import Layout from "./components/layout/Layout";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Account from "./pages/Account";

function App() {
    return (
        <>
            <DarkModeBackground />
            <Routes>
            {/* Storefront Layout */}
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:id" element={<Product />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="contact" element={<Contact />} />
                <Route path="about" element={<About />} />
                <Route path="login" element={<Auth />} />
                <Route path="signup" element={<Auth />} />
                <Route path="account" element={<Account />} />
                <Route path="*" element={<NotFound />} />
            </Route>

            {/* Dedicated Admin Panel Workspace (Locked behind Admin Username & Password) */}
            <Route path="/admin" element={<Admin />} />
        </Routes>
        </>
    );
}

export default App;