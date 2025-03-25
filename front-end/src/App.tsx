import { RouterProvider } from 'react-router-dom'
import { Helmet } from 'react-helmet'
 
import { router } from './routes'

export function App() {
  return <>
  <Helmet titleTemplate="%s | Lucas Food" />

  <RouterProvider router={router} />
  </>
}
