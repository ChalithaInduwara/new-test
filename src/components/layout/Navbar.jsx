import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav>
            <h2>Plant Store</h2>

            <div>
                <Link to="/">Home</Link>
                {" | "}
                <Link to="/shop">Shop</Link>
                {" | "}
                <Link to="/cart">Cart</Link>
                {" | "}
                <Link to="/checkout">Checkout</Link>
                {" | "}
                <Link to="/contact">Contact</Link>
                {" | "}
                <Link to="/about">About</Link>
            </div>

            <hr />
        </nav>
    );
}

export default Navbar;