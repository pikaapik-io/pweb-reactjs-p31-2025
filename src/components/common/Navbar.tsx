// src/components/common/Navbar.tsx (VERSI BARU, RESPONSif)

import { useState } from "react"; // 1. Import useState
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import "./Navbar.css"; // Pastikan ini di-import

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 2. State untuk menu mobile

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); // 3. Tutup menu saat logout
    navigate("/login");
  };

  const closeMenu = () => {
    setIsMenuOpen(false); // 4. Fungsi untuk menutup menu
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <NavLink to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="navbar-brand-icon">📚</span>
          IT Literature Shop
        </NavLink>

        {/* Tombol Hamburger (Hanya muncul di mobile) */}
        <button className="navbar-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {/* Ganti ikon berdasarkan state */}
          {isMenuOpen ? "✕" : "☰"}
        </button>

        {/* Nav Links (Tambahkan class 'active' jika menu terbuka) */}
        <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
          {isAuthenticated ? (
            <>
              <NavLink to="/books" className="nav-link" onClick={closeMenu}>
                Buku
              </NavLink>
              <NavLink to="/transactions" className="nav-link" onClick={closeMenu}>
                Transaksi
              </NavLink>
              <NavLink to="/checkout" className="nav-link nav-link-cart" onClick={closeMenu}>
                Keranjang
                {getTotalItems() > 0 && (
                  <span className="cart-badge">{getTotalItems()}</span>
                )}
              </NavLink>

              <div className="nav-divider" />

              <span className="nav-user">👤 {user?.username}</span>

              <button className="nav-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-auth-btn-login" onClick={closeMenu}>
                Login
              </NavLink>
              <NavLink to="/register" className="nav-auth-btn-register" onClick={closeMenu}>
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;