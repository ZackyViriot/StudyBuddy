import React, { useState } from "react";
// to connect to backend need axios 
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Try both URLs simultaneously and use whichever responds first
      const res = await Promise.race([
        axios.post('http://localhost:8000/auth/login', formData),
        axios.post('https://study-buddy-backend-ivory.vercel.app/auth/login', formData)
      ]);
      
      const token = res.data.token;
      localStorage.setItem('token', token);
      navigate('/userDashboard');
    } catch (err) {
      setError("Invalid Login");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="m@example.com"
          required
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          required
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        type="submit"
      >
        Login
      </button>
    </form>
  )
}