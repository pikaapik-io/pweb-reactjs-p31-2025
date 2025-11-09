// src/components/common/Navbar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import "./Navbar.css"; // Kita akan buat file CSS-nya

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Arahkan ke login setelah logout [cite: 22]
  };

  // Bagian return() untuk Navbar.tsx
// Copy paste bagian ini ke dalam component Navbar Anda

return (
  <nav style={{
    background: 'rgba(30, 41, 59, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '0 2rem',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  }}>
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '70px'
    }}>
      {/* Brand / Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <NavLink
          to="/"
          style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#93c5fd';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'white';
          }}
        >
          <span style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            padding: '0.5rem 0.75rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            📚
          </span>
          IT Literature Shop
        </NavLink>
      </div>

      {/* Nav Links */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        {isAuthenticated ? (
          <>
            <NavLink
              to="/books"
              style={({ isActive }) => ({
                color: isActive ? '#93c5fd' : 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                padding: '0.625rem 1rem',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent'
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.className.includes('active')) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.className.includes('active')) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                }
              }}
            >
              Buku
            </NavLink>

            <NavLink
              to="/transactions"
              style={({ isActive }) => ({
                color: isActive ? '#93c5fd' : 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                padding: '0.625rem 1rem',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent'
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.className.includes('active')) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.className.includes('active')) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                }
              }}
            >
              Transaksi
            </NavLink>

            <NavLink
              to="/checkout"
              style={({ isActive }) => ({
                color: isActive ? '#93c5fd' : 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                padding: '0.625rem 1rem',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                position: 'relative'
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.className.includes('active')) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.className.includes('active')) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                }
              }}
            >
               Keranjang
              {getTotalItems() > 0 && (
                <span style={{
                  background: '#ef4444',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '12px',
                  minWidth: '20px',
                  textAlign: 'center'
                }}>
                  {getTotalItems()}
                </span>
              )}
            </NavLink>

            {/* Divider */}
            <div style={{
              width: '1px',
              height: '24px',
              background: 'rgba(255, 255, 255, 0.2)',
              margin: '0 0.5rem'
            }} />

            {/* User Info */}
            <span style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.95rem',
              padding: '0.625rem 1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              fontWeight: '500'
            }}>
              👤 {user?.username}
            </span>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '0.625rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                e.currentTarget.style.color = '#fecaca';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                e.currentTarget.style.color = '#fca5a5';
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              style={({ isActive }) => ({
                color: isActive ? '#93c5fd' : 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                padding: '0.625rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              })}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              style={({ isActive }) => ({
                color: 'white',
                textDecoration: 'none',
                padding: '0.625rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                background: isActive ? '#2563eb' : '#3b82f6',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
              })}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2563eb';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#3b82f6';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
              }}
            >
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
