import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import search from '../assets/search_white.svg';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [timer, setTimer] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (timer) clearTimeout(timer);
    setTimer(setTimeout(() => {
      searchItems(value);
    }, 300));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/search?q=${query}`);
    }
  };

  const searchItems = async (search) => {
    if (!search) return setResults([]);
    try {
      const res = await axios.get(`/api/menu/live-search?search=${search}`);
      setResults(res.data);
    } catch (err) {
      setResults([]);
    }
  };

  return (
    <div className="w-full flex flex-col items-start px-4 py-2 relative">
      <div className="flex items-center gap-2 w-full max-w-md">
        <img src={search} alt="Search" className="w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search for items..."
          className="flex-1 px-3 py-2 bg-white text-black rounded-md shadow"
        />
      </div>
      {query && (
        <div className="absolute top-14 w-full max-w-md bg-white text-black rounded shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
          {results.length > 0 ? (
            results.map((item) => (
              <div
                key={item._id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b"
                onClick={() => navigate(`/search?q=${encodeURIComponent(item.name)}`)}
              >
                {item.name}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
