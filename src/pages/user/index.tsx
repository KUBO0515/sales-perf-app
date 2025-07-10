import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { AppContext } from '@hooks/useApp'

export default function Page() {
  const { appContext } = useContext(AppContext)

  if (appContext.isSignIn === false) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}
