import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import phoneIcon from '../assets/publicacion_phone.png';
import phoneIcon2 from '../assets/publicacion_phone2.png';
import pc_plantilla from '../assets/pc_plantilla.png';
import PixiaPowerby from '../assets/poweredby.png';
gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const sectionRefs = useRef([]);
  const heroContentRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaButtonRef = useRef(null);
  const mainPhoneRef = useRef(null);
  const secondaryPhoneRef = useRef(null);

  useEffect(() => {
    gsap.fromTo('.bg-gradient-to-br', { opacity: 0 }, { opacity: 1, duration: 2, ease: 'power2.inOut' });
    gsap.fromTo('nav', { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'power3.out' });

    const heroTimeline = gsap.timeline({ delay: 0.8 });
    heroTimeline
      .fromTo(badgeRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' })
      .fromTo(titleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.2')
      .fromTo(descriptionRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .fromTo(ctaButtonRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.2');

    gsap.fromTo(mainPhoneRef.current, { y: 100, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 1, delay: 1.2, ease: 'power3.out' });
    gsap.fromTo(secondaryPhoneRef.current, { y: 100, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 1, delay: 1.5, ease: 'power3.out' });

    gsap.to(mainPhoneRef.current, { y: '+=20', rotation: 3, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.2 });
    gsap.to(secondaryPhoneRef.current, { y: '-=15', rotation: -2, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.5 });

    sectionRefs.current.forEach((section) => {
      gsap.fromTo(section, { y: 100, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 80%', end: 'bottom 20%', toggleActions: 'play none none reverse' }
      });
    });

    gsap.utils.toArray('.feature-card').forEach((card, index) => {
      gsap.fromTo(card, { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, delay: 0.2 * index, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 90%' }
      });
    });

  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 z-0" />
      
      <div className="fixed inset-0 opacity-40 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,175,80,0.1),rgba(0,0,0,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(4,120,87,0.2),rgba(0,0,0,0))]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        
        <section className="hero-section container mx-auto px-4 min-h-screen flex items-center">
          <div className="flex flex-col lg:flex-row items-center justify-between w-full">
            <div ref={heroContentRef} className="w-full lg:w-1/2 space-y-8 hero-content text-left">
              <div ref={badgeRef} className="inline-block">
                <img src={PixiaPowerby} alt="Pixia Powered by" className="h-32" />
              </div>
              
              <h1 ref={titleRef} className="text-5xl lg:text-7xl font-bold text-white leading-tight drop-shadow-2xl">
                Transforma tus{' '}
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  ideas
                </span>{' '}
                en vacantes perfectas
              </h1>
              
              <p ref={descriptionRef} className="text-xl text-gray-200 drop-shadow-lg">
                Utiliza el poder de la inteligencia artificial para crear vacantes que atraigan al mejor talento.
              </p>
              
              <div ref={ctaButtonRef} className="flex justify-start">
                <Link 
                  to="/login" 
                  className="inline-flex items-center bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-300 hover:to-emerald-300 text-gray-900 font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-400/30"
                >
                  Comenzar ahora
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative h-[600px] lg:h-[700px] mt-16 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-3xl blur-3xl" />
              
              <div ref={mainPhoneRef} className="absolute left-1/2 top-[35%] transform -translate-x-1/2 -translate-y-1/2 z-10 w-[280px] sm:w-[350px] md:w-[450px] lg:w-[500px]">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-3xl blur-xl" />
                  <img src={phoneIcon} alt="Demo Interface" className="relative w-full h-auto drop-shadow-2xl" />
                </div>
              </div>
              
              <div ref={secondaryPhoneRef} className="absolute right-0 lg:-right-10 top-[15%] z-20 w-[140px] sm:w-[180px] md:w-[200px] lg:w-[250px]">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-3xl blur-xl" />
                  <img src={phoneIcon2} alt="Secondary Interface" className="relative w-full h-auto drop-shadow-2xl" />
                </div>
              </div>

              <div className="absolute -right-4 -bottom-4 w-64 h-64 bg-green-400/20 rounded-full blur-3xl" />
              <div className="absolute -left-8 -top-8 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl" />
            </div>
          </div>
        </section>

        <section ref={el => sectionRefs.current[0] = el} className="py-24 bg-gray-900/50 backdrop-blur-lg">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Características Principales</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="feature-card bg-gray-800/50 p-6 rounded-xl backdrop-blur-lg">
                <h3 className="text-2xl font-semibold text-green-400 mb-4">IA Avanzada</h3>
                <p className="text-gray-300">Nuestra IA de última generación analiza tendencias del mercado laboral y optimiza tus descripciones de puestos para atraer a los mejores candidatos.</p>
              </div>
              <div className="feature-card bg-gray-800/50 p-6 rounded-xl backdrop-blur-lg">
                <h3 className="text-2xl font-semibold text-green-400 mb-4">Personalización</h3>
                <p className="text-gray-300">Adapta las vacantes a tu cultura empresarial y requisitos específicos. Nuestra plataforma aprende de tus preferencias para mejorar con cada uso.</p>
              </div>
              <div className="feature-card bg-gray-800/50 p-6 rounded-xl backdrop-blur-lg">
                <h3 className="text-2xl font-semibold text-green-400 mb-4">Análisis de Datos</h3>
                <p className="text-gray-300">Obtén insights valiosos sobre el rendimiento de tus anuncios de empleo y optimiza tu estrategia de reclutamiento con nuestros informes detallados.</p>
              </div>
            </div>
          </div>
        </section>

        <section ref={el => sectionRefs.current[1] = el} className="py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-white mb-16 text-center">
              Crea vacantes en <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">4 simples pasos</span>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-start gap-4 feature-card">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-green-400/20 backdrop-blur-lg">
                    <span className="text-green-400 font-bold text-xl">1</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2">Elige una plantilla</h3>
                    <p className="text-gray-300">Selecciona entre nuestra variedad de plantillas profesionales diseñadas para diferentes roles y sectores.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 feature-card">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-green-400/20 backdrop-blur-lg">
                    <span className="text-green-400 font-bold text-xl">2</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2">Personaliza el contenido</h3>
                    <p className="text-gray-300">Nuestra IA te ayudará a generar y adaptar el contenido según tus necesidades específicas.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 feature-card">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-green-400/20 backdrop-blur-lg">
                    <span className="text-green-400 font-bold text-xl">3</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2">Ajusta los detalles</h3>
                    <p className="text-gray-300">Refina los requisitos, responsabilidades y beneficios para atraer a los candidatos ideales.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 feature-card">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-green-400/20 backdrop-blur-lg">
                    <span className="text-green-400 font-bold text-xl">4</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2">Publica y comparte</h3>
                    <p className="text-gray-300">Publica tu vacante optimizada y compártela en múltiples plataformas con un solo clic.</p>
                  </div>
                </div>
              </div>

              <div className="relative feature-card">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-3xl blur-xl"></div>
                <img 
                  src={pc_plantilla} 
                  alt="Selección de plantilla" 
                  className="relative rounded-xl w-full shadow-2xl border border-green-400/20"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;