import { Header } from './Header/Header'
import { Footer } from './Footer/Footer'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
      <Header />
      <main className="pt-25">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout