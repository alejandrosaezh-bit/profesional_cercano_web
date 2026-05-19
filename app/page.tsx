"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  
  // Wizard States
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestStep, setRequestStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [requestStatus, setRequestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Pro States
  const [showProModal, setShowProModal] = useState(false);
  const [proName, setProName] = useState("");
  const [proEmail, setProEmail] = useState("");
  const [proPhone, setProPhone] = useState("");
  const [proSpecialty, setProSpecialty] = useState("");
  const [proStatus, setProStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://profix-backend-h56b.onrender.com/api";

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(err => console.error("Error cargando categorias:", err));
  }, [API_URL]);

  const openWizard = (cat?: any) => {
    if (cat) {
      setSelectedCategory(cat);
      setRequestStep(2);
    } else {
      setSelectedCategory(null);
      setRequestStep(1);
    }
    setShowRequestModal(true);
    setRequestStatus("idle");
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus("loading");
    try {
      const res = await fetch(`${API_URL}/web-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          category: selectedCategory?._id || selectedCategory?.name,
          subcategory: selectedSubcategory,
          title,
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
        setRequestStep(1);
        setRequestStatus("idle");
      }, 4000);
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
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* NAVBAR */}
      <header className="fixed w-full top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
              PC
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Profesional Cercano</span>
          </div>
          <nav className="hidden md:flex gap-8 items-center">
            <button onClick={() => openWizard()} className="text-gray-600 hover:text-primary font-medium transition-colors">Solicitar Servicio</button>
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
        {/* HERO SECTION (App Style) */}
        <section className="relative overflow-hidden pt-20 pb-24">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-10 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 max-w-3xl">
              ¿Qué necesitas hoy? <span className="text-primary block mt-2">Encontramos al experto ideal.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl">
              Selecciona una categoría para publicar tu solicitud. Los profesionales de tu zona te enviarán presupuestos rápidos.
            </p>

            {/* CATEGORY GRID (Interactive) */}
            <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              {categories.slice(0, 7).map((cat, idx) => (
                <button 
                  key={idx}
                  onClick={() => openWizard(cat)}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl group-hover:bg-primary group-hover:text-white transition-colors">
                    {cat.icon || "🔧"}
                  </div>
                  <span className="font-semibold text-gray-800">{cat.name}</span>
                </button>
              ))}
              <button 
                onClick={() => openWizard()}
                className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center gap-3 group"
              >
                <div className="w-14 h-14 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-2xl group-hover:bg-gray-300 transition-colors">
                  ➕
                </div>
                <span className="font-semibold text-gray-800">Ver Todas</span>
              </button>
            </div>
            
          </div>
        </section>

        {/* PRO REGISTRATION CTA (B2B) */}
        <section className="bg-secondary py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Únete como Profesional
              </h2>
              <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-lg mx-auto lg:mx-0">
                Consigue nuevos clientes todos los días. Tú pones los precios, nosotros te llevamos el trabajo.
              </p>
              <button 
                onClick={() => setShowProModal(true)}
                className="bg-white text-secondary hover:bg-gray-50 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl transform hover:-translate-y-1"
              >
                Crear Perfil Profesional
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-12 text-center text-gray-500 font-medium">
        <p>&copy; {new Date().getFullYear()} Profesional Cercano. Todos los derechos reservados.</p>
      </footer>

      {/* REQUEST WIZARD MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowRequestModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              ✕
            </button>
            
            {/* Step 1: Category Selection */}
            {requestStep === 1 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Selecciona un servicio</h3>
                <p className="text-gray-600 mb-6">¿En qué categoría necesitas ayuda?</p>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat, i) => (
                    <button 
                      key={i}
                      onClick={() => { setSelectedCategory(cat); setRequestStep(2); }}
                      className="p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 text-left font-semibold text-gray-800 transition-all flex items-center gap-3"
                    >
                      <span>{cat.icon || "🔧"}</span> {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Subcategory Selection */}
            {requestStep === 2 && selectedCategory && (
              <div>
                <button onClick={() => setRequestStep(1)} className="text-sm text-gray-500 hover:text-primary mb-4 flex items-center gap-1">
                  ← Volver a categorías
                </button>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedCategory.name}</h3>
                <p className="text-gray-600 mb-6">Selecciona el tipo de trabajo específico.</p>
                
                {selectedCategory.subcategories && selectedCategory.subcategories.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {selectedCategory.subcategories.map((sub: any, i: number) => (
                      <button 
                        key={i}
                        onClick={() => { setSelectedSubcategory(sub.name); setRequestStep(3); }}
                        className="p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 text-left font-medium text-gray-800 transition-all"
                      >
                        {sub.name}
                      </button>
                    ))}
                    <button 
                      onClick={() => { setSelectedSubcategory("Otro"); setRequestStep(3); }}
                      className="p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 text-left font-medium text-gray-800 transition-all italic"
                    >
                      Otro servicio de {selectedCategory.name}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="mb-4 text-gray-600">Continuemos con los detalles.</p>
                    <button onClick={() => setRequestStep(3)} className="bg-primary text-white px-6 py-3 rounded-xl font-bold">Continuar</button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Request Details */}
            {requestStep === 3 && (
              <div>
                <button onClick={() => setRequestStep(2)} className="text-sm text-gray-500 hover:text-primary mb-4 flex items-center gap-1">
                  ← Volver
                </button>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Detalles del trabajo</h3>
                <p className="text-gray-600 mb-6">Describe lo que necesitas para que los profesionales te den un buen presupuesto.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Título de la solicitud</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Ej. Reparación de fuga de agua" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción detallada</label>
                    <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Explica el problema o proyecto con detalles..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Municipio o Localidad</label>
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Ej. Madrid Centro" />
                  </div>
                  <button 
                    onClick={() => {
                      if (!title || !description || !location) return alert("Por favor completa los detalles.");
                      setRequestStep(4);
                    }}
                    className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold transition-colors mt-2"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Auth & Submit */}
            {requestStep === 4 && (
              <div>
                <button onClick={() => setRequestStep(3)} className="text-sm text-gray-500 hover:text-primary mb-4 flex items-center gap-1">
                  ← Volver
                </button>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Casi listo!</h3>
                <p className="text-gray-600 mb-6">Ingresa tus datos de contacto para que los profesionales puedan enviarte sus presupuestos.</p>
                
                <form onSubmit={handleRequestSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                    <input required type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Tu nombre" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                    <input required type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Ej. 600123456" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Correo electrónico</label>
                    <input required type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="correo@ejemplo.com" />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={requestStatus === 'loading'}
                    className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-bold transition-colors mt-4 disabled:opacity-70"
                  >
                    {requestStatus === 'loading' ? 'Publicando Solicitud...' : 'Publicar Solicitud Gratis'}
                  </button>

                  {requestStatus === 'success' && (
                    <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl mt-4 text-center">
                      <p className="font-bold mb-1">¡Solicitud publicada!</p>
                      <p className="text-sm">Te hemos creado una cuenta. Revisa tu correo o descarga la App para gestionar los presupuestos.</p>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PRO REGISTRATION MODAL */}
      {showProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
            <button 
              onClick={() => setShowProModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Registro B2B</h3>
            <p className="text-gray-600 mb-6">Crea tu perfil y empieza a recibir clientes.</p>
            <form onSubmit={handleProRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
                <input required type="text" value={proName} onChange={e => setProName(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Correo</label>
                <input required type="email" value={proEmail} onChange={e => setProEmail(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                  <input required type="tel" value={proPhone} onChange={e => setProPhone(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Especialidad</label>
                  <input required type="text" value={proSpecialty} onChange={e => setProSpecialty(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none" />
                </div>
              </div>
              <button type="submit" disabled={proStatus === 'loading'} className="w-full bg-secondary text-white py-4 rounded-xl font-bold mt-4 disabled:opacity-70">
                {proStatus === 'loading' ? 'Enviando...' : 'Comenzar Registro'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
