import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { post } from '../services/ApiEndpoint'
import { Logout } from '../redux/AuthSlice'
import logologin from '../assets/logologin.svg';

export default function LogOut() {
  const user=useSelector((state)=>state.Auth.user)
  console.log(user)
  const navigate=useNavigate()
  const disptach=useDispatch()

  const handleLogout=async()=>{
    try {
      const request= await post('/api/auth/logout')
       const resspone= request.data
       if (request.status==200) {
           disptach(Logout())
          navigate('/login')
       }
    } catch (error) {
      console.log(error)
    }
  }
  return (

    <div className='container mx-auto rounded-lg bg-secondary-300 h-screen flex flex-col items-center justify-center gap-y-24 border-2 border-black'>
      <div className='mt-20 flex justify-center'>
        <img src={logologin} alt="logo login" className="w-3/4 h-auto" />
      </div>

        <div className='h-[300px] w-[600px] flex items-center justify-center p-8 bg-primary-100 rounded-xl border-2 border-black'>
          <div className='w-full h-fit gap-y-8 flex flex-col items-center justify-center'>
            <div className='text-black text-heading-3'>
              <h2>Log Out</h2>
            </div>

            <div className='text-black text-body-xl'>
              <h2>Are You Sure Want Log Out?</h2>
            </div>

            <div className='bg-[#EE7F2B] hover:bg-[#B86323] rounded-lg h-12 w-36 mt-2 flex items-center justify-center text-heading-6'>
              <button className='' onClick={handleLogout}>Log Out</button>
            </div>
          </div> 
        </div>

    </div>

  )
}
