import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function ProductDetail({ addToCart }) {
  // useParams Reads The URL To Know Which Product It Is Going To Display By The ID
  const { id } = useParams();

  // We Are Using useState Twice Once For Storing The Data / And Once To Control The Loading Screen
  const [product, setProduct] = useState(null); // Storing Data (Products Information) Like (Image, Title, Price, Etc) Starts With Null Until The Data Is Received
  const [loading, setLoading] = useState(true); // The Loading Screen Starting With True Means Start Loading Until The Data Is Received
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      let savedProducts = [];
      try {
        savedProducts =
          JSON.parse(localStorage.getItem("my_products")) || [];
      } catch (err) {
        console.error("Error reading localStorage", err);
      }

      const foundProduct = savedProducts.find(
        (p) => String(p.id) === String(id),
      );

      if (foundProduct) {
        await Promise.resolve();
        if (!cancelled) {
          setProduct(foundProduct);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(
          `https://fakestoreapi.com/products/${id}`,
        );
        if (!response.ok) throw new Error("Product was not found");
        const data = await response.json();
        if (!cancelled) {
          setProduct(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load this product. Please try again.",
          );
          setLoading(false);
        }
      }
    };

    loadProduct();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center h-64 text-emerald-400 font-bold text-lg">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center p-10 text-red-400 font-bold text-lg">
        {error || "The product is unavailable or sold out."}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Returning Button To The Home Page */}
      <Link
        to="/"
        className="inline-block mb-6 text-emerald-400 hover:underline font-semibold"
      >
        To The Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
        {/* Product Image */}
        <div className="bg-white p-4 rounded-lg flex items-center justify-center">
          <img
            src={product.image}
            alt={product.title}
            onError={(e) => {
              e.target.src =
                "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg";
            }}
            className="h-64 object-contain" // object-contain = object-fit
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full inline-block mb-3">
              {product.category}
            </span>
            <h1 className="text-2xl font-bold text-white mb-3">
              {product.title}
            </h1>
            {/* leading-relaxed = line-height */}
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {product.description}
            </p>
          </div>

          <div>
            {/* ($) Is Not A Code Just A Letter */}
            <div className="text-3xl font-bold text-emerald-400 mb-4">
              ${product.price}
            </div>
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold py-3 px-6 rounded-lg transition duration-200 cursor-pointer"
            >
              Add To Ur Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
