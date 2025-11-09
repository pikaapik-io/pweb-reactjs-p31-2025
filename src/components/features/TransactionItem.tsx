// src/components/features/TransactionItem.tsx
import { useNavigate } from "react-router-dom";
import type { Transaction } from "../../types/api";

interface TransactionItemProps {
  transaction: Transaction;
}

// Komponen ini kita desain untuk menjadi sebuah 'table row' (<tr>)
const TransactionItem = ({ transaction: trx }: TransactionItemProps) => {
  const navigate = useNavigate();

  return (
    <tr>
      <td>{trx.id}</td>
      <td>{new Date(trx.created_at).toLocaleString("id-ID")}</td>
      <td>{trx.total_quantity}</td>
      <td>Rp {trx.total_price.toLocaleString("id-ID")}</td>
      <td>
        <button
          onClick={() => navigate(`/transactions/${trx.id}`)}
          style={{
            background: "rgba(59, 130, 246, 0.1)",
            color: "#93c5fd",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)";
          }}
        >
          Lihat Detail
        </button>
      </td>
    </tr>
  );
};

export default TransactionItem;
