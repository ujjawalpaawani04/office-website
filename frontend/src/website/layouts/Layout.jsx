import { Suspense } from 'react'
import { Header } from './Header/Header'
import { Footer } from './Footer/Footer'
import { Outlet } from 'react-router-dom'
import FloatingActions from './FloatingActions'
import { FloatingSocialBar } from './FloatingSocialBar'
import { ScrollToTop } from './ScrollToTop'
import { SiteSettingsProvider } from '../context/SiteSettingsContext'
import { PageLoader } from '../components/common/PageLoader'

const Layout = () => {
  return (
    <SiteSettingsProvider>
      <ScrollToTop />
      <Header />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <FloatingActions />
      <FloatingSocialBar />
    </SiteSettingsProvider>
  )
}

export default Layout