import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import React from 'react'
import Root from '@pages/Root'
import AdminHome from '@pages/admin/home'
import Analytics from '@pages/analytics'
import Login from '@pages/login'
import Record from '@pages/record'
import TestFirebase from '@pages/TestFirebase'
import DailyReport from '@pages/user/dailyReport'
import UserHome from '@pages/user/home'
import Information from '@pages/user/info'
import Profile from '@pages/user/profile'
import Report from '@pages/user/report'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <Navigate to="/login" replace /> },
      { path: '/login', element: <Login /> },

      { path: '/admin', element: <AdminHome /> },
      { path: '/analytics', element: <Analytics /> },
      { path: '/record', element: <Record /> },

      {
        path: '/user',
        element: <Outlet />,
        children: [
          { index: true, element: <Navigate to="home" replace /> },
          { path: 'home', element: <UserHome /> },
          { path: 'profile', element: <Profile /> },
          { path: 'info', element: <Information /> },
          { path: 'report', element: <Report /> },
          { path: 'dailyReport', element: <DailyReport /> },
        ],
      },

      { path: 'testFirebase', element: <TestFirebase /> },
    ],
  },
])
