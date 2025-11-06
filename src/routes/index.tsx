// src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';

// Layout Utama
import App from '../App';

// Komponen Proteksi
import ProtectedRoute from '../components/common/ProtectedRoute';

// Halaman
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import BooksListPage from '../pages/Books/BooksListPage';
import BookDetailPage from '../pages/Books/BookDetailPage';
import AddBookPage from '../pages/Books/AddBookPage';
import TransactionsListPage from '../pages/Transactions/TransactionListPage';
import TransactionDetailPage from '../pages/Transactions/TransactionsDetailPage';
import CheckoutPage from '../pages/CheckoutPage.tsx';

export const router = createBrowserRouter([
  // Rute Publik (Login & Register)
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },

  // Rute Terproteksi (Semua halaman lain)
  {
    path: '/',
    element: <ProtectedRoute />, // Cek autentikasi
    children: [
      {
        element: <App />, // Tampilkan Navbar + Layout
        children: [
          {
            path: '/', // Halaman utama
            element: <BooksListPage />,
          },
          {
            path: '/books',
            element: <BooksListPage />,
          },
          {
            path: '/books/add',
            element: <AddBookPage />,
          },
          {
            path: '/books/:id',
            element: <BookDetailPage />,
          },
          {
            path: '/transactions',
            element: <TransactionsListPage />,
          },
          {
            path: '/transactions/:id',
            element: <TransactionDetailPage />,
          },
          {
            path: '/checkout',
            element: <CheckoutPage />,
          },
        ],
      },
    ],
  },
]);