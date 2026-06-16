import Link from "next/link";

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-8 md:p-16 flex flex-col justify-center items-center">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <Link href="/" className="text-orange-500 hover:text-orange-400 font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Volver al inicio
          </Link>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-2xl shadow-xl">
          <h1 className="text-4xl font-bold text-white mb-4">Contacto Legal y Soporte</h1>
          <p className="text-lg text-slate-400 mb-8">
            Si tienes dudas sobre nuestras políticas, necesitas hacer valer tus derechos sobre tus datos, o tienes algún problema con la plataforma, estamos aquí para ayudarte.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-orange-500/20 p-3 rounded-lg text-orange-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Correo Electrónico</h3>
                <p className="text-slate-400 mt-1">Escríbenos a nuestro equipo de soporte legal:</p>
                <a href="mailto:legal@profesionalcercano.com" className="text-orange-500 hover:underline mt-1 inline-block">legal@profesionalcercano.com</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-orange-500/20 p-3 rounded-lg text-orange-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Centro de Ayuda</h3>
                <p className="text-slate-400 mt-1">Para disputas comerciales o problemas con una valoración, por favor utiliza el sistema de "Apelaciones" dentro de la misma aplicación móvil.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-orange-500/20 p-3 rounded-lg text-orange-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Operaciones</h3>
                <p className="text-slate-400 mt-1">República Bolivariana de Venezuela.</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
