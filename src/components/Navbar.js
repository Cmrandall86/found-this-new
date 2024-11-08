import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar({ isFormVisible, toggleFormVisibility }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light-mode" : "dark-mode";
    setIsDarkMode(!isDarkMode);
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(newTheme);
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark");
      document.body.classList.add(storedTheme === "dark" ? "dark-mode" : "light-mode");
    } else {
      document.body.classList.add("light-mode");
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo or Title as a Link */}
        <Link href="/" className="navbar-title">
          My App
        </Link>

        {/* Right-Side Buttons */}
        <div className="navbar-actions">
          {/* "Add New Post" button */}
          {!isFormVisible && (
            <button onClick={toggleFormVisibility} className="navbar-button">
              <span className="plus-icon">+</span>
            </button>
          )}

          {/* Theme Toggle */}
          <div className="theme-toggle-wrapper">
            <span className="icon">{isDarkMode ? "🌜" : "☀️"}</span>
            <div className="theme-toggle" onClick={toggleTheme}>
              <div className={`toggle-slider ${isDarkMode ? "dark" : ""}`}></div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
