import Button from '@/app/_components/button';
import React, { useState } from 'react'

export default function SearchPosiSection() {
   const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchTerm}`);
  };
  const [searchTerm, setSearchTerm] = useState("");
  return (
    
 <form onSubmit={handleSearch} className="relative w-full max-w-sm">
          <div className="flex">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-r-none border-r-0 px-6"
            >
             
              SEARCH
            </Button>
            <input
              name="search"
              placeholder="Search positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-blue-200 rounded-l-none rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </form>
  )
}
