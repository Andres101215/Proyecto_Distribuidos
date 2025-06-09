import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Eleccion from './pages/eleccion'; // tu clase de votación
import AdminEleccion from './pages/adminEleccion';
import AdminVotantes from './pages/adminVotantes';
import AdminsCandidatos from './pages/adminCandidatos';
import Registro from './components/component';
import VotacionRepresentantes from './pages/votaciónRepresentantes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/eleccion" element={<Eleccion />} />
        <Route path="/admin" element={<AdminEleccion />} />
        <Route path="/votacion" element={<VotacionRepresentantes />} />
        <Route path="/admin/elecciones" element={<AdminEleccion />} />
        <Route path="/admin/votantes" element={<AdminVotantes />} />
        <Route path="/admin/candidatos" element={<AdminsCandidatos />} />
      </Routes>
    </Router>
  );
}

export default App;

