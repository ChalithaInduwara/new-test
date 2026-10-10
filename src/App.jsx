import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Navbar from "./componnnents/layout/Navbar";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";



function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />

                <Route path="shop" element={<Shop />} />

                <Route path="product/:id" element={<Product />} />

                <Route path="cart" element={<Cart />} />

                <Route path="checkout" element={<Checkout />} />

                <Route path="contact" element={<Contact />} />

                <Route path="about" element={<About />} />

                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;