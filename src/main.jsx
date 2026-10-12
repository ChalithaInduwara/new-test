import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { ThemeProvider } from "./context/ThemeContext";

import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/shop.css";
import "./styles/cart.css";
import "./styles/responsive.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <ThemeProvider>
                <ProductProvider>
                    <CartProvider>
                        <App />
                    </CartProvider>
                </ProductProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);