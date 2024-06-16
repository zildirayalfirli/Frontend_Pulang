import React, { useState, useEffect } from 'react';
import { put } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';

export default function UpdateUserForm({ user, onClose, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [role, setRole] = useState('user');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setRole(user.role);
    }
  }, [user]);

  const handleUpdateUserSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== passwordAgain) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const response = await put('/api/admin/updateuser', { userId: user._id, username, password, passwordAgain, role });
      if (response.status === 200) {
        toast.success(response.data.message);
        onSuccess(response.data.user);
        onClose();
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'An error occurred. Please try again later.');
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className='flex flex-col gap-y-2 mb-4'>
      <div className='text-black text-center text-heading-5'>
        <h2>Update User</h2>
      </div>

    <form onSubmit={handleUpdateUserSubmit}>
    <div className='mt-4'>
        <label htmlFor='username' className='mb-2 block text-body-xl text-gray-700'>Username</label>
        <input
          type='text'
          id='username'
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
           className='text-body-l border-2 border-[#EE7F2B] rounded-lg h-12 w-72 placeholder:text-slate-400 px-4'
        />
      </div>
      <div className='mt-4'>
        <label htmlFor='password' className='mb-2 block text-body-xl text-gray-700'>Password</label>
        <input
          type='password'
          id='password'
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
           className='text-body-l border-2 border-[#EE7F2B] rounded-lg h-12 w-72 placeholder:text-slate-400 px-4'
        />
      </div>
      <div className='mt-4'>
        <label htmlFor='passwordAgain' className='mb-2 block text-body-xl text-gray-700'>Confirm Password</label>
        <input
          type='password'
          id='passwordAgain'
          placeholder="Enter Password Again"
          value={passwordAgain}
          onChange={(e) => setPasswordAgain(e.target.value)}
           className='text-body-l border-2 border-[#EE7F2B] rounded-lg h-12 w-72 placeholder:text-slate-400 px-4'
        />
      </div>
      <div className='mt-4'>
        <label htmlFor='role' className='mb-2 block text-body-xl text-gray-700'>Role</label>
        <select
          id='role'
          value={role}
          onChange={(e) => setRole(e.target.value)}
           className='text-body-l border-2 border-[#EE7F2B] rounded-lg h-12 w-36 placeholder:text-slate-400 px-4'
        >
          <option value='user'>User</option>
          <option value='admin'>Admin</option>
        </select>
      </div>
      <div className='mt-8 flex justify-start gap-4'>
        <button type='submit' className='inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-body-l text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-auto'>
          Update User
        </button>
        <button type='button' onClick={onClose} className='inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-body-l text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-auto'>
          Cancel
        </button>
      </div>
    </form>
    </div>
  );
}
