import React, { useState } from "react";
import { useTable, useSortBy } from "react-table";

export default function ListOfFoundThings({ items, onDelete }) {
  const [searchKeyword, setSearchKeyword] = useState("");

  // Define columns for React Table
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
              Click here to view product
            </a>
          ) : null,
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value }) => (value ? `$${value}` : "N/A"),
      },
      {
        Header: "Actions",
        accessor: "_id",
        Cell: ({ value }) => (
          <button
            onClick={() =>
              window.confirm("Are you sure you want to delete this item?") &&
              onDelete(value)
            }
          >
            Delete
          </button>
        ),
      },
    ],
    [onDelete]
  );

  // Filter the data based on the search keyword
  const filteredItems = React.useMemo(() => {
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.description.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [items, searchKeyword]);

  // Prepare the table instance with filtered data and columns
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    { columns, data: filteredItems },
    useSortBy
  );

  return (
    <div>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by keyword..."
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        style={{
          marginBottom: "10px",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ddd",
          width: "100%",
          maxWidth: "300px",
        }}
      />

      {/* Table */}
      <table {...getTableProps()} className="found-things-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr key={headerGroup.getHeaderGroupProps().key}>
              {headerGroup.headers.map((column) => {
                const { key, ...headerProps } = column.getHeaderProps(column.getSortByToggleProps());
                return (
                  <th key={key} {...headerProps}>
                    {column.render("Header")}
                    <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            const { key, ...rowProps } = row.getRowProps();
            return (
              <tr key={key} {...rowProps}>
                {row.cells.map((cell) => {
                  const { key, ...cellProps } = cell.getCellProps();
                  return (
                    <td key={key} {...cellProps}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
