import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  let BaseUrl = import.meta.env.VITE_Base_Url;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${BaseUrl}/api/user/signup`, {
        name,
        email,
        password,
      });

      if (response.data) {
        console.log('Signup successful', response.data);
        // Optionally, log the user in immediately after signup
        // localStorage.setItem('user', JSON.stringify(response.data.user));
        // navigate('/'); // Navigate to the main chat page or login page
        navigate('/login'); // Redirect user to login page after successful signup
      }
    } catch (error) {
      console.error('Signup error', error.response || error);
      alert('Failed to signup. Please check your details and try again.');
    }
  };

  // Styles (You can reuse or modify the styles from the Login component)
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

  const inputStyle = {
    marginBottom: '10px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  };

  const buttonStyle = {
    padding: '15px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const handlelogin = () => {
    navigate('/login'); // Adjust the path as per your signup page's route
  };

  return (
    <div style={formContainerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign Up</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Sign Up</button>
        <button type="button" onClick={handlelogin} style={{ ...buttonStyle, backgroundColor: '#28a745', marginTop: '10px' }}>Login</button>
      </form>
    </div>
  );
}

export default Signup;
