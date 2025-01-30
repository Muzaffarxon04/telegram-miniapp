/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// import axios from "axios";
import "./Home.css";

// Define types
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

// interface User {
//   id: string;
//   first_name: string;
// }

const App: React.FC = () => {
  const [user, setUser] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [theme, setTheme] = useState<string>("light");

useEffect(() => { 
  fetch("https://api.daymall.uz/api/category/8", {
    headers: {
      method: "GET",
        }}
        ).then((response) => response.json())
        .then((data) => setProducts(data?.data?.products))
},[])

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;

    tg.ready();

    // Get user data
    const userData = tg.initDataUnsafe?.user;
    if (userData) {
      setUser(userData);
    }


    // Fetch products
    // axios
    //   .get<any>("https://api.daymall.uz/api/category/8")
    //   .then((response) => setProducts(response?.data?.products))
    //   .catch((error) => console.error("Error fetching products:", error));

    // Detect theme
    setTheme(tg.colorScheme || "light");
  }, []);

  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const checkout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    try {
      // await axios.post("https://your-backend-url.com/checkout", {
      //   userId: user?.id,
      //   cart,
      // });
      alert("Order placed!");
      setCart([]); // Clear cart after successful checkout
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed.");
    }
  };

  return (
    <div className={`App ${theme}`}>
      <header>
        <h1>🛍️ Telegram Shop</h1>
        {user && <>
          <h4>Welcome, {user.first_name} !! 2 </h4>
          <p> {user.user_name}</p>
        </>
          }
      </header>

      <div className="products">
    
        {products.length ? products?.map((product:any) => (
          <div key={product.id} className="product">
            <img src={product.images[0] ? `https://api.daymall.uz/api/upload/${product.images[0]}` : "https://placehold.co/600x400"}  alt={product.name} width={200}/>
            <h3>{product.name}</h3>
            <p>${product.sale_price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        )) : <p>Loading products...</p>}
      </div>

      <div className="cart">
        <h2>🛒 Cart</h2>
        {cart.length === 0 && <p>Cart is empty.</p>}
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <p>{item.name} - ${item.price}</p>
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))}
        <button onClick={checkout} disabled={cart.length === 0}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default App;
