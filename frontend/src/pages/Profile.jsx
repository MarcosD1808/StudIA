import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const nav = useNavigate();
  const logout = () => {
    localStorage.removeItem('auth');
    nav('/login');
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Perfil</h2>
      <p className="mt-2">Contenido visible solo si estás autenticado.</p>
      <button onClick={logout} className="mt-4 border rounded-xl px-4 py-2">Salir</button>
    </div>
  );
}