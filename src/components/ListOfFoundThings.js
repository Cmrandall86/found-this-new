import React, { useState } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";

export default function ListOfFoundThings({ items, onDelete }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sortField, setSortField] = useState("title");

  const columns = React.useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Description",
        accessor: "description",
      },
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

  const {
    rows,
    prepareRow,
    setGlobalFilter: setTableGlobalFilter,
    toggleSortBy,
  } = useTable(
    {
      columns,
      data: items,
      globalFilter,
    },
    useGlobalFilter,
    useSortBy
  );

  // Handle keyword search
  const handleSearch = (e) => {
    setGlobalFilter(e.target.value);
    setTableGlobalFilter(e.target.value);
  };

  // Handle sorting change
  const handleSortChange = (e) => {
    const field = e.target.value;
    setSortField(field);
    toggleSortBy(field, false); // `false` sets ascending order
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
        <select value={sortField} onChange={handleSortChange} className="sort-select">
          <option value="title">Sort by Title</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>

      {/* Card Grid */}
      <div className="grid-container">
        {rows.map((row) => {
          prepareRow(row);
          const { title, description, productURL, price } = row.values;

          return (
            <div className="card" key={row.id}>
              <h3 className="card-title">{title}</h3>
              <p className="card-description">{description}</p>
              {productURL && (
                <a href={productURL} target="_blank" rel="noopener noreferrer" className="card-link">
                  View Product
                </a>
              )}
              <p className="card-price">{price ? `$${price}` : "N/A"}</p>
              <button onClick={() => onDelete(row.id)} className="card-delete">
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
