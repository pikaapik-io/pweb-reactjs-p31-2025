// src/components/features/BookCard.tsx
import { Link } from 'react-router-dom';
import type { Book } from '../../types/api';
import type { MouseEvent } from 'react';
import './BookCard.css'; // Kita buat CSS-nya

interface BookCardProps {
  book: Book;
  onDelete: (id: number) => void; // Fungsi untuk handle hapus
}

const BookCard = ({ book, onDelete }: BookCardProps) => {
  const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Mencegah navigasi saat klik tombol
    if (window.confirm(`Yakin ingin menghapus ${book.title}?`)) {
      onDelete(book.id);
    }
  };

  return (
    <Link to={`/books/${book.id}`} className="book-card">
      {/* (Optional) Jika kamu nambah 'book_image' [cite: 55] */}
      {/* <img src={book.book_image || 'default-placeholder.jpg'} alt={book.title} className="book-card-image" /> */}
      
      <div className="book-card-content">
        <span className="book-card-genre">{book.genre.name}</span>
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-writer">{book.writer}</p>
        
        <div className="book-card-footer">
          <span className="book-card-price">Rp {book.price.toLocaleString()}</span>
          <span className="book-card-stock">Stok: {book.stock}</span>
        </div>
      </div>
      
      <button onClick={handleDeleteClick} className="book-card-delete">
        Hapus
      </button>
    </Link>
  );
};

export default BookCard;