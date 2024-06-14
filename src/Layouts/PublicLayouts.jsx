import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

export default function PublicLayouts() {
    const user=useSelector((state)=>state.Auth.user)
    const navigate=useNavigate()


    useEffect(()=>{
    if (user) {
        if (user.role === 'admin') {
            navigate('/');
        } else {
            navigate('/');
        }
    }
    },[user,navigate])
return (
    <Outlet/>
)
}
