import React, { useState, useEffect, useRef } from "react";
import { useTable, useSortBy } from "react-table";
import ProductCard from "@/components/ProductCard";
import client from '../../lib/sanityClient';
import "../../styles/ListOfFoundThings.css";

export default function ListOfFoundThings({ items, onDelete, onEdit }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [previews, setPreviews] = useState({});
  const [showMenu, setShowMenu] = useState({});
  const [selectedTag, setSelectedTag] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  const fetchedURLs = useRef(new Set());
  const isInitialRender = useRef(true);
  const [showFilters, setShowFilters] = useState(true);

  // Fetch preview data
  const fetchPreviewData = async (url, itemId) => {
    if (!url || fetchedURLs.current.has(itemId)) {
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // Increase timeout

      const response = await fetch(
        `/api/fetchPreview?url=${encodeURIComponent(url)}&t=${Date.now()}`,
        { 
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch preview: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Only update if we got valid data
      if (data && (data.images?.length > 0 || data.title)) {
        setPreviews(prev => ({ ...prev, [itemId]: data }));
        fetchedURLs.current.add(itemId);
      }
    } catch (error) {
      console.error(`Error fetching preview for URL ${url}:`, error.message);
      // Don't cache failed attempts
      setPreviews(prev => ({
        ...prev,
        [itemId]: {
          title: "Preview Unavailable",
          description: "Unable to load preview data",
          images: []
        },
      }));
    }
  };

  const handleTagFilter = (tag) => {
    setSelectedTag(tag);
    const filtered = items.filter((item) => {
      const matchesTag = tag ? item.tags?.includes(tag) : true;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.price.toString().includes(searchQuery);
      return matchesTag && matchesSearch;
    });
    setFilteredItems(filtered);
  };

  // Fetch previews and apply filters
  useEffect(() => {
    const fetchBatch = async (items) => {
      for (const item of items) {
        if (item.productURL && !previews[item._id] && !fetchedURLs.current.has(item._id)) {
          await fetchPreviewData(item.productURL, item._id);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Increase delay between requests
        }
      }
    };

    // Reset fetchedURLs when items change
    fetchedURLs.current = new Set();

    const unfetchedItems = items.filter(
      item => item.productURL && !previews[item._id]
    );

    // Process in smaller batches
    const batchSize = 2;
    for (let i = 0; i < unfetchedItems.length; i += batchSize) {
      const batch = unfetchedItems.slice(i, i + batchSize);
      fetchBatch(batch);
    }

    handleTagFilter(selectedTag);

    // Cleanup function
    return () => {
      fetchedURLs.current.clear();
    };
  }, [items]);

  const uniqueTags = [...new Set(items.flatMap((item) => item.tags || []))].filter((tag) => tag.trim() !== "");

  const columns = React.useMemo(
    () => [
      { Header: "Title", accessor: "title" },
      { Header: "Product URL", accessor: "productURL" },
      { Header: "Price", accessor: "price" },
      { Header: "Date Uploaded", accessor: "createdAt" },
    ],
    []
  );

  const { rows, prepareRow, toggleSortBy } = useTable({ columns, data: filteredItems }, useSortBy);

  // Set default sorting to "dateNewest" only on initial render
  useEffect(() => {
    if (isInitialRender.current) {
      toggleSortBy("createdAt", true);
      isInitialRender.current = false;
    }
  }, [toggleSortBy]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
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

  const toggleFilters = () => setShowFilters(!showFilters);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title header-font">Curated Finds</h1>
        <p className="page-subtitle">Discover hand-picked products worth sharing</p>
      </div>
      <div className="filters-section">
        <button 
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={toggleFilters}
          aria-label={showFilters ? 'Hide filters' : 'Show filters'}
        >
          <span className="filter-toggle-text">Filters</span>
          <span className="filter-toggle-icon">{showFilters ? '▼' : '▲'}</span>
        </button>
        <div className={`filter-controls ${showFilters ? 'show' : ''}`}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="filter-input"
          />
          <div className="dropdown-container">
            <select 
              onChange={handleSortChange} 
              className="sort-select" 
              defaultValue="dateNewest"
            >
              <option value="title">A-Z</option>
              <option value="priceLow">Price ↑</option>
              <option value="priceHigh">Price ↓</option>
              <option value="dateNewest">Newest</option>
              <option value="dateOldest">Oldest</option>
            </select>
            <select 
              onChange={(e) => handleTagFilter(e.target.value)} 
              value={selectedTag} 
              className="tag-filter-select"
            >
              <option value="">All Tags</option>
              {uniqueTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="grid-container">
        {rows.map((row) => {
          prepareRow(row);
          const { title, productURL, price, tags, imageUrl } = row.original;
          const previewData = previews[row.original._id];
          const isMenuOpen = showMenu[row.original._id];
          
          // Debug log to check what data we're getting
          console.log('Row data:', {
            id: row.original._id,
            title,
            imageUrl: row.original.imageUrl,
            previewData
          });

          const toggleMenu = () =>
            setShowMenu((prev) => ({
              ...prev,
              [row.original._id]: !prev[row.original._id],
            }));

          return (
            <ProductCard
              key={row.original._id}
              title={title}
              description={row.original.description}
              productURL={productURL}
              price={price}
              previewData={previewData}
              isMenuOpen={isMenuOpen}
              toggleMenu={toggleMenu}
              onDelete={() => onDelete(row.original._id)}
              onEdit={() => onEdit(row.original)}
              tags={tags}
              mainImage={row.original.mainImage}
              postId={row.original._id}
            />
          );
        })}
      </div>
    </div>
  );
}
