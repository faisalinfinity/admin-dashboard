import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      document.cookie = "token=valid; path=/";
      router.push('/dashboard');
    } else {
      alert('Invalid Password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-gray-800">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md space-y-4">
        <h1 className="text-xl font-bold">Admin Login</h1>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
