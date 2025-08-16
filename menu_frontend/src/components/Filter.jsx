import React, { useState } from 'react';
import { X } from 'lucide-react'; // Optional: install lucide-react for icons or use Unicode

const Filter = ({ onApply, onClose }) => {
    const [filters, setFilters] = useState({
        price: '',
        section: '',
        vnv: '',
        special: false,
        available: false,
    });

    const handleApply = () => {
        onApply(filters);
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#4B2E2B] text-[#F8E6C1] p-4 overflow-y-auto rounded-t-3xl md:rounded-xl shadow-lg md:top-1/4 md:left-1/4 md:w-1/2 md:h-fit">
            {/* Close Button */}
            <div className="flex justify-end">
                <button onClick={onClose} className="text-[#F8E6C1] hover:text-red-400 text-2xl font-bold">
                    <X size={24} />
                </button>
            </div>

            <h2 className="text-xl font-semibold mb-4 text-center">Filter Menu</h2>
            
            <div className="mb-4">
                <p className="mb-1 font-medium">Price</p>
                <select
                    className="w-full p-2 rounded bg-[#F8E6C1] text-[#4B2E2B]"
                    value={filters.price}
                    onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                >
                    <option value="">Any</option>
                    <option value="<100">Less than ₹100</option>
                    <option value="<500">Less than ₹500</option>
                    <option value=">500">More than ₹500</option>
                </select>
            </div>

            <div className="mb-4">
                <p className="mb-1 font-medium">Section</p>
                <select
                    className="w-full p-2 rounded bg-[#F8E6C1] text-[#4B2E2B]"
                    value={filters.section}
                    onChange={(e) => setFilters({ ...filters, section: e.target.value })}
                >
                    <option value="">All</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="quickies">Quickies</option>
                    <option value="lunch">Lunch</option>
                    <option value="beverages">Beverages</option>
                </select>
            </div>

            <div className="mb-4">
                <p className="mb-1 font-medium">Veg / Non-Veg</p>
                <select
                    className="w-full p-2 rounded bg-[#F8E6C1] text-[#4B2E2B]"
                    value={filters.vnv}
                    onChange={(e) => setFilters({ ...filters, vnv: e.target.value })}
                >
                    <option value="">All</option>
                    <option value="veg">Vegetarian</option>
                    <option value="nonveg">Non-Vegetarian</option>
                </select>
            </div>

            <div className="mb-4 flex items-center gap-2">
                <input
                    type="checkbox"
                    id="special"
                    checked={filters.special}
                    onChange={(e) => setFilters({ ...filters, special: e.target.checked })}
                />
                <label htmlFor="special">Chef's Special</label>
            </div>

            <div className="mb-6 flex items-center gap-2">
                <input
                    type="checkbox"
                    id="available"
                    checked={filters.available}
                    onChange={(e) => setFilters({ ...filters, available: e.target.checked })}
                />
                <label htmlFor="available">Currently Available</label>
            </div>

            <button
                onClick={handleApply}
                className="w-full p-2 bg-[#D9A066] text-white rounded font-semibold hover:bg-[#B87530]"
            >
                Apply Filters
            </button>
        </div>
    );
};

export default Filter;
