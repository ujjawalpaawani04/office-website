import { Header } from './Header/Header'
import { Footer } from './Footer/Footer'
import { Outlet } from 'react-router-dom'
import FloatingActions from './FloatingActions'
import { FloatingSocialBar } from './FloatingSocialBar'
import { ScrollToTop } from './ScrollToTop'
import { MobileNavProvider } from '../../context/MobileNavProvider'

const Layout = () => {
  return (
    <MobileNavProvider>
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingActions />
      <FloatingSocialBar />
    </MobileNavProvider>
  )
}

export default Layout