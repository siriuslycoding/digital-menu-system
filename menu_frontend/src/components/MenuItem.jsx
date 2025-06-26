// import React from 'react';
// import veg from '../assets/Veg_symbol.svg';
// import coffee from '../assets/coffee.svg';

// const MenuItem = () => {
//   return (
//     <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 mb-4 border border-gray-200">
      
//       {/* Top Row */}
//       <div className="flex items-center gap-3 mb-2">
//         <img src={veg} alt="Veg" className="w-5 h-5" />
//         <h3 className="font-semibold text-lg text-gray-800 flex-1">Dish Name</h3>
//         <p className="text-gray-700 text-base font-medium mr-4">₹199</p>
//         <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm font-medium transition">
//           +
//         </button>
//       </div>

//       {/* Bottom Row */}
//       <div className="flex justify-between items-center">
//         <p className="text-gray-600 text-sm flex-1 pr-2">
//           A delicious description of the item goes here.
//         </p>
//         <img src={coffee} alt="Item" className="w-12 h-12 rounded-md object-cover" />
//       </div>
//     </div>
//   );
// };

// export default MenuItem;

import React, { useState } from 'react';
import veg from '../assets/Veg_symbol.svg';
import coffee from '../assets/coffee.svg';

const MenuItem = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Compact Card */}
      <div
        onClick={() => setExpanded(true)}
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 mb-4 border border-gray-200 cursor-pointer"
      >
        <div className="flex items-center gap-3 mb-2">
          <img src={veg} alt="Veg" className="w-5 h-5" />
          <h3 className="font-semibold text-lg text-gray-800 flex-1">Dish Name</h3>
          <p className="text-gray-700 text-base font-medium mr-4">₹199</p>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm font-medium transition"
            onClick={(e) => {
              e.stopPropagation(); // Prevents modal from opening when clicking +
              // Optional: handle quantity increase
            }}
          >
            +
          </button>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-sm flex-1 pr-2">
            A short preview of the dish.
          </p>
          <img src={coffee} alt="Item" className="w-12 h-12 rounded-md object-cover" />
        </div>
      </div>

      {/* Full-Screen Overlay */}
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
              <img src={veg} alt="Veg" className="w-5 h-5" />
              <h2 className="text-xl font-bold text-gray-800">Dish Name</h2>
            </div>
            <img
              src={coffee}
              alt="Large"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-gray-700 text-sm">
              This is the full description of the dish. It goes into more detail
              about the ingredients, taste, preparation, and any other important
              info a customer might need. You can scroll if needed.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItem;
