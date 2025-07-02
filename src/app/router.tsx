import { createBrowserRouter, Navigate } from 'react-router-dom'
import React from 'react'
import Root from '../pages/Root'
import AdminDashboard from '../pages/AdminDashboard'
import Analytics from '../pages/Analytics'
import Record from '../pages/Record'
import Infomation from '../Employee/Infomation'
import Profile from '../Employee/Profile'
import Report from '../Employee/Report'
import MobileHome from '../Employee/MobileHome'
import DailyReport from '../Employee/ReportPages/DailyReport'
import TestFirebase from '../Employee/TestFirebase'
import LoginPage from '../pages/LoginPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <Navigate to="/login" replace /> },
      { path: '/admin', element: <AdminDashboard /> },
      { path: '/analytics', element: <Analytics /> },
      { path: '/record', element: <Record /> },
      { path: '/info', element: <Infomation /> },
      { path: '/user', element: <Profile /> },
      { path: '/report', element: <Report /> },
      { path: '/home', element: <MobileHome /> },
      { path: '/dailyreport', element: <DailyReport /> },
      { path: '/testfirebase', element: <TestFirebase /> },
      { path: '/login', element: <LoginPage /> },
    ],
  },
])
