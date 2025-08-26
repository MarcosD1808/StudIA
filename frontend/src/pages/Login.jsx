import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) return setError('Email inválido');
    if (pass.length < 6) return setError('La contraseña debe tener 6+ caracteres');

    // TODO: acá luego llamamos a la API real: POST /api/auth/login
    // Por ahora, login dummy:
    localStorage.setItem('auth', 'true');
    nav('/profile');
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <input
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border rounded-lg p-2"
        />
        <input
          type="password"
          value={pass}
          onChange={(e)=>setPass(e.target.value)}
          placeholder="Contraseña"
          className="w-full border rounded-lg p-2"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full rounded-xl p-2 font-medium border hover:bg-gray-50">Ingresar</button>
      </form>
    </div>
  );
}