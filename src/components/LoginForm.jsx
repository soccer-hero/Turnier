import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/api';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Login fehlgeschlagen');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
}
