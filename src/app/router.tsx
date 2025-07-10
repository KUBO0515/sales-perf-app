import { createBrowserRouter, Navigate } from 'react-router-dom'
import React from 'react'
import Root from '@pages/Root'
import Admin from '@pages/admin'
import Analytics from '@pages/admin/analytics'
import Login from '@pages/login'
import Record from '@pages/admin/record'
import TestFirebase from '@pages/TestFirebase'
import User from '@pages/user'
import DailyReport from '@pages/user/dailyReport'
import UserHome from '@pages/user/home'
import Information from '@pages/user/info'
import Profile from '@pages/user/profile'
import Report from '@pages/user/report'
import DailyFormats from '@pages/user/dailyFormats'
import AdminDashboard from '@pages/admin/home'
import Formats from '@pages/admin/formats'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <Navigate to="/login" replace /> },
      { path: '/login', element: <Login /> },

      {
        path: '/admin',
        element: <Admin />,
        children: [
          { index: true, element: <Navigate to="home" replace /> },
          { path: 'home', element: <AdminDashboard /> },
          { path: 'analytics', element: <Analytics /> },
          { path: 'record', element: <Record /> },
          { path: 'formats', element: <Formats /> },
        ],
      },

      {
        path: '/user',
        element: <User />,
        children: [
          { index: true, element: <Navigate to="home" replace /> },
          { path: 'home', element: <UserHome /> },
          { path: 'profile', element: <Profile /> },
          { path: 'info', element: <Information /> },
          { path: 'report', element: <Report /> },
          { path: 'dailyReport', element: <DailyReport /> },
          { path: 'dailyReport/:formatId', element: <DailyReport /> },
          { path: 'dailyFormats', element: <DailyFormats /> },
        ],
      },

      { path: 'testFirebase', element: <TestFirebase /> },
    ],
  },
])
