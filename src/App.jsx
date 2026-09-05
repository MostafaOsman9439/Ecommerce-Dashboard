// { }  Means That We Are Pulling A Specific Tool By The Name { useState } From Within The Library "react" Not The Whole/Entire Library.
import { useEffect, useState } from "react"; // useState Acts As A Memory, When A Product Is Added, It Rebuilds The Website And Add It To It.
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"; // An External Library Responsible For Navigating Between Pages Without The Page Having To Refresh.
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";

function App() {
  const [admin, setAdmin] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const admin_username = "admin";
  const admin_password = "123456";

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (username === admin_username && password === admin_password) {
      setAdmin(true);
      setIsLoginOpen(false);
      setUsername("");
      setPassword("");
    } else {
      alert("Wrong Username Or Password ^-^");
    }
  };
  // Lazy Initial State
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("my_cart");
    return savedCart ? JSON.parse(savedCart) : []; // To Make Sure It Only Works Once At The First Rendering (Mounting) Not With Every Render
  });

  useEffect(() => {
    localStorage.setItem("my_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    // Instead Of Giving It A Direct Value, So That If The User Did Press The Product So Fast That The Website Didn't Load Yet,
    // It Will Only Add The Product Once And It Will Only Read The Old Value Instead Of That, It Pass A Function Called (prevCart) That Holds The Latest Correct And Accurate Value
    // This prevents "Stale State" bugs during rapid clicks.
    setCart((prevCart) => {
      // Using .find() To See If The Product Already Exists In The (prevCart), If True Add It To The (isExist) And Go For The (map)/Add +1 To It
      //  If False The Value Will Be Undefined Skip The (map) And Go Create New Element To The Cart.
      const isExist = prevCart.find((item) => item.id === product.id);

      if (isExist) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const editCartProduct = (editedProduct) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === editedProduct.id // Checking If The current Id Is The Same Id The User Editing
          ? { ...editedProduct, quantity: item.quantity } // If True It Gives It The Quantity And Edit The Name Or The Price And Keep The Other Products Without AnyChange / False Nothing Changes
          : item,
      ),
    );
  };

  const updateQuantity = (id, amount) => {
    setCart(
      (prevCart) =>
        prevCart
          .map((item) => {
            if (item.id === id) {
              // Checking If The current Id Is The Same Id The User Wants To increase or decrease its quantity
              const newQuantity = item.quantity + amount;
              // Checking IF It Is Greater Than 0 If True It Return The Same Product With The New Quantity
              // If False It Returns null It Deletes The Product Form The Cart
              return newQuantity > 0
                ? { ...item, quantity: newQuantity }
                : null;
            }
            return item; // If It Is Not The Same Id Returning The Product To The New List Without Any Changes.
          })
          .filter(Boolean), // Checking If There Is Any Element Its Value Equals To null Or Less Than 0 And Deleting It From The Cart.
    );
  };

  // Using Filter To Create New Array Then Checking If The Condition Is Met If True Id != id Then Keep The Products In The Cart Else Delete it
  const deleteFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const totalItemsCount = cart.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <BrowserRouter>
      <div className="bg-slate-900 min-h-screen text-white">
        <header className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center px-8">
          <Link to="/" className="text-xl font-bold text-emerald-400">
            Mini Store
          </Link>
          <div className="flex gap-5">
            {!admin ? (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-full font-bold text-sm"
              >
                Admin Login
              </button>
            ) : (
              <button
                onClick={() => setAdmin(false)}
                className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-full font-bold text-sm"
              >
                Logout Admin
              </button>
            )}
            <Link
              to="/cart"
              className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-full font-bold text-sm"
            >
              The Cart: {totalItemsCount}
            </Link>
          </div>
        </header>

        {isLoginOpen && (
          <div
            onClick={() => setIsLoginOpen(false)}
            className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50"
          >
            <form
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleAdminLogin}
              className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-fit justify-center max-w-xl shadow-2xl space-y-4"
            >
              <h2 className="text-xl font-bold text-emerald-400">
                Admin Verification
              </h2>
              <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-emerald-400"
              />
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-emerald-400"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginOpen(false);
                    setUsername("");
                    setPassword("");
                  }}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <Home
                addToCart={addToCart}
                editCartProduct={editCartProduct}
                deleteFromCart={deleteFromCart}
                admin={admin}
                setCart={setCart}
              />
            }
          />
          <Route
            path="/product/:id"
            element={<ProductDetail addToCart={addToCart} />}
          />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                deleteFromCart={deleteFromCart}
                updateQuantity={updateQuantity}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
