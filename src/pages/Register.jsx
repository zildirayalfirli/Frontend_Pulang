import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { post } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordAgain) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const request = await post('/api/auth/register', { username, password, passwordAgain });
      const response = request.data;
      if (request.status === 200) {
        toast.success(response.message);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    <>
      <div className='register-container'>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className='input-group'>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='input-group'>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='input-group'>
            <label htmlFor="passwordAgain">Confirm Password</label>
            <input
              type="password"
              id="passwordAgain"
              onChange={(e) => setPasswordAgain(e.target.value)}
            />
          </div>
          <button type='submit'>Register</button>
          <p className='register-link'>
            Already have an account? <Link to={'/login'}>Login here</Link>
          </p>
        </form>
      </div>
    </>
  );
}
