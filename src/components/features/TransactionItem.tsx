// src/components/features/TransactionItem.tsx
import { useNavigate } from 'react-router-dom';
import type { Transaction } from '../../types/api';

interface TransactionItemProps {
  transaction: Transaction;
}

// Komponen ini kita desain untuk menjadi sebuah 'table row' (<tr>)
const TransactionItem = ({ transaction: trx }: TransactionItemProps) => {
  const navigate = useNavigate();

  return (
    <tr>
      <td>{trx.id}</td>
      <td>{new Date(trx.createdAt).toLocaleString()}</td>
      <td>{trx.totalAmount}</td>
      <td>Rp {trx.totalPrice.toLocaleString()}</td>
      <td>
        <button onClick={() => navigate(`/transactions/${trx.id}`)}>
          Lihat Detail
        </button>
      </td>
    </tr>
  );
};

export default TransactionItem;