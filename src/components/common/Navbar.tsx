// src/components/common/Navbar.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import './Navbar.css'; // Kita akan buat file CSS-nya

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Arahkan ke login setelah logout [cite: 22]
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <NavLink to="/">IT Literature Shop</NavLink>
      </div>
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <NavLink to="/books">Buku</NavLink>
            <NavLink to="/transactions">Transaksi</NavLink> [cite: 25]
            <NavLink to="/checkout">
              Keranjang ({getTotalItems()})
            </NavLink>
            <span className="nav-user">Halo, {user?.email}</span> [cite: 25]
            <button onClick={handleLogout} className="nav-logout">
              Logout
            </button> [cite: 21]
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;