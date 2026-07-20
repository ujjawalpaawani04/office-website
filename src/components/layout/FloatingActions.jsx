import { useEffect, useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'
import { useMobileNav } from '../../context/MobileNavContext'
import { cn } from '../../utils/cn'
import { WhatsAppButton } from './WhatsAppButton'

const FloatingActions = () => {
  const { isMobileNavOpen } = useMobileNav()
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    let frameId = null

    const handleScroll = () => {
      if (frameId) cancelAnimationFrame(frameId)

      frameId = requestAnimationFrame(() => {
        const scrollTop =
          window.scrollY ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0

        const scrollHeight =
          document.documentElement.scrollHeight - window.innerHeight

        const progress =
          scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0

        setShowScrollTop(scrollTop > 200)
        setScrollProgress(Math.min(100, Math.max(0, progress)))
      })
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      if (frameId) cancelAnimationFrame(frameId)

      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const progressAngle = (scrollProgress / 100) * 360

  const ringStyle = {
    background: `conic-gradient(
      #01adab ${progressAngle}deg,
      #E5E7EB ${progressAngle}deg
    )`,
  }

  return (
    <>
      {/* WhatsApp - hidden while the mobile drawer is open, where it moves
          inline beside the hamburger toggle instead (see MobileNav). */}
      <div
        aria-hidden={isMobileNavOpen}
        className={cn(
          'fixed bottom-4 left-4 z-50 transition-all duration-300 sm:bottom-8 sm:left-8',
          isMobileNavOpen ? 'pointer-events-none scale-90 opacity-0' : 'scale-100 opacity-100'
        )}
      >
        <WhatsAppButton className="h-14 w-14" tabIndex={isMobileNavOpen ? -1 : undefined} />
      </div>

      {/* Scroll To Top */}
      <div
        className={`fixed bottom-4 right-4 z-50 transition-all duration-300 sm:bottom-8 sm:right-8 ${
          showScrollTop
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <div className="relative h-14 w-14">

          {/* Progress Ring */}
          <div
            className="absolute inset-0 rounded-full p-[2px]"
            style={ringStyle}
          >
            <div className="h-full w-full rounded-full bg-white"></div>
          </div>

          {/* Button */}
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="absolute inset-[4px] flex items-center justify-center rounded-full bg-highlight text-white shadow-lg transition-all duration-300 hover:scale-105"
          >
            <FiArrowUp className="h-5 w-5" />
          </button>

        </div>
      </div>
    </>
  )
}

export default FloatingActions