import React, { useEffect, useState } from 'react';
import Filter from '../components/Filter';
import MenuItem from '../components/MenuItem';
import Search from '../components/Search';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const navigate = useNavigate();
  // const viewCart = () => {
  //   navigate('/Bill');
  // };
  const [showFilter, setShowFilter] = useState(false);
  const [menu, setMenu] = useState([]);
  const [filters, setFilters] = useState(null);

  const fetchMenu = async (filterParams = '') => {
    try {
      const response = await fetch(`/api/menu${filterParams}`);
      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.error('Failed to fetch menu:', error);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleApplyFilters = (filters) => {
    setShowFilter(false);
    setFilters(filters);

    const queryParams = new URLSearchParams();

    if (filters.vnv === 'veg') queryParams.append('veg', 'veg');
  else if (filters.vnv === 'nonveg') queryParams.append('veg', 'nonveg');

    if (filters.section) queryParams.append('section', filters.section);
    if (filters.special) queryParams.append('chefsSpecial', 'true');
    if (filters.available) queryParams.append('available', 'true');
    if (filters.price) queryParams.append('price', filters.price);

    fetchMenu(`?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3b2b2b] to-[#94614e] text-white">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 px-3 py-3 shadow-md bg-[#703f28]">
        <div className="flex flex-row items-center justify-between gap-4">
          <Search />

          <button
            onClick={() => setShowFilter(true)}
            className="z-50 px-5 py-2.5 bg-white text-amber-800 border-2 border-amber-500 font-semibold rounded-2xl shadow hover:bg-amber-100 transition"
          >
            Filter
          </button>
          <button
            onClick={() => navigate('/Bill')}
            className="z-50 px-5 py-2.5 bg-white text-amber-800 border-2 border-amber-500 font-semibold rounded-2xl shadow hover:bg-amber-100 transition"
          >
            Cart
          </button>
        </div>
      </div>

      {/* Filter Overlay */}
      {showFilter && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setShowFilter(false)} />
          <Filter
            onApply={handleApplyFilters}
            onClose={() => setShowFilter(false)}
          />
        </>
      )}

      {/* Menu Items */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 px-2 mt-6">
        {menu.length > 0 ? (
          menu.map((item) => (
            <MenuItem
              key={item._id}
              name={item.name}
              photo={item.photo}
              description={item.description}
              price={item.price}
              veg={item.veg}
            />
          ))
        ) : (
          <p className="text-center w-full col-span-3 py-8">No items found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
