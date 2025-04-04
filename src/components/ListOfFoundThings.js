import React, { useState, useEffect, useRef } from "react";
import { useTable, useSortBy } from "react-table";
import ProductCard from "@/components/ProductCard";
import "../../styles/ListOfFoundThings.css";

export default function ListOfFoundThings({ items, onDelete, onEdit }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [previews, setPreviews] = useState({});
  const [showMenu, setShowMenu] = useState({});
  const [selectedTag, setSelectedTag] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  const fetchedURLs = useRef(new Set());
  const isInitialRender = useRef(true);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch preview data
  const fetchPreviewData = async (url, itemId) => {
    if (!url) {
      console.log('No URL provided for itemId:', itemId);
      return;
    }

    try {
      // Add timestamp to prevent browser caching
      const timestamp = Date.now();
      const response = await fetch(`/api/fetchPreview?url=${encodeURIComponent(url)}&t=${timestamp}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch preview: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || !data.images) {
        throw new Error('Invalid preview data received');
      }

      setPreviews(prev => ({ ...prev, [itemId]: data }));
    } catch (error) {
      console.error('Preview fetch error:', error);
      setPreviews(prev => ({
        ...prev,
        [itemId]: {
          title: "Preview Unavailable",
          description: "Unable to load preview",
          images: ["https://placehold.co/300x300/e6e6e6/666666?text=No+Preview"]
        }
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

  // Reset previews when items change
  useEffect(() => {
    setPreviews({}); // Clear all previews when items change
    
    const fetchAllPreviews = async () => {
      for (const item of items) {
        if (item.productURL) {
          await fetchPreviewData(item.productURL, item._id);
        }
      }
    };

    fetchAllPreviews();
    handleTagFilter(selectedTag);
  }, [items]); // Only depend on items changing

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
    const searchTerm = e.target.value;
    setSearchQuery(searchTerm);
    
    // Filter items based on search term and selected tag
    const filtered = items.filter((item) => {
      const matchesSearch = 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.price?.toString().includes(searchTerm) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTag = selectedTag ? item.tags?.includes(selectedTag) : true;
      
      return matchesSearch && matchesTag;
    });
    
    setFilteredItems(filtered);
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
        <h1 className="page-title">Curated Finds</h1>
        <p className="page-subtitle">Discover Randall's hand-picked products worth sharing</p>
      </div>
      <div className="filters-section">
        <button 
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={toggleFilters}
          aria-label={showFilters ? 'Hide filters' : 'Show filters'}
        >
          <span className="filter-toggle-text">Filter & Sort</span>
          <span className="filter-toggle-icon">{showFilters ? '▼' : '▲'}</span>
        </button>
        <div className={`filter-controls ${showFilters ? 'show' : ''}`}>
          <button 
            className="close-filters"
            onClick={() => setShowFilters(false)}
            aria-label="Close filters"
          >
            ×
          </button>
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <select 
              onChange={handleSortChange} 
              className="sort-select" 
              defaultValue="dateNewest"
            >
              <option value="dateNewest">Newest First</option>
              <option value="dateOldest">Oldest First</option>
              <option value="title">Name (A-Z)</option>
              <option value="priceLow">Price (Low-High)</option>
              <option value="priceHigh">Price (High-Low)</option>
            </select>
            <select 
              onChange={(e) => handleTagFilter(e.target.value)} 
              value={selectedTag} 
              className="tag-filter-select"
            >
              <option value="">All Categories</option>
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
              key={row.original._id}
              title={title}
              description={row.original.description}
              productURL={productURL}
              price={price}
              previewImage={row.original.previewImage}
              previewTitle={row.original.previewTitle}
              previewDescription={row.original.previewDescription}
              isMenuOpen={isMenuOpen}
              toggleMenu={toggleMenu}
              onDelete={() => onDelete(row.original._id)}
              onEdit={() => onEdit(row.original)}
              tags={tags}
              postId={row.original._id}
            />
          );
        })}
      </div>
    </div>
  );
}
