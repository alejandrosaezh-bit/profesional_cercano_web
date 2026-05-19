"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [description, setDescription] = useState("");
  
  const [proName, setProName] = useState("");
  const [proEmail, setProEmail] = useState("");
  const [proPhone, setProPhone] = useState("");
  const [proSpecialty, setProSpecialty] = useState("");

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [requestStatus, setRequestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [proStatus, setProStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Reemplazar con URL de prod (ej: https://api.profesionalcercano.com/api)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus("loading");
    try {
      const res = await fetch(`${API_URL}/web-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          category: searchQuery, 
          location, 
          description, 
          name: clientName, 
          email: clientEmail, 
          phone: clientPhone 
        }),
      });
      if (!res.ok) throw new Error("Error en la solicitud");
      setRequestStatus("success");
      setTimeout(() => {
        setShowRequestModal(false);
        setRequestStatus("idle");
      }, 3000);
    } catch (error) {
      console.error(error);
      setRequestStatus("error");
    }
  };

  const handleProRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setProStatus("loading");
    try {
      const res = await fetch(`${API_URL}/web-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: proName, 
          email: proEmail, 
          phone: proPhone, 
          specialty: proSpecialty 
        }),
      });
      if (!res.ok) throw new Error("Error en registro B2B");
      setProStatus("success");
      setTimeout(() => {
        setShowProModal(false);
        setProStatus("idle");
      }, 3000);
    } catch (error) {
      console.error(error);
      setProStatus("error");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBAR */}
      <header className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Si no tienes el logo, esto actúa de fallback visual */}
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
              PC
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Profesional Cercano</span>
          </div>
          <nav className="hidden md:flex gap-8 items-center">
            <a href="#como-funciona" className="text-gray-600 hover:text-primary font-medium transition-colors">Cómo funciona</a>
            <a href="#servicios" className="text-gray-600 hover:text-primary font-medium transition-colors">Servicios</a>
            <button 
              onClick={() => setShowProModal(true)}
              className="text-secondary hover:text-secondary-hover font-semibold transition-colors"
            >
              Soy Profesional
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow pt-20">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-slate-50 pt-24 pb-32">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20">
              La forma más rápida de encontrar ayuda
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 max-w-4xl">
              El experto que necesitas, <span className="text-primary">cerca de ti.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl leading-relaxed">
              Fontaneros, electricistas, limpieza, salud y más. Encuentra profesionales verificados y recibe presupuestos en minutos, no en días.
            </p>

            {/* SEARCH BOX */}
            <div className="w-full max-w-3xl bg-white p-3 rounded-2xl shadow-xl border border-gray-100 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900" 
                  placeholder="¿Qué servicio buscas? (Ej. Fontanero)" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900" 
                  placeholder="Ciudad o código postal" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setShowRequestModal(true)}
                className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/30 transform hover:-translate-y-0.5"
              >
                Buscar
              </button>
            </div>
            
            <div className="mt-8 flex items-center gap-6 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg> Profesionales Verificados</span>
              <span className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg> Presupuestos Gratis</span>
            </div>
          </div>
        </section>

        {/* PRO REGISTRATION CTA (B2B) */}
        <section className="bg-secondary py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Haz crecer tu negocio con Profesional Cercano
              </h2>
              <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-lg mx-auto lg:mx-0">
                Únete a cientos de profesionales que ya están consiguiendo nuevos clientes cada día. Sin comisiones abusivas, tú tienes el control.
              </p>
              <ul className="text-blue-50 text-left space-y-4 mb-10 max-w-md mx-auto lg:mx-0 font-medium">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center">✓</div>
                  Accede a solicitudes de clientes en tu zona.
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center">✓</div>
                  Gestiona todo desde nuestra App exclusiva.
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center">✓</div>
                  Verificación de identidad para generar confianza.
                </li>
              </ul>
              <button 
                onClick={() => setShowProModal(true)}
                className="bg-white text-secondary hover:bg-gray-50 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl transform hover:-translate-y-1"
              >
                Regístrate como Profesional
              </button>
            </div>
            <div className="lg:w-1/2 w-full">
              {/* Decorative Mockup */}
              <div className="bg-blue-800/50 backdrop-blur-xl border border-blue-400/20 rounded-3xl p-8 shadow-2xl relative">
                <div className="flex gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-blue-400/20 rounded w-1/3"></div>
                  <div className="h-10 bg-blue-400/20 rounded-xl w-full"></div>
                  <div className="h-24 bg-blue-400/20 rounded-xl w-full"></div>
                  <div className="h-10 bg-white rounded-xl w-1/2 mt-6"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* APP DOWNLOAD */}
        <section className="py-24 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Lleva Profesional Cercano en tu bolsillo</h2>
            <p className="text-gray-600 text-lg mb-10">
              Descarga nuestra app móvil gratuita y gestiona tus solicitudes o servicios desde cualquier lugar. Disponible para iOS y Android.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-black text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-gray-800 transition-colors w-full sm:w-auto justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.48-.79 1.58-.06 2.76.65 3.53 1.77-1.3.8-2.12 2.22-2.09 3.8.03 1.83 1.34 3.2 2.89 3.83-.34 1.05-.78 1.99-1.3 2.87-.93 1.58-1.99 3.12-3.59 3.15zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.3 2.31-1.74 4.31-3.74 4.25z"/></svg>
                <div className="text-left">
                  <div className="text-xs font-normal">Descargar en</div>
                  <div className="text-lg leading-tight">App Store</div>
                </div>
              </button>
              <button className="bg-black text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-gray-800 transition-colors w-full sm:w-auto justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M3.609 1.814L13.792 12 3.61 22.186c-.165-.112-.294-.257-.384-.424A1.916 1.916 0 013 20.82V3.18c0-.342.079-.658.226-.942.09-.167.22-.312.383-.424zM14.935 13.14l4.52 4.52-12.75 7.358 8.23-11.878zM14.935 10.86L6.705-1.018l12.75 7.358-4.52 4.52zM21.144 9.5l-5.111-2.95 3.655 3.655v1.59l-3.655 3.655 5.111-2.95c.534-.308.856-.88.856-1.5s-.322-1.192-.856-1.5z"/></svg>
                <div className="text-left">
                  <div className="text-xs font-normal">DISPONIBLE EN</div>
                  <div className="text-lg leading-tight">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 font-medium">
          <p>&copy; {new Date().getFullYear()} Profesional Cercano. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* REQUEST MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
            <button 
              onClick={() => setShowRequestModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              ✕
            </button>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Solicitar Servicio</h3>
            <p className="text-gray-600 mb-6">Completa estos datos para conectarte con profesionales locales.</p>
            
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">¿Qué necesitas?</label>
                <input required type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Ej. Reparar tubería..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                  <input required type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                  <input required type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Ej. 600123456" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Correo electrónico</label>
                <input required type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="correo@ejemplo.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ubicación exacta</label>
                <input required type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Ej. Calle Mayor 1, Madrid" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción detallada</label>
                <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Describe el problema o proyecto..." />
              </div>
              
              <button 
                type="submit" 
                disabled={requestStatus === 'loading'}
                className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold transition-colors mt-4 disabled:opacity-70 flex justify-center items-center"
              >
                {requestStatus === 'loading' ? 'Enviando...' : 'Enviar Solicitud Gratis'}
              </button>

              {requestStatus === 'success' && (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl mt-4 text-center font-medium">
                  ¡Solicitud enviada con éxito! Te contactarán pronto.
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* PRO REGISTRATION MODAL */}
      {showProModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
            <button 
              onClick={() => setShowProModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              ✕
            </button>
            
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Registro para Profesionales</h3>
            <p className="text-gray-600 mb-6">Crea tu perfil en Profesional Cercano y empieza a recibir clientes en tu zona hoy mismo.</p>
            
            <form onSubmit={handleProRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo / Empresa</label>
                <input required type="text" value={proName} onChange={e => setProName(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                <input required type="email" value={proEmail} onChange={e => setProEmail(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                  <input required type="tel" value={proPhone} onChange={e => setProPhone(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Especialidad</label>
                  <input required type="text" value={proSpecialty} onChange={e => setProSpecialty(e.target.value)} placeholder="Ej. Electricista" className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none" />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={proStatus === 'loading'}
                className="w-full bg-secondary hover:bg-secondary-hover text-white py-4 rounded-xl font-bold transition-colors mt-4 disabled:opacity-70 flex items-center justify-center"
              >
                {proStatus === 'loading' ? 'Enviando...' : 'Comenzar Registro'}
              </button>

              {proStatus === 'success' && (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl mt-4 text-center font-medium">
                  ¡Registro exitoso! Revisa tu correo o espera que un admin te contacte.
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
