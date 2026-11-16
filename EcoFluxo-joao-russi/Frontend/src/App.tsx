import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

import Home from './Pages/Home';
import Login from './Pages/Login';
import Verify2FA from './Pages/Verify2FA';

import api from "./utils/api";

function AppContent() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await api.get("/me"); 
        if (response.status === 200) {
          setUser(response.data.usuario || response.data); 
        }
      } catch (error: any) {
        if (error.response?.status !== 402 && error.response?.status !== 401) {
          console.log("Sessão não encontrada:", error);
        }
        setUser(null);
      } finally {
        setLoading(false); 
      }
    };
    checkUserSession();
  }, []);

  const handleLogout = async () => {
    try{
      await api.post("/logout"); 
    }
    catch(error){
      console.error("Erro ao deslogar:", error);
    }
    finally
    {
    setUser(null);
    navigate("/"); 
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-emerald-600 text-lg font-semibold">
        Carregando EcoFluxo...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 font-sans">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="grow w-full pt-32 pb-20 flex flex-col justify-center"> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/verify-2fa" element={user ? <Navigate to="/dashboard" /> : <Verify2FA onLoginSuccess={(u: any) => setUser(u)} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer /> 
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}