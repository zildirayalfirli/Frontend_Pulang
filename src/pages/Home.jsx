import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import FileUpload from '../components/file/FileUpload'

export default function Home() {
  const user = useSelector((state) => state.Auth.user)
  console.log(user)

  return (
    <div className="container mx-auto p-4">
      <FileUpload />
    </div>
  )
}
