import React, { useState, useEffect, useRef } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import ProductCard from "@/components/ProductCard";
import "../../styles/ListOfFoundThings.css";

export default function ListOfFoundThings({ items, onDelete, onEdit }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [previews, setPreviews] = useState({});
  const [showMenu, setShowMenu] = useState({});
  const [selectedTag, setSelectedTag] = useState(""); // State for selected tag
  const [filteredItems, setFilteredItems] = useState(items);
  const fetchedURLs = useRef(new Set());
  const isMounted = useRef(true); // Track whether the component is mounted

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Fetch preview data
  const fetchPreviewData = async (url, itemId) => {
    if (!url) {
      console.warn("No URL provided for preview fetch");
      return;
    }
  
    try {
      const response = await fetch(
        `/api/fetchPreview?url=${encodeURIComponent(url)}`
      );
  
      if (!response.ok) {
        console.error(
          `Failed to fetch preview for URL: ${url}, Status: ${response.status}`
        );
        setPreviews((prev) => ({
          ...prev,
          [itemId]: {
            title: "No Preview Available",
            description: "Unable to fetch preview data.",
            images: ["https://via.placeholder.com/300x200?text=No+Image"],
          },
        }));
        return;
      }
  
      const data = await response.json();
      setPreviews((prev) => ({
        ...prev,
        [itemId]: data,
      }));
    } catch (error) {
      console.error(`Error fetching preview for URL: ${url}`, error.message);
      setPreviews((prev) => ({
        ...prev,
        [itemId]: {
          title: "No Preview Available",
          description: "Unable to fetch preview data.",
          images: ["https://via.placeholder.com/300x200?text=No+Image"],
        },
      }));
    }
  };
  
  const handleTagFilter = (tag) => {
    setSelectedTag(tag);
    if (tag) {
      const filtered = items.filter((item) => item.tags?.includes(tag));
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  };

  useEffect(() => {
    items.forEach((item) => {
      if (item.productURL && !fetchedURLs.current.has(item.productURL)) {
        fetchPreviewData(item.productURL, item._id);
        fetchedURLs.current.add(item.productURL);
      }
    });
    setFilteredItems(items);
  }, [items]);

  const uniqueTags = [...new Set(items.flatMap((item) => item.tags || []))].filter(
    (tag) => tag.trim() !== ""
  );

  const columns = React.useMemo(
    () => [
      { Header: "Title", accessor: "title" },
      { Header: "Product URL", accessor: "productURL" },
      { Header: "Price", accessor: "price" },
      { Header: "Date Uploaded", accessor: "createdAt" },
    ],
    []
  );

  const { rows, prepareRow, setGlobalFilter: setTableGlobalFilter, toggleSortBy } =
    useTable({ columns, data: filteredItems, globalFilter }, useGlobalFilter, useSortBy);

  useEffect(() => {
    toggleSortBy("createdAt", true);
  }, [toggleSortBy]);

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
        <select onChange={handleSortChange} className="sort-select" defaultValue="dateNewest">
          <option value="title">Sort (A-Z)</option>
          <option value="priceLow">Price Low to High</option>
          <option value="priceHigh">Price High to Low</option>
          <option value="dateNewest">Newest First</option>
          <option value="dateOldest">Oldest First</option>
        </select>
        <select
          onChange={(e) => handleTagFilter(e.target.value)}
          value={selectedTag}
          className="tag-filter-select"
        >
          <option value="">All Tags</option>
          {uniqueTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className="grid-container">
        {rows.map((row) => {
          prepareRow(row);
          const { title, productURL, price, tags } = row.original;
          const previewData = previews[row.original._id];
          const isMenuOpen = showMenu[row.original._id];
          const toggleMenu = () =>
            setShowMenu((prev) => ({
              ...prev,
              [row.original._id]: !prev[row.original._id],
            }));

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
              tags={tags}
            />
          );
        })}
      </div>
    </div>
  );
}
