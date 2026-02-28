import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import HomePage from "./components/HomePage";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
