import React, { useState, useMemo } from "react";
import { useTable, useSortBy } from "react-table";
import ProductCard from "@/components/ProductCard";
import "../../styles/ListOfFoundThings.css";

const columns = [
  { Header: "Title", accessor: "title" },
  { Header: "Product URL", accessor: "productURL" },
  { Header: "Price", accessor: "price" },
  { Header: "Date Uploaded", accessor: "createdAt" },
];

export default function ListOfFoundThings({ items, onDelete, onEdit }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState({});
  const [selectedTag, setSelectedTag] = useState("");

  const filteredItems = useMemo(() => {
    return selectedTag
      ? items.filter((item) => {
          const matchesTag = selectedTag ? item.tags?.includes(selectedTag) : true;
          const matchesSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.price.toString().includes(searchQuery);
          return matchesTag && matchesSearch;
        })
      : items;
  }, [selectedTag, items]);

  const handleTagFilter = (tag) => {
    setSelectedTag(tag);
  };

  const uniqueTags = [...new Set(items.flatMap((item) => item.tags || []))].filter((tag) => tag.trim() !== "");
  //inside useTable there will be a place to default the sort
  const { rows, prepareRow, toggleSortBy } = useTable({ columns, data: filteredItems }, useSortBy);


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

  return (
    <div>
      <div className="filter-controls">
        <input
          type="text"
          placeholder="Search by title or price..."
          value={searchQuery}
          onChange={handleSearch}
          className="filter-input"
        />
        <select onChange={handleSortChange} className="sort-select" defaultValue="dateNewest">
          <option value="title">Sort (A to Z)</option>
          <option value="priceLow">Price Low to High</option>
          <option value="priceHigh">Price High to Low</option>
          <option value="dateNewest">Newest First</option>
          <option value="dateOldest">Oldest First</option>
        </select>
        <select onChange={(e) => handleTagFilter(e.target.value)} value={selectedTag} className="tag-filter-select">
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
          const { title, productURL, price, tags, imageUrl } = row.original;
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
              imageUrl={imageUrl}
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
