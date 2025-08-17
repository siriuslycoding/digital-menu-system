import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // 👈 Import useLocation
import axios from 'axios';
import MenuItem from './MenuItem';

// A custom hook to easily parse query strings from the URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const queryParam = useQuery();
  const navigate = useNavigate();
  const searchTerm = queryParam.get('q'); // 👈 Get the 'q' parameter from the URL

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't search if there's no search term
    if (!searchTerm) {
      setLoading(false);
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        // 👇 Use your working "live-search" endpoint
        const res = await axios.get(`/api/menu/live-search?search=${searchTerm}`);
        setResults(res.data);
      } catch (err) {
        console.error("Failed to fetch search results:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm]); // Re-run the search whenever the searchTerm changes

  if (loading) {
    return <div className="p-4 text-center">Searching...</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <button
        onClick={() => navigate(-1)}
        className='mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors'
      >
        &larr; Back to Menu
      </button>
      {/* <h2 className="text-2xl mb-4 font-bold">Search Results for "{searchTerm}"</h2> */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Display results as cards */}
          {results.map((item) => (
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
            // <div key={item._id} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
            //   <div className="flex-grow">
            //     <h3 className="font-bold text-lg">{item.name}</h3>
            //     {item.description && <p className="text-gray-600 text-sm mt-1">{item.description}</p>}
            //   </div>
            //   <div className="mt-4">
            //     <p className="font-semibold text-lg">₹{item.price}</p>
            //     {/* You can add an "Add" button here */}
            //   </div>
            // </div>
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;