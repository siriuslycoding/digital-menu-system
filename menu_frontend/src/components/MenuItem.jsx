import React, { useState } from 'react';
import veg_icon from '../assets/Veg_symbol.svg';
import nonveg_icon from '../assets/Non_veg_symbol.svg';
import coffee from '../assets/coffee.svg';
import { useCart } from '../context/CartContext';

const MenuItem = ({ name, photo, description, price, veg }) => {
  const [expanded, setExpanded] = useState(false);
  const { cart, addToCart, updateQty, deleteFromCart } = useCart();

  const existing = cart.find(item => item.name === name);
  const qty = existing?.qty || 0;

  const handleAdd = async (e) => {
    e.stopPropagation();
    try {
      await addToCart({ name, price });
    } catch (err) {
      console.error('Add to cart error:', err.message);
    }
  };

  const handleInc = async (e) => {
    e.stopPropagation();
    if (existing) {
      await updateQty(existing._id, existing.qty + 1);
    }
  };

  const handleDec = async (e) => {
    e.stopPropagation();
    if (existing.qty === 1) {
      await deleteFromCart(existing._id);
    } else {
      await updateQty(existing._id, existing.qty - 1);
    }
  };

  return (
    <>
      <div
        onClick={() => setExpanded(true)}
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 mb-4 border border-gray-200 cursor-pointer"
      >
        <div className="flex items-center gap-3 mb-2">
          <img src={veg ? veg_icon : nonveg_icon} alt={veg ? "veg" : "non-veg"} className="w-5 h-5" />
          <h3 className="font-semibold text-lg text-gray-800 flex-1">{name}</h3>
          <p className="text-gray-700 text-base font-medium mr-4">₹{price}</p>

          {qty === 0 ? (
            <button
              onClick={handleAdd}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm font-medium transition"
            >
              + Add
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDec}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm"
              >
                -
              </button>
              <span className="text-black font-semibold">{qty}</span>
              <button
                onClick={handleInc}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm"
              >
                +
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-sm flex-1 pr-2">
            {description.slice(0, 60)} ...
          </p>
          <img src={photo} alt={name} className="w-12 h-12 rounded-md object-cover" />
        </div>
      </div>

      {expanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-2 right-3 text-2xl font-bold text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 mb-4">
              <img src={veg ? veg_icon : nonveg_icon} alt={veg ? "veg" : "non-veg"} className="w-5 h-5" />
              <h2 className="text-xl font-bold text-gray-800">{name}</h2>
            </div>
            <img
              src={photo}
              alt={name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-gray-700 text-sm">{description}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItem;
