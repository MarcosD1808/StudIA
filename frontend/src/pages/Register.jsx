import { useState } from "react";
import { createUser } from "../api/users";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const validate = () => {
    if (form.name.trim().length < 2) return "Nombre muy corto";
    if (!isEmail(form.email)) return "Email inválido";
    if (form.password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setErr(v);
    setErr(""); setLoading(true);
    try {
      await createUser(form);
      // Ejemplo: marcar auth dummy y redirigir
      localStorage.setItem("auth", "true"); // solo flag, NUNCA guardes tokens reales aquí
      nav("/home");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Crear cuenta</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2 rounded" name="name" placeholder="Nombre" value={form.name} onChange={onChange} />
        <input className="w-full border p-2 rounded" name="email" placeholder="Email" value={form.email} onChange={onChange} />
        <input className="w-full border p-2 rounded" name="password" type="password" placeholder="Contraseña" value={form.password} onChange={onChange} />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button disabled={loading} className="w-full border p-2 rounded">{loading ? "Creando..." : "Registrarme"}</button>
      </form>
      <p className="text-sm mt-3">¿Ya tenés cuenta? <Link to="/login" className="underline">Iniciar sesión</Link></p>
    </div>
  );
}