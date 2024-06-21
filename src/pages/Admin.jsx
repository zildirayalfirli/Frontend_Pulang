import React, { useEffect, useState } from 'react';
import { deleteUser, get } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import Modal from '../components/form/Modal';
import AddUserForm from '../components/form/AddUserForm';
import UpdateUserForm from '../components/form/UpdateUserForm';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showUpdateUserForm, setShowUpdateUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const GetUsers = async () => {
      try {
        const response = await get('/api/admin/getuser');
        if (response.status === 200) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    GetUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await deleteUser(`/api/admin/delete/${id}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        setUsers(users.filter(user => user._id !== id));
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setShowAddUserForm(true);
  };

  const handleCloseAddUserForm = () => {
    setShowAddUserForm(false);
  };

  const handleUpdateUser = (user) => {
    setSelectedUser(user);
    setShowUpdateUserForm(true);
  };

  const handleCloseUpdateUserForm = () => {
    setShowUpdateUserForm(false);
  };

  const handleAddUserSuccess = (newUser) => {
    setUsers([...users, newUser]);
  };

  const handleUpdateUserSuccess = (updatedUser) => {
    setUsers(users.map(user => (user._id === updatedUser._id ? updatedUser : user)));
  };

  return (
    <div className='container mx-auto p-4 bg-primary-100 border-2 border-secondary-300 rounded-lg'>
      <h2 className='text-heading-2 font-bold mb-4 flex justify-center'>Manage Users</h2>
      <div className='flex mt-8 justify-end'>
        <button className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg' onClick={handleAddUser}>Add User</button>
      </div>
      <div className='bg-primary-300 mt-4 w-full border-t-2 border-x-2 border-black rounded-lg'>
        <div className='w-full flex justify-between text-heading-6 divide-x-2'>
            <div className='w-1/3 flex justify-center items-center py-2 px-4 border-b-2 border-black'>Username</div>
            <div className='w-1/3 flex justify-center items-center py-2 px-4 border-b-2 border-black'>Role</div>
            <div className='w-1/3 flex justify-center items-center py-2 px-4 border-b-2 border-black'>Actions</div>
        </div>
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div className='w-full h-20 flex justify-between text-body-xl divide-x-2' key={index}>
              <div className='w-1/3 flex justify-center items-center py-2 px-4 border-b-2 border-black'>
                <Skeleton width={100} />
              </div>
              <div className='w-1/3 flex justify-center items-center py-2 px-4 border-b-2 border-black'>
                <Skeleton width={100} />
              </div>
              <div className='w-1/3 flex justify-center items-center py-2 px-4 border-b-2 border-black'>
                <Skeleton width={150} />
              </div>
            </div>
          ))
        ) : (
          users.map((elem, index) => (
            <div className='w-full h-20 flex justify-between text-body-xl divide-x-2' key={index}>
              <div className='w-1/3 flex justify-center items-center py-2 px-4  border-b-2 border-black'>{elem.username}</div>
              <div className='w-1/3 flex justify-center items-center py-2 px-4  border-b-2 border-black'>{elem.role}</div>
              <div className='w-1/3 flex justify-center items-center py-2 px-4  border-b-2 border-black'>
                <button className='bg-secondary-300 hover:bg-secondary-500 h-10 w-20 text-white px-2 py-1 rounded-lg mr-2' onClick={() => handleUpdateUser(elem)}>Update</button>
                <button className='bg-red-500 hover:bg-red-600 h-10 w-20 text-white px-2 py-1 rounded-lg' onClick={() => handleDelete(elem._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
      {showAddUserForm && (
        <Modal onClose={handleCloseAddUserForm}>
          <AddUserForm onClose={handleCloseAddUserForm} onSuccess={handleAddUserSuccess} />
        </Modal>
      )}
      {showUpdateUserForm && selectedUser && (
        <Modal onClose={handleCloseUpdateUserForm}>
          <UpdateUserForm user={selectedUser} onClose={handleCloseUpdateUserForm} onSuccess={handleUpdateUserSuccess} />
        </Modal>
      )}
    </div>
  );
}
