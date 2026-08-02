import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import HeroSlideshow from '../components/HeroSlideshow'

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="bg-background w-full h-[calc(100vh-100px)] flex items-center px-8 lg:px-16 overflow-hidden">
      <div className="grid lg:grid-cols-[1.1fr_1.4fr] gap-12 items-center w-full h-[85%] max-w-[1600px] mx-auto">
        <div className="text-left z-10 flex flex-col justify-center">
          <p className="text-[#CC1C1C] text-[11px] lg:text-[25px] tracking-[0.25em] font-medium mb-0 uppercase">
            {t('home.kicker')}
          </p>
          
          <h1 
            className="text-white text-6xl lg:text-7xl xl:text-[7.5rem] leading-[0.9] mb-6"
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
          
          <p className="text-[#9ca3af] max-w-[340px] text-[14px] lg:text-[15px] leading-relaxed mb-10">
            {t('home.description')}
          </p>
          
          <div className="flex items-center gap-8">
            <Link
              to="/reservation"
              className="bg-[#CC1C1C] hover:bg-[#a51515] transition-colors text-white text-[11px] tracking-[0.2em] font-bold px-9 py-4 uppercase rounded-none"
            >
              {t('home.makeReservation')}
            </Link>
            <Link
              to="/menu"
              className="text-white hover:text-[#CC1C1C] transition-colors text-[11px] tracking-[0.2em] font-bold uppercase"
            >
              {t('home.viewMenu')}
            </Link>
          </div>
        </div>

        <div className="relative w-full h-full flex items-center justify-end">
          <HeroSlideshow images={['/Ava1.jpg', '/ava2.jpg', '/ava3.jpg']} />
        </div>
      </div>
    </div>
  )
}