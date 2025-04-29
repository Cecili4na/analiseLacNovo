import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import NovoTesteAnalista from './pages/NovoTesteAnalista';
import Testes from './pages/Testes';
import TestDetails from './pages/TestDetails';
import Perfil from './pages/Perfil';
import EditarPerfil from './pages/EditarPerfil';
import Teoria from './pages/Teoria';
import ResponderTeste from './pages/ResponderTeste';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen w-screen flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/novoTesteAnalista" element={<PrivateRoute><NovoTesteAnalista /></PrivateRoute>} />
            <Route path="/testes" element={<PrivateRoute><Testes /></PrivateRoute>} />
            <Route path="/testes/:id" element={<PrivateRoute><TestDetails /></PrivateRoute>} />
            <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
            <Route path="/perfil/editar" element={<PrivateRoute><EditarPerfil /></PrivateRoute>} />
            <Route path="/teoria" element={<PrivateRoute><Teoria /></PrivateRoute>} />
            <Route path="/responderTeste/:id" element={<ResponderTeste />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
