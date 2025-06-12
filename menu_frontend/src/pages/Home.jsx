// import React, { useState } from 'react'
// import Filter from '../components/Filter';
// import MenuItem from '../components/MenuItem';

// const Home = () => {
//   const [showFilter, setShowFilter] = useState(false);

//   return (
//     <div>
//       <div className='flex flex-row'>
//         <form action="" className='mt-1 ml-1 rounded-2xl border border-amber-500'>
//           <input type="text" placeholder='Search ...' className='p-3' />
//           <button type='submit' className='cursor-pointer p-3 bg-amber-800 rounded-r-2xl'>Search</button>
//         </form>
//         <button
//           onClick={() => setShowFilter(!showFilter)}
//           className='cursor-pointer absolute right-1 mt-1 p-3 border-2 rounded-2xl z-50'>
//           {showFilter ? 'x' : 'Filter'}
//         </button>
//         {showFilter && <Filter />}
//       </div>
//       <MenuItem />
//       <MenuItem />
//       <MenuItem />
//       <MenuItem />
//     </div>
//   )
// }

// export default Home

import React, { useState } from 'react';
import Filter from '../components/Filter';
import MenuItem from '../components/MenuItem';

const Home = () => {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4B2E2B] to-[#7B4F42] px-4 py-6 text-white">
      <div className="flex flex-row md:items-center md:justify-between gap-4 mb-6 relative">
        {/* Search Bar */}
        <form
          action=""
          className="flex w-full md:w-auto rounded-2xl border border-amber-300 shadow-sm bg-white overflow-hidden"
        >
          <input
            type="text"
            placeholder="Search ..."
            className="p-3 w-full md:w-64 focus:outline-none text-black text-sm"
          />
          <button
            type="submit"
            className="cursor-pointer px-4 bg-amber-800 text-white text-sm font-medium hover:bg-amber-700 transition-colors duration-200"
          >
            Search
          </button>
        </form>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          aria-label="Toggle Filter"
          className="z-50 cursor-pointer px-4 py-2 bg-white text-amber-800 border-2 border-amber-500 font-semibold rounded-2xl shadow hover:bg-amber-100 transition duration-200 self-start md:self-auto"
        >
          {showFilter ? '✕' : 'Filter'}
        </button>

        {/* Filter Menu */}
        {showFilter && <Filter />}
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
      </div>
    </div>
  );
};

export default Home;
