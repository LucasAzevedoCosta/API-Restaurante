import { RouterProvider } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Toaster } from 'sonner'
 
import { router } from './routes'

export function App() {
  return <>
  <Helmet titleTemplate="%s | Lucas Food" />

  <Toaster richColors />

  <RouterProvider router={router} />
  </>
}
