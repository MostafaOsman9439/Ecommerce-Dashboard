// Opens The Website -> Shows The Loading Screen && Asks The Api For The Data  ->
// Accepting The Data By useState From The setProducts, Finishes Loading -> Then The map Function Puts The Data Into Carts
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home({ addToCart, editCartProduct, deleteFromCart }) {
  // We Are Using useState Six times Once For Storing The Data / And Once To Control The Loading Screen / And Once For The Filtering / And Once For Sorting By The Price / Adding New Product / Storing The New Product Data
  const [products, setProducts] = useState(() => {
    try {
      const savedProducts = localStorage.getItem("my_products"); // localStorage Stores The Data As A Strings
      return savedProducts ? JSON.parse(savedProducts) : []; // savedProducts Checks If There Is Data Stored ? If True It Transfer The String Into Array Or Object To Make (State) Able To Use filter/map
    } catch (err) {
      console.error("Error reading localStorage", err);
      return [];
    }
  }); // Storing Data/Products Like (Image, Title, Price, Etc) If False It Start With Empty []/Array Until The Data Is Received
  const [loading, setLoading] = useState(() => {
    return !localStorage.getItem("my_products");
  }); // Displaying The Loading Screen Depends On If There Is Data In LocalStorage Or Not
  const [selectedCategory, setSelectedCategory] = useState("all"); // Function That Filters/Updates The Products Starts With "all" To Display All The Products
  const [sortOrder, setSortOrder] = useState("default"); // For Sorting Starts With Default Until The User Change The Sorting
  const [isAddOpen, setIsAddOpen] = useState(false); // Controlling To Open Or Close The Form Starts false To Be Closed
  const [formData, setFormData] = useState({
    // Storing The New Product
    title: "",
    price: "",
    category: "electronics",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // (Set) => It Removes Any Duplicate Item
  // (...) Making Sure It Gives Us Normal Array At The End So We Can Use Our (Map)
  // "all" To Make Sure Our Array Starts With It
  const categories = ["all", ...new Set(products.map((p) => p.category))]; // # products.map((p) => p.category) # Checking All The Products Then Extracting The Category Name From It

  const filteredProducts = // Stores The Filtered List After Checking If The User Still On The ("all") If True Show All The Products
    selectedCategory === "all" // Else filter All The Products And Make Sure That (product.category === selectedCategory) Then Store it In (filteredProducts)
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    // We Made New Array Using (...) Cuz (sort) Will Change The Original Array And It Will Give Us An Error
    if (sortOrder === "low-to-high") return a.price - b.price;
    if (sortOrder === "high-to-low") return b.price - a.price;
    return 0; // If It Is Still Default
  });

  const handleAddProduct = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || formData.price === "")
      return alert("Please fill in required fields!");

    const newProduct = {
      id: Date.now(), // Making New Spacial Id By Using The Date.now
      title: formData.title,
      price: parseFloat(formData.price), // Changing The Price From String To Number
      category: formData.category,
      image:
        formData.image ||
        "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    };

    setProducts([newProduct, ...products]); // Adding The Product At The Beginning
    setIsAddOpen(false);
    setFormData({
      title: "",
      price: "",
      category: "electronics",
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    });
  };

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
    if (deleteFromCart) deleteFromCart(id); // Making Sure Nothing Can Call This Function Excepts If It Was A Prop
  };

  const handleEditProduct = (e) => {
    e.preventDefault();
    if (!editingProduct.title.trim() || editingProduct.price === "") {
      return alert("Please fill in required fields!");
    }

    const updatedProductsList = products.map((product) =>
      product.id === editingProduct.id ? editingProduct : product,
    );

    setProducts(updatedProductsList); // React (State) It Re-Renders The Website, The Old Products With The Edited Once
    //  And (LocalStorage) The Moment Products Change, It Updates Itself With The New Data By ("my_products")
    if (editCartProduct) editCartProduct(editingProduct); // Making Sure Nothing Can Call This Function Excepts If It WAS REALLY A PROP I HAD ENOUGH OF THIS SHIT
    // If Something Called This Function And It Updates The Products It Sends The New Edited Object (Product) To App.jsx
    // And Updates LocalStorage
    setEditingProduct(null);
  };

  useEffect(() => {
    const savedProducts = localStorage.getItem("my_products");
    const parsed = savedProducts ? JSON.parse(savedProducts) : [];

    if (parsed.length > 0) {
      setLoading(false);
    } else {
      fetch("https://fakestoreapi.com/products")
        .then((res) => res.json()) // Response
        .then((data) => {
          setProducts(data); // Changing The Empty [] Into The Data We Received
          localStorage.setItem("my_products", JSON.stringify(data));
          setLoading(false); // Stops The Loading Screen Then Displaying The Data (Products).
          // console.log(data)
        })
        .catch((err) => {
          console.log("Error Fetching Data:", err);
          setLoading(false); // Stops The Loading Screen Then Displaying The Error.
        });
    }
  }, []); // The Empty [] To Make Sure The useState Only Works Once When The Page Loads

  useEffect(() => {
    // (useEffect) It Checks If There Is Any Changes In The (Products)
    if (!loading) {
      localStorage.setItem("my_products", JSON.stringify(products)); // Takes Every New Product Added And Transfer It To string Then It Updates With It The Website
    }
  }, [products, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold text-emerald-400 mb-8 border-b border-slate-700 pb-4">
        Explore Products
      </h2>
      <div className="flex flex-col min-[953px]:flex-row items-stretch min-[953px]:items-center justify-between gap-4 mb-6">
        <div className="block min-[600px]:hidden w-full">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-800 text-emerald-400 font-bold border border-slate-700 px-4 py-2.5 rounded-lg text-sm outline-none focus:border-emerald-400 capitalize"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden min-[600px]:flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                selectedCategory === cat
                  ? "bg-emerald-500 text-slate-900 font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col min-[400px]:flex-row items-center justify-between min-[953px]:justify-end gap-3 w-full min-[953px]:w-auto">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 px-3 py-2 rounded-lg text-sm outline-none focus:border-emerald-400"
          >
            <option value="default">Sort by: Default</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>

          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm transition whitespace-nowrap"
          >
            + Add New Product
          </button>
        </div>
      </div>

      {isAddOpen && (
        <div
          onClick={() => setIsAddOpen(false)}
          className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleAddProduct}
            className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-fit justify-center max-w-xl shadow-2xl space-y-4"
          >
            <h3 className="text-xl font-bold text-emerald-400">
              Add New Product
            </h3>

            <input
              type="text"
              placeholder="Product Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-emerald-400"
            />

            <input
              type="number"
              placeholder="Price ($)"
              value={formData.price}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({
                  ...formData,
                  price: val === "" ? "" : parseFloat(val),
                });
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-emerald-400"
            />

            <input
              type="text"
              placeholder="Image URL"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-emerald-400"
            />

            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-emerald-400"
            >
              {categories
                .filter((cat) => cat !== "all")
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <div
            key={product.id} // Spacial Key Helps (React) To Know Which Part Did The User Change When Rendering
            className="bg-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-lg hover:shadow-emerald-950/50 transition-all duration-300 border border-slate-700 hover:border-emerald-500/50 group"
          >
            <div>
              <div className="bg-white rounded-lg p-4 h-48 flex justify-center items-center overflow-hidden mb-4 group-hover:scale-[1.02] transition-transform duration-300">
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-h-full object-contain"
                />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/50 px-2 py-1 rounded">
                {product.category}
              </span>

              <h3 className="text-base font-bold text-white mt-2 line-clamp-2 title-link">
                {product.title}
              </h3>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
              <span className="text-xl font-black text-emerald-400">
                ${product.price}
              </span>
              <Link
                to={`/product/${product.id}`}
                className="bg-slate-700 hover:bg-emerald-600 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-200"
              >
                View Details
              </Link>
            </div>

            <button
              onClick={() => addToCart(product)}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 py-2 px-3 rounded-lg text-sm font-bold transition justify-center mt-3 w-full"
            >
              Add To Your Cart
            </button>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition duration-200 mt-3 flex-2"
              >
                Delete Product
              </button>
              <button
                onClick={() => setEditingProduct({ ...product })}
                className="bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition duration-200 mt-3 flex-1"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingProduct && (
        <div
          onClick={() => setEditingProduct(null)}
          className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleEditProduct}
            className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-md shadow-2xl space-y-4"
          >
            <h3 className="text-xl font-bold text-amber-400">Edit Product</h3>

            <input
              type="text"
              placeholder="Product Title"
              value={editingProduct.title}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, title: e.target.value })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-amber-400"
            />

            <input
              type="number"
              placeholder="Price ($)"
              value={editingProduct.price}
              onChange={(e) => {
                const val = e.target.value;
                setEditingProduct({
                  ...editingProduct,
                  price: val === "" ? "" : parseFloat(val),
                });
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-amber-400"
            />

            <input
              type="text"
              placeholder="Image URL"
              value={editingProduct.image}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, image: e.target.value })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-amber-400"
            />

            <select
              value={editingProduct.category}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  category: e.target.value,
                })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-amber-400"
            >
              {categories
                .filter((cat) => cat !== "all")
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
export default Home;
