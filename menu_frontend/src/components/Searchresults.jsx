import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SearchResults = () => {
  const { query } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`/api/menu/search?search=${query}`);
        console.log(res.data);
        setResults(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Search Results for "{query}"</h2>
      {results.length > 0 ? (
        results.map((item) => (
          <div key={item._id} className="border-b py-2">
            {item.name}
          </div>
        ))
      ) : (
        <div>No results found.</div>
      )}
    </div>
  );
};

export default SearchResults;
