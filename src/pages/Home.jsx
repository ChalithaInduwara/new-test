import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
            <section>
                <h1>Welcome to Plant Store</h1>

                <p>
                    Find simple indoor plants and decorative pots for your home,
                    office, and desk.
                </p>

                <Link to="/shop">
                    <button>Shop Now</button>
                </Link>
            </section>

            <hr />

            <section>
                <h2>Categories</h2>

                <div>
                    <h3>Bonsai</h3>
                    <p>Small bonsai plants for indoor decoration.</p>
                </div>

                <div>
                    <h3>Cactus</h3>
                    <p>Simple and easy-to-care cactus plants.</p>
                </div>

                <div>
                    <h3>Succulents</h3>
                    <p>Small decorative succulent plants.</p>
                </div>

                <div>
                    <h3>Flower Pots</h3>
                    <p>Decorative pots for your indoor plants.</p>
                </div>
            </section>

            <hr />

            <section>
                <h2>Featured Products</h2>

                <div>
                    <h3>Mini Bonsai Tree</h3>
                    <p>Price: Rs. 2500</p>
                    <button>Add to Cart</button>
                </div>

                <br />

                <div>
                    <h3>Mini Cactus</h3>
                    <p>Price: Rs. 950</p>
                    <button>Add to Cart</button>
                </div>

                <br />

                <div>
                    <h3>Succulent Plant</h3>
                    <p>Price: Rs. 1200</p>
                    <button>Add to Cart</button>
                </div>

                <br />

                <div>
                    <h3>Ceramic Flower Pot</h3>
                    <p>Price: Rs. 1500</p>
                    <button>Add to Cart</button>
                </div>
            </section>

            <hr />

            <section>
                <h2>Why Choose Us?</h2>

                <p>Quality indoor plants and decorative pots.</p>
                <p>Affordable prices.</p>
                <p>Simple and convenient online shopping.</p>
            </section>
        </div>
    );
}

export default Home;