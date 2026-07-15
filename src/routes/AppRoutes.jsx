import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from '../components/layout/Layout';
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import ContactPage from '../pages/Contact/ContactPage';

const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "about", element: <About /> },
        { path: "contact", element: <ContactPage /> },
      ],
    },
])


const Approutes = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default Approutes