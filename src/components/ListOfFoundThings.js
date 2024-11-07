import React, { useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";

export default function ListOfFoundThings({ items, onDelete }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [previews, setPreviews] = useState({});

  // Fetch preview data for an item
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

  // Fetch previews for items that don't already have them in the local state
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
      { Header: "Description", accessor: "description" },
      {
        Header: "Product URL",
        accessor: "productURL",
        Cell: ({ value }) =>
          value ? (
            <a href={value} target="_blank" rel="noopener noreferrer">
              View Product
            </a>
          ) : null,
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value }) => (value ? `$${value}` : "N/A"),
      },
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
      toggleSortBy("title", false); // Sort by title in ascending order
    } else if (value === "priceLow") {
      toggleSortBy("price", false); // Sort by price in ascending order (low to high)
    } else if (value === "priceHigh") {
      toggleSortBy("price", true); // Sort by price in descending order (high to low)
    }
  };

  return (
    <div>
      {/* Filter and Sort Controls */}
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

      {/* Card Grid */}
      <div className="grid-container">
        {rows.map((row) => {
          prepareRow(row);
          const { title, description, productURL, price } = row.original;
          const previewData = previews[row.original._id];

          return (
            <div className="card" key={row.id}>
              <h3 className="card-title">{title}</h3>
              <p className="card-description">{description}</p>

              {/* Render preview fields */}
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
              {previewData?.title && <h4 className="preview-title">{previewData.title}</h4>}
              {previewData?.description && <p className="preview-description">{previewData.description}</p>}

              {productURL && (
                <a href={productURL} target="_blank" rel="noopener noreferrer" className="card-link">
                  View Product
                </a>
              )}
              <p className="card-price">{price ? `$${price}` : "N/A"}</p>
              <button onClick={() => onDelete(row.original._id)} className="card-delete">
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
