// src/App.tsx
import { Outlet } from 'react-router-dom';
import Navbar from './components/common/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="container">
        <Outlet /> {/* Halaman (Page) akan di-render di sini */}
      </main>
    </div>
  );
}

export default App;