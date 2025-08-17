import React, { useState } from 'react';
import veg_icon from '../assets/Veg_symbol.svg';
import nonveg_icon from '../assets/Non_veg_symbol.svg';
import chef_icon from '../assets/chefs_cap.svg';
import { useCart } from '../context/CartContext';

const MenuItem = ({ name, photo, description, price, veg, section, chefspecial, available }) => {
  const [expanded, setExpanded] = useState(false);
  const { cart, addToCart, updateQty, deleteFromCart } = useCart();

  const existing = cart.find(item => item.name === name);
  const qty = existing?.qty || 0;

  // ------------------ Optimistic Add ------------------
  const handleAdd = async (e) => {
    e.stopPropagation();

    // Optimistic update
    const tempItem = { _id: 'temp-' + Date.now(), name, price, qty: 1 };
    updateQty(tempItem._id, 1); // will trigger re-render

    try {
      const item = await addToCart({ name, price });

      // Replace temp item with actual item
      updateQty(item._id, 1);
    } catch (err) {
      console.error('Add to cart failed:', err.message);
      deleteFromCart(tempItem._id); // rollback
    }
  };

  // ------------------ Optimistic Increment ------------------
  const handleInc = async (e) => {
    e.stopPropagation();
    if (!existing) return;

    const newQty = existing.qty + 1;
    updateQty(existing._id, newQty); // optimistic update

    try {
      await updateQty(existing._id, newQty); // real update
    } catch (err) {
      console.error('Increment failed:', err.message);
      updateQty(existing._id, existing.qty); // rollback
    }
  };

  // ------------------ Optimistic Decrement ------------------
  const handleDec = async (e) => {
    e.stopPropagation();
    if (!existing) return;

    const newQty = existing.qty - 1;

    if (newQty === 0) {
      deleteFromCart(existing._id); // optimistic delete
      try {
        await deleteFromCart(existing._id);
      } catch (err) {
        console.error('Delete failed:', err.message);
        updateQty(existing._id, 1); // rollback to previous qty
      }
    } else {
      updateQty(existing._id, newQty); // optimistic update
      try {
        await updateQty(existing._id, newQty);
      } catch (err) {
        console.error('Decrement failed:', err.message);
        updateQty(existing._id, existing.qty); // rollback
      }
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
          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
              {chefspecial && <img src={chef_icon} alt="chef's special" className='w-5 h-5' />}
              {!available && <p className='text-gray-400'>(Not Available)</p> }
            </div>
            
          </div>
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
            {description.length>60 ? description.slice(0, 60) : description} 
          </p>
          <img src={photo} alt={name} className="w-12 h-12 rounded-md object-cover" />
        </div>
      </div>

      {expanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-2 right-3 text-2xl font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
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
