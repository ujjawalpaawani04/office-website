import { useEffect, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { FiArrowUp } from 'react-icons/fi'

const FloatingActions = () => {
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
      {/* WhatsApp */}
      <a
        href="https://wa.me/91XXXXXXXXXX"
        target="_blank"
        rel="noreferrer"
        aria-label="Contact us on WhatsApp"
        className="fixed bottom-4 left-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-105 sm:bottom-8 sm:left-8"
      >
        <FaWhatsapp className="h-6 w-6" />
      </a>

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