import React, { useState, useEffect, useRef } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";

export default function ListOfFoundThings({ items, onDelete, isFormVisible, toggleFormVisibility }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [previews, setPreviews] = useState({});
  const [showMenu, setShowMenu] = useState({});
  const menuRef = useRef(null);

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
    items.forEach((item) => {
      if (item.productURL && !previews[item._id]) {
        fetchPreviewData(item.productURL, item._id);
      }
    });
  }, [items]);

  const columns = React.useMemo(
    () => [
      { Header: "Title", accessor: "title" },
      { Header: "Product URL", accessor: "productURL" },
      { Header: "Price", accessor: "price" },
    ],
    []
  );

  const { rows, prepareRow, setGlobalFilter: setTableGlobalFilter, toggleSortBy } = useTable(
    { columns, data: items, globalFilter },
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
    }
  };

  const toggleMenu = (id) => {
    setShowMenu((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {isFormVisible && (
        <div className="post-form form-visible">
          <button className="close-form" onClick={toggleFormVisibility}>
            Close Form
          </button>
          <p>Your form content goes here.</p>
        </div>
      )}

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
        </select>
      </div>

      <div className="grid-container">
        {rows.map((row) => {
          prepareRow(row);
          const { title, productURL, price } = row.original;
          const previewData = previews[row.original._id];
          const isMenuOpen = showMenu[row.original._id];

          return (
            <div className="card" key={row.id}>
              <button className="menu-button" onClick={() => toggleMenu(row.original._id)}>
                ⋮
              </button>
              {isMenuOpen && (
                <div className="card-menu show" ref={menuRef}>
                  <div className="card-menu-close">
                    <div className="close-mini">
                    <button
                      onClick={() => setShowMenu({})} 
                      className="close-button" id="close-mini-menu"
                    >
                      X
                    </button>
                    </div>
                  </div>
                  <button className="del-btn" onClick={() => onDelete(row.original._id)}>Delete</button>
                </div>
              )}

              <h3 className="card-title">{title}</h3>

              {previewData?.images && (
                <div className="preview-thumbnails">
                  {previewData.images.slice(0, 4).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="preview-thumbnail"
                    />
                  ))}
                </div>
              )}

              <p className="card-price">{price ? `$${price}` : "N/A"}</p>

              {productURL && (
                <a href={productURL} target="_blank" rel="noopener noreferrer" className="card-link">
                  View Product
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
