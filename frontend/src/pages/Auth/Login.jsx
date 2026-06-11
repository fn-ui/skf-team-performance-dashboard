import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate("/");
    } catch (err) {
      alert(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Sign in</h2>

        <label className="block text-sm mb-2">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded px-3 py-2 border mb-3" />

        <label className="block text-sm mb-2">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded px-3 py-2 border mb-4" />

        <div className="flex justify-end">
          <button className="rounded-2xl bg-emerald-600 px-4 py-2 text-white">Sign in</button>
        </div>
      </form>
    </div>
  );
}
