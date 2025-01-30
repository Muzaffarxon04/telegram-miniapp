/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "./Home.css";

// Define types
interface Product {
  id: string;
  name: string;
  sale_price: number;
  images: string[];
}

interface CartItem extends Product {
  quantity: number;
}

interface User {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    fetch("https://api.daymall.uz/api/category/8", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => setProducts(data?.data?.products))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;

    tg.ready();

    // Get user data
    const userData = tg.initDataUnsafe?.user;
    if (userData) {
      setUser(userData);
    }

    // Detect theme
    setTheme(tg.colorScheme || "light");
  }, []);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getCartQuantity = (productId: string) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const checkout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const orderSummary = cart
      .map((item) => `${item.name} (x${item.quantity}) - $${item.sale_price * item.quantity}`)
      .join("\n");

    const confirmed = window.confirm(
      `🛒 Order Summary:\n\n${orderSummary}\n\nTotal: $${cart.reduce(
        (total, item) => total + item.sale_price * item.quantity,
        0
      )}\n\nProceed with checkout?`
    );

    if (!confirmed) return;

    try {
      alert("Order placed successfully!");
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
        {user && (
          <>
            <h4>Welcome, {user.first_name} {user?.last_name}!</h4>
            <p>Username: {user.username || "N/A"}</p>
            <p>User ID: {user.id}</p>
          </>
        )}
      </header>

      <div className="products">
        {products.length ? (
          products.map((product) => {
            const quantity = getCartQuantity(product.id);
            return (
              <div key={product.id} className="product">
                <img
                  src={
                    product.images[0]
                      ? `https://api.daymall.uz/api/upload/${product.images[0]}`
                      : "https://placehold.co/200x200"
                  }
                  alt={product.name}
                  width={200}
                />
                <h3>{product.name}</h3>
                <p>${product.sale_price}</p>
                <div className="cart-controls">
                  {quantity > 0 ? (
                    <div className="quantity-buttons">
                      <button onClick={() => removeFromCart(product.id)}>-</button>
                      <span>{quantity}</span>
                      <button onClick={() => addToCart(product)}>+</button>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(product)}>Add to Cart</button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p>Loading products...</p>
        )}
      </div>

      <div className="cart">
        <h2>🛒 Cart</h2>
        {cart.length === 0 ? (
          <p>Cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              <p>
                {item.name} - ${item.sale_price} x {item.quantity} = $
                {item.sale_price * item.quantity}
              </p>
              <button onClick={() => removeFromCart(item.id)}>-</button>
              <button onClick={() => addToCart(item)}>+</button>
            </div>
          ))
        )}
        <button onClick={checkout} disabled={cart.length === 0}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default App;
