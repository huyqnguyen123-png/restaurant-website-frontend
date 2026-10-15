import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import HeroSlideshow from '../components/HeroSlideshow'

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="bg-background w-full min-h-[calc(100dvh-56px)] lg:min-h-0 lg:h-[calc(100vh-100px)] flex items-center px-5 sm:px-8 lg:px-16 py-8 lg:py-0 overflow-hidden">
      <div className="grid lg:grid-cols-[0.85fr_1fr] xl:grid-cols-[1.1fr_1.4fr] gap-8 sm:gap-10 lg:gap-6 xl:gap-12 items-center w-full lg:h-[85%] max-w-[1600px] mx-auto">
        <div className="text-left z-10 flex flex-col justify-center">
          <p className="text-[#CC1C1C] text-[10px] sm:text-xs md:text-sm lg:text-base tracking-[0.2em] lg:tracking-[0.25em] font-medium mb-0 uppercase">
            {t('home.kicker')}
          </p>
          
          <h1 
            className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-8xl leading-[0.95] lg:leading-[0.95] mb-4 sm:mb-6"
            style={{ 
              fontFamily: '"Fraunces", serif',
              fontOpticalSizing: 'auto',
              fontWeight: 600
            }}
          >
            {t('home.titleLine1')}
            <br />
            <span className="text-[#CC1C1C]">{t('home.titleLine2')}</span>
          </h1>
          
          <p className="text-[#9ca3af] max-w-[34ch] sm:max-w-[320px] lg:max-w-[340px] text-[13px] sm:text-sm leading-relaxed mb-6 sm:mb-8 lg:mb-10">
            {t('home.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-6 lg:gap-8">
            <Link
              to="/reservation"
              className="bg-[#CC1C1C] hover:bg-[#a51515] transition-colors text-white text-[11px] tracking-[0.15em] sm:tracking-[0.2em] font-bold px-6 py-4 sm:px-9 uppercase rounded-none whitespace-nowrap text-center"
            >
              {t('home.makeReservation')}
            </Link>
            <Link
              to="/menu"
              className="text-white hover:text-[#CC1C1C] transition-colors text-[11px] tracking-[0.15em] sm:tracking-[0.2em] font-bold uppercase whitespace-nowrap text-center border border-white/20 sm:border-0 py-4 sm:py-0"
            >
              {t('home.viewMenu')}
            </Link>
          </div>
        </div>

        <div className="relative w-full h-[280px] sm:h-[340px] lg:h-full flex items-center justify-center lg:justify-end">
          <HeroSlideshow images={['/Ava1.jpg', '/ava2.jpg', '/ava3.jpg']} />
        </div>
      </div>
    </div>
  )
}