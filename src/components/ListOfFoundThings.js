// src/components/ListOfFoundThings.js
import React, { useState, useEffect, useRef } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import ProductCard from "@/components/ProductCard";

export default function ListOfFoundThings({ items, onDelete, onEdit }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [previews, setPreviews] = useState({});
  const [showMenu, setShowMenu] = useState({});
  const fetchedURLs = useRef(new Set()); // Track already fetched URLs

  console.log("Rendering ListOfFoundThings with items:", items); // Log items

  const fetchPreviewData = async (url, itemId) => {
    try {
      const response = await fetch(`/api/fetchPreview?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      if (response.ok) {
        setPreviews((prev) => ({ ...prev, [itemId]: data }));
      } else {
        console.error("Failed to fetch preview data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching preview data:", error);
    }
  };

  useEffect(() => {
    if (!items || items.length === 0) {
      console.log("No items to display"); // Log if items are empty
      return;
    }
    items.forEach((item) => {
      if (item.productURL && !fetchedURLs.current.has(item.productURL)) {
        fetchPreviewData(item.productURL, item._id);
        fetchedURLs.current.add(item.productURL);
      }
    });
  }, [items]);

  const columns = React.useMemo(
    () => [
      { Header: "Title", accessor: "title" },
      { Header: "Product URL", accessor: "productURL" },
      { Header: "Price", accessor: "price" },
      { Header: "Date Uploaded", accessor: "createdAt" },
    ],
    []
  );

  const { rows, prepareRow, setGlobalFilter: setTableGlobalFilter, toggleSortBy } = useTable(
    { columns, data: items || [], globalFilter }, // Fallback to empty array if items are undefined
    useGlobalFilter,
    useSortBy
  );

  const handleSearch = (e) => {
    setGlobalFilter(e.target.value);
    setTableGlobalFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === "title") {
      toggleSortBy("title", false);
    } else if (value === "priceLow") {
      toggleSortBy("price", false);
    } else if (value === "priceHigh") {
      toggleSortBy("price", true);
    } else if (value === "dateNewest") {
      toggleSortBy("createdAt", true);
    } else if (value === "dateOldest") {
      toggleSortBy("createdAt", false);
    }
  };

  if (!items || items.length === 0) {
    return <div>No items available to display.</div>; // Fallback if items are empty
  }

  return (
    <div>
      <div className="filter-controls">
        <input
          type="text"
          placeholder="Search by title..."
          value={globalFilter}
          onChange={handleSearch}
          className="filter-input"
        />
        <select onChange={handleSortChange} className="sort-select">
          <option value="title">Sort by Title</option>
          <option value="priceLow">Price Low to High</option>
          <option value="priceHigh">Price High to Low</option>
          <option value="dateNewest">Newest First</option>
          <option value="dateOldest">Oldest First</option>
        </select>
      </div>

      <div className="grid-container">
        {rows.map((row) => {
          prepareRow(row);
          const { title, productURL, price } = row.original;
          const previewData = previews[row.original._id];
          const isMenuOpen = showMenu[row.original._id];
          const toggleMenu = () => setShowMenu((prev) => ({ ...prev, [row.original._id]: !prev[row.original._id] }));

          return (
            <ProductCard
              key={row.id}
              title={title}
              productURL={productURL}
              price={price}
              previewData={previewData}
              isMenuOpen={isMenuOpen}
              toggleMenu={toggleMenu}
              onDelete={() => onDelete(row.original._id)}
              onEdit={() => onEdit(row.original)}
            />
          );
        })}
      </div>
    </div>
  );
}
