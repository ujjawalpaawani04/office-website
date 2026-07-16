import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from '../components/layout/Layout';
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import ContactPage from '../pages/Contact/ContactPage';
import IncomeTaxAdvisory from '../pages/Services/IncomeTaxAdvisory/IncomeTaxAdvisory';
import GSTServices from '../pages/Services/GSTServices/GSTServices';
import LifeAtSAA from '../pages/LifeAtSAA/LifeAtSAA';

const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "about", element: <About /> },
        { path: "contact", element: <ContactPage /> },
        { path: "services/income-tax-advisory", element: <IncomeTaxAdvisory /> },
        { path: "services/gst-services", element: <GSTServices /> },
        { path: "life-at-saa", element: <LifeAtSAA /> },
      ],
    },
])


const Approutes = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default Approutes