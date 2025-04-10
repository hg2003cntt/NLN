import React, { useState } from "react";
import logo from "./logo/logo.jpg"

export function PsychologyCareFooter() {
  const footerStyle = {
    backgroundColor: "#f8f9fa",
    padding: "20px 0",
    // margin: "16px",
    borderRadius: "8px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  };

  const footerTopStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  };

  const logoStyle = {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  };

  const logoImageStyle = {
    height: "40px",
    marginRight: "10px",
  };

  const logoTextStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  };

  const menuStyle = {
    listStyle: "none",
    display: "flex",
    gap: "20px",
    padding: "0",
    margin: "0",
  };

  const menuItemStyle = {
    display: "inline",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#555",
    fontSize: "16px",
    transition: "color 0.3s",
  };

  const hrStyle = {
    margin: "20px 0",
    border: "0",
    height: "1px",
    backgroundColor: "#ddd",
  };

  const footerBottomStyle = {
    textAlign: "center",
    fontSize: "14px",
    color: "#666",
  };

  const menuItems = [
    { name: "About", href: "/home" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Licensing", href: "/licensing" },
    { name: "Contact", href: "/contact" },
  ];

  // Xử lý hiệu ứng hover
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={footerTopStyle}>
          <a href="/home" style={logoStyle}>
            <img src={logo} alt="Psychology Care Logo" style={logoImageStyle} />
            <span style={logoTextStyle}>Psychology Care</span>
          </a>
          <ul style={menuStyle}>
            {menuItems.map((item, index) => (
                <li key={index} style={menuItemStyle}>
                {item.href ? (
                    <a
                    href={item.href}
                    style={{
                        ...linkStyle,
                        color: hoveredIndex === index ? "#007bff" : "#555",
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    >
                    {item.name}
                    </a>
                ) : (
                    <button
                    onClick={() => console.log(`Navigate to ${item.name}`)}
                    style={{
                        background: "none",
                        border: "none",
                        color: "#555",
                        fontSize: "16px",
                        cursor: "pointer",
                        textDecoration: "underline",
                    }}
                    >
                    {item.name}
                    </button>
                )}
                </li>
            ))}
            </ul>
        </div>
        <hr style={hrStyle} />
        <div style={footerBottomStyle}>
          <span>© 2025 <a href="/home" style={linkStyle}>Psychology Care™</a>. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
}