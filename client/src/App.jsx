import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Lobby from './pages/Lobby.jsx'
import Game from './pages/Game.jsx'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/lobby" element={<PrivateRoute><Lobby /></PrivateRoute>} />
      <Route path="/game" element={<PrivateRoute><Game /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}