import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from "./screens/home.tsx"
import { MantineProvider } from '@mantine/core';
import { Toaster } from './components/ui/toaster.tsx';
const router = createBrowserRouter([
  {
    path: '/',
    Component: Home
  }
])

function App() {
  return(
    <MantineProvider>
      <RouterProvider router={router}/>
      <Toaster />
    </MantineProvider>
  )
}

export default App
