import { Link } from "react-router-dom";

function Cart({ cart, deleteFromCart, updateQuantity }) {
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  if (cart.length === 0) {
    return (
      <div className="p-10 text-center">
        {/* If The Shopping Cart Is Empty */}
        <h2 className="text-2xl font-bold text-white mb-4">
          Your Cart Is Empty
        </h2>
        <p className="text-slate-400 mb-6">
          Looks Like You Haven't Added Anything To Your Cart Yet.
        </p>
        {/* Returning Button To The Home Page */}
        <Link
          to="/"
          className="inline-block bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold py-2 px-6 rounded-lg transition"
        >
          Go Shopping?
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-extrabold text-emerald-400 mb-8 border-b border-slate-700 pb-4">
        Your Shopping Cart
      </h2>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between gap-4 shadow-md flex-col min-[400px]:flex-row"
            >
              <div className="bg-white p-2 rounded-lg w-full h-30 min-[450px]:w-20 min-[450px]:h-20 shrink-0 flex justify-center items-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-white font-bold text-sm sm:text-base line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-emerald-400 font-bold mt-1 flex justify-center">
                  ${item.price} * {item.quantity} = $
                  {item.price * item.quantity.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between gap-5 min-[450px]:flex-row items-center flex-col">
                <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-7 h-7 bg-slate-800 text-white rounded font-bold hover:bg-slate-700 transition"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm px-1">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-7 h-7 bg-slate-800 text-white rounded font-bold hover:bg-slate-700 transition"
                  >
                    +
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => deleteFromCart(item.id)}
                    className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-3 py-2 rounded-lg text-sm font-semibold border border-red-500/30 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-80 bg-slate-800 p-6 rounded-xl border border-slate-700 h-fit shadow-lg">
          <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">
            Order Summary
          </h3>
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-300">Total Price:</span>
            <span className="text-2xl font-black text-emerald-400">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold py-3 rounded-lg transition">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
