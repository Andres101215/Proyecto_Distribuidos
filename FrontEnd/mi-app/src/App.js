import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login';
import Eleccion from './eleccion'; // tu clase de votación
import AdminEleccion from './adminEleccion';
import Registro from './component';
import VotacionRepresentantes from './votaciónRepresentantes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/eleccion" element={<Eleccion />} />
        <Route path="/admin" element={<AdminEleccion />} />
        <Route path="/votacion" element={<VotacionRepresentantes />} />
      </Routes>
    </Router>
  );
}

export default App;

