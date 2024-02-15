import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdEmail, MdLock } from 'react-icons/md'; // Import icons

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
        let resuser = response.data.user;
        localStorage.setItem('user', JSON.stringify(resuser));
        navigate('/');
      }
    } catch (error) {
      console.error('Login error', error.response || error);
      alert('Failed to login. Please check your username and password.');
    }
  };

  const formContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width:'100vw',
    backgroundColor:'#e1f6fb'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
    padding: '40px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
  };

  const inputGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    overflow: 'hidden',
  };

  const iconStyle = {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    minWidth: '50px',
    textAlign: 'center',
  };

  const inputStyle = {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    border: 'none',
    outline: 'none',
  };

  const buttonStyle = {
    padding: '15px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#0056b3',
    },
  };

  const handleSignup = () => {
    navigate('/signup'); // Adjust the path as per your signup page's route
  };

  return (
    <div style={formContainerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#007bff' }}>Login to Chat App</h2>
        <div style={inputGroupStyle}>
          <div style={iconStyle}><MdEmail /></div>
          <input
            type="email"
            id="username"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={inputGroupStyle}>
          <div style={iconStyle}><MdLock /></div>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Login</button>
        <button type="button" onClick={handleSignup} style={{ ...buttonStyle, backgroundColor: '#28a745', marginTop: '10px' }}>Sign Up</button>
      </form>
    </div>
  );
}

export default Login;
