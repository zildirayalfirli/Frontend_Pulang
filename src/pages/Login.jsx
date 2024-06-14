import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../redux/AuthSlice';
import logologin from '../assets/logologin.svg';

export default function Login() {
  const user = useSelector((state) => state.Auth);
  console.log(user);
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username, password);
    try {
      const request = await post('/api/auth/login', { username, password });
      const response = request.data;

      if (request.status === 200) {
        if (response.user.role === 'admin') {
          navigate('/admin');
        } else if (response.user.role === 'user') {
          navigate('/');
        }
        toast.success(response.message);
        dispatch(SetUser(response.user));
      }
      console.log(response);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 404) {
        toast.error(error.response.data.message || 'Username Or Password Is Incorect');
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    }
  };

return (
  <div className='h-screen bg-secondary-300 flex flex-col gap-y-24'>
    <div className='mt-20 flex justify-center'>
      <img src={logologin} alt="logo login" className="w-1/4 h-auto" />
    </div>

    <div className='flex justify-center items-center'>
      <div className='h-[500px] w-[500px] p-8 bg-white rounded-xl border-2 border-black'>
        <div className='w-full h-full gap-y-8 flex flex-col items-center justify-center'>
          <div className='text-black text-heading-3'>
            <h2>Login</h2>
          </div>

          
          <form className='w-4/5 flex flex-col gap-y-8' onSubmit={handleSubmit}>
            <div className='w-full flex flex-col gap-y-2'>
              <label className='text-heading-6' htmlFor="username">Username</label>
              <input
              className='text-body-xl border-2 border-[#EE7F2B] rounded-lg h-12 placeholder:text-slate-400 px-4'
              placeholder="Enter Username"
              type="text"
              id="username"
              onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className='w-full flex flex-col gap-y-2'>
              <label className='text-heading-6' htmlFor="password">Password</label>
              <input
              className='text-body-xl border-2 border-[#EE7F2B] rounded-lg h-12 placeholder:text-slate-400 px-4'
              placeholder="Enter Password"
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              />
            </div>
    
            <div className='bg-[#EE7F2B] hover:bg-[#B86323] rounded-lg p-4 mt-2 flex justify-center text-heading-6'>
              <button type='submit' className='h-full w-full'>Login</button>
            </div>

    
            {/*<p className='register-link'>
            Not registered? <Link to={'/register'}>Register here</Link>
            </p>*/}
          </form>
        </div> 
      </div>
      </div>
    </div>
  );
}
