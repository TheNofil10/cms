import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import SignUp from '../pages/SignUp'
import ForgetPass from '../pages/ForgetPass'
import DashBoard from '../pages/DashBoard'

const AllRoutes = () => {
  return (
    <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/forget-password' element={<ForgetPass />} />
        <Route path='/dashboard' element={<DashBoard />} />
    </Routes>
  )
}

export default AllRoutes
