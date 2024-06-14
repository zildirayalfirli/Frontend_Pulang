import React, { useState } from 'react';
import { post } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';

export default function AddUserForm({ onClose, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [role, setRole] = useState('user');

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordAgain) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const response = await post('/api/admin/adduser', { username, password, passwordAgain, role });
      if (response.status === 200) {
        toast.success(response.data.message);
        onSuccess(response.data.newUser);
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
    <form onSubmit={handleAddUserSubmit}>
      <div className='input-group'>
        <label htmlFor='username' className='block text-sm font-medium text-gray-700'>Username</label>
        <input
          type='text'
          id='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
        />
      </div>
      <div className='input-group'>
        <label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password</label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
        />
      </div>
      <div className='input-group'>
        <label htmlFor='passwordAgain' className='block text-sm font-medium text-gray-700'>Confirm Password</label>
        <input
          type='password'
          id='passwordAgain'
          value={passwordAgain}
          onChange={(e) => setPasswordAgain(e.target.value)}
          className='mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
        />
      </div>
      <div className='input-group'>
        <label htmlFor='role' className='block text-sm font-medium text-gray-700'>Role</label>
        <select
          id='role'
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className='mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
        >
          <option value='user'>User</option>
          <option value='admin'>Admin</option>
        </select>
      </div>
      <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
        <button type='submit' className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm'>
          Add User
        </button>
        <button type='button' onClick={onClose} className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm'>
          Cancel
        </button>
      </div>
    </form>
  );
}
