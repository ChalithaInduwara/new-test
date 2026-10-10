import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";

import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/shop.css";
import "./styles/cart.css";
import "./styles/responsive.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <ProductProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </ProductProvider>
        </BrowserRouter>
    </React.StrictMode>
);