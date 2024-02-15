import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  let BaseUrl = import.meta.env.VITE_Base_Url;


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${BaseUrl}/api/user/login`, {

        email: username,
        password,
      });

      if (response.data) {
        console.log('Login successful', response.data);
        let resuser=response.data.user;
        localStorage.setItem('user',JSON.stringify(resuser));
        navigate('/');
      }
    } catch (error) {
      console.error('Login error', error.response || error);
      alert('Failed to login. Please check your username and password.');
    }
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    margin: 'auto',
    marginTop: '100px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const inputStyle = {
    marginBottom: '10px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  };

  const buttonStyle = {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <div style={{"width":"100vw"}}>
    <form onSubmit={handleSubmit} style={formStyle}>
      <div>
        <label htmlFor="username">Email:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
      </div>
      <button type="submit" style={buttonStyle}>Login</button>
    </form>
    </div>
  );
}

export default Login;
