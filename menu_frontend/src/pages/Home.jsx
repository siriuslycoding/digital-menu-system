import React, { useEffect, useState } from 'react';
import Filter from '../components/Filter';
import MenuItem from '../components/MenuItem';
import search from '../assets/search_white.svg';
import Search from '../components/Search';  

const Home = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      const response = await fetch('/api/menu');
      const json = await response.json();

      if (response.ok) {
        setMenu(json);
      }
    };

    fetchMenu();
  }, [])

 
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3b2b2b] to-[#94614e] text-white">

      {/* Sticky Search + Filter Bar */}
      <div className="sticky top-0 z-50 px-3 py-3 shadow-md bg-[#703f28] rounded-t-none">
        <div className="flex flex-row md:items-center md:justify-between gap-4">

          <Search/>

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
        {menu &&
          menu.map((item) => (
            <MenuItem
              key={item._id}
              name={item.name}
              photo={item.photo}
              description={item.description}
              price={item.price}
              veg={item.veg}
              section={item.sections}
              chefspecial={item.chefspecial}
              available={item.available}
            />
          ))}
      </div>

    </div>
    
  );
};

export default Home;
