import React, { useEffect, useState } from "react";
import '../../styles/navbar.css'

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
      <a href="/" className="navbar-title">
        Curated Finds
      </a>

      <div className="navbar-actions">
        {/* Add New Post Button */}
        {!isFormVisible && (
          <button onClick={toggleFormVisibility} className="navbar-button">
            +
          </button>
        )}

        {/* Theme Toggle */}
        <div className="theme-toggle-wrapper" onClick={toggleTheme}>
          <span className="icon">{isDarkMode ? "🌜" : "☀️"}</span>
          <div className="theme-toggle">
            <div className={`toggle-slider ${isDarkMode ? "dark" : ""}`}></div>
          </div>
        </div>
      </div>
    </nav>
  );
}
