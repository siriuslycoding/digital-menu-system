// import React, { useState } from 'react';
// import Filter from '../components/Filter';
// import MenuItem from '../components/MenuItem';
// import search from '../assets/search_white.svg'

// const Home = () => {
//   const [showFilter, setShowFilter] = useState(false);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#d09766] to-[#4f332a] px-2 py-4 text-white">
//       <div className="flex flex-row md:items-center md:justify-between gap-4 mb-4 relative bg-[#703f28]">
//         {/* Search Bar */}
//         <form
//           action=""
//           className="flex w-full md:w-auto rounded-2xl border border-amber-300 shadow-sm bg-white overflow-hidden"
//         >
//           <input
//             type="text"
//             placeholder="Search an item ..."
//             className="p-3 w-full md:w-64 focus:outline-none text-black text-sm"
//           />
//           <button
//             type="submit"
//             className="cursor-pointer px-1 bg-amber-800 text-white text-sm font-medium hover:bg-amber-700 transition-colors duration-200"
//           >
//             <img src={search} alt="Search icon" className='w-10 h-10' />
//           </button>
//         </form>

//         {/* Filter Button */}
//         <button
//           onClick={() => setShowFilter(!showFilter)}
//           aria-label="Toggle Filter"
//           className="z-50 cursor-pointer px-4 py-3 bg-white text-amber-800 border-2 border-amber-500 font-semibold rounded-2xl shadow hover:bg-amber-100 transition duration-200 self-start md:self-auto"
//         >
//           {showFilter ? '✕' : 'Filter'}
//         </button>

//         {/* Filter Menu */}
//         {showFilter && <Filter />}
//       </div>

//       {/* Menu Items */}
//       <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2 md:grid-cols-3">
//         <MenuItem />
//         <MenuItem />
//         <MenuItem />
//         <MenuItem />
//       </div>
//     </div>
//   );
// };

// export default Home;

import React, { useState } from 'react';
import Filter from '../components/Filter';
import MenuItem from '../components/MenuItem';
import search from '../assets/search_white.svg';

const Home = () => {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3b2b2b] to-[#94614e] text-white">
      
      {/* Sticky Search + Filter Bar */}
      <div className="sticky top-0 z-50 px-3 py-3 shadow-md bg-[#703f28] rounded-t-none">
        <div className="flex flex-row md:items-center md:justify-between gap-4">
          
          {/* Search Bar */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full md:w-auto rounded-2xl border border-amber-300 shadow bg-white overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search an item ..."
              className="p-3 w-full md:w-64 focus:outline-none text-black text-sm"
            />
            <button
              type="submit"
              className="flex items-center justify-center px-3 bg-amber-800 hover:bg-amber-700 transition-colors duration-200"
              aria-label="Search"
            >
              <img src={search} alt="Search icon" className="w-6 h-6" />
            </button>
          </form>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            aria-label="Toggle Filter"
            className="z-50 cursor-pointer px-5 py-2.5 bg-white text-amber-800 border-2 border-amber-500 font-semibold rounded-2xl shadow hover:bg-amber-100 transition duration-200"
          >
            {showFilter ? '✕' : 'Filter'}
          </button>
        </div>

        {/* Filter Menu */}
        {showFilter && <Filter />}
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 px-2 mt-6">
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
      </div>
    </div>
  );
};

export default Home;
