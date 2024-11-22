import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// for backend routes 
import axios from 'axios';
import axiosInstance from '../../axios/axiosSetup';

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    try {
      const res = await axiosInstance.post('/auth/signup',formData);
      const token = res.data.token;
      localStorage.setItem('token',token)
      navigate('/userDashboard')
    }catch(err){
      console.log("Error with signing up",err)
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          username
        </label>
        <input
          id="username"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="John Doe"
          required
          value={formData.username}
          onChange={handleChange}
        />
      </div>
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
      <div className='space-y-2'>
        <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700'>
          Confirm Password
        </label>
        <input
          id='confirmPassword'
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
          required
          type='password'
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>
      {!passwordMatch && (
        <p className="text-red-500 text-sm">Passwords do not match</p>
      )}
      <button
        className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        type="submit"
      >
        Sign Up
      </button>
    </form>
  )
}