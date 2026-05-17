import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
        console.log("ENV:-> ",import.meta.env.VITE_API_URL)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      navigate('/login')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24 }}>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        {['username', 'email', 'password'].map(field => (
          <div key={field} style={{ marginBottom: 12 }}>
            <input
              type={field === 'password' ? 'password' : 'text'}
              placeholder={field}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              style={{ width: '100%', padding: 8 }}
            />
          </div>
        ))}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: 10 }}>Registrarse</button>
      </form>
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </div>
  )
}