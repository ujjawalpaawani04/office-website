import { Header } from './Header/Header'
import { Footer } from './Footer/Footer'
import { Outlet } from 'react-router-dom'
import FloatingActions from './FloatingActions'
import { FloatingSocialBar } from './FloatingSocialBar'
import { ScrollToTop } from './ScrollToTop'
import { SiteSettingsProvider } from '../context/SiteSettingsContext'

const Layout = () => {
  return (
    <SiteSettingsProvider>
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingActions />
      <FloatingSocialBar />
    </SiteSettingsProvider>
  )
}

export default Layout