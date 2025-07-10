import { RouterProvider } from 'react-router-dom'
import { router } from '@app/router'
import useApp, { AppContext } from '@hooks/useApp'

function App() {
  const { appContext, setAppContext } = useApp()

  return (
    <AppContext.Provider value={{ appContext, setAppContext }}>
      <RouterProvider router={router} />
    </AppContext.Provider>
  )
}

export default App
