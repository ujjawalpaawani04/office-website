import { Header } from './Header/Header'
import { Footer } from './Footer/Footer'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] pt-20 lg:pt-24">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout