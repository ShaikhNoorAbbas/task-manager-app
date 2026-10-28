import { Children, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.js"
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from './layout/Layout.jsx'
import Signin from './pages/signin/Signin.jsx'
import Signup from './pages/signup/Signup.jsx'
import Dashboard from './pages/dashboard/Dashboard.jsx'
import ProtectedRoute from './layout/Protected.jsx'


let routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Signin />
      },
      {
        path: "signin",
        element: <Signin />
      },
      {
        path: "signup",
        element: <Signup />
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={routes} />
)
