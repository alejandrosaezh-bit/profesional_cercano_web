"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import * as LucideIcons from "lucide-react";

// Motor de Iconos Dinámico (exactamente igual a la App Móvil)
const IconRenderer = ({ name, className = "w-7 h-7" }: { name: string, className?: string }) => {
  if (!name) return <LucideIcons.Wrench className={className} />;
  const iconName = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Wrench;
  return <IconComponent className={className} />;
};

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  
  // States de UI
  const [activeModal, setActiveModal] = useState<"none" | "category" | "subcategory" | "auth" | "proAuth">("none");
  
  // Data de la solicitud
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  
  // Data de Auth
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [requestStatus, setRequestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Pro Data
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

  const handleRequestSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedCategory || !selectedSubcategory || !title || !description || !location) {
      alert("Por favor completa todos los campos del formulario antes de continuar.");
      return;
    }

    if (activeModal !== "auth") {
      setActiveModal("auth");
      return;
    }

    setRequestStatus("loading");
    try {
      const res = await fetch(`${API_URL}/web-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          category: selectedCategory._id || selectedCategory.name,
          subcategory: selectedSubcategory.name || selectedSubcategory,
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
        setActiveModal("none");
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setTitle("");
        setDescription("");
        setLocation("");
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
        setActiveModal("none");
        setProStatus("idle");
      }, 3000);
    } catch (error) {
      console.error(error);
      setProStatus("error");
    }
  };

  // Check if form is valid to enable button
  const isFormValid = selectedCategory && selectedSubcategory && title && description && location;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      {/* NAVBAR */}
      <header className="fixed w-full top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold"><span className="text-[#0052cc]">Profesional</span> <span className="text-[#e65c00]">Cercano</span></span>
          </div>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-[#e65c00] text-white flex items-center justify-center">
              <LucideIcons.User className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveModal("proAuth")} className="w-10 h-10 rounded-full bg-blue-50 text-[#0052cc] flex items-center justify-center">
              <LucideIcons.Hammer className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-12 px-4 flex justify-center">
        {/* MAIN REQUEST CARD */}
        <div className="w-full max-w-xl bg-white p-6 md:p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <h1 className="text-[28px] font-bold text-gray-900 leading-tight mb-8">
            Hola, soluciona tu problema o urgencia
          </h1>

          <div className="space-y-6">
            {/* TIPO DE SERVICIO */}
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Tipo de servicio</label>
              <button 
                onClick={() => setActiveModal("category")}
                className="w-full h-14 px-4 border border-gray-300 rounded-2xl flex items-center justify-between bg-white text-left focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc] transition-all"
              >
                <span className={selectedSubcategory ? "text-gray-900 font-medium" : "text-gray-400 font-medium"}>
                  {selectedSubcategory ? `${selectedCategory?.name} > ${selectedSubcategory.name || selectedSubcategory}` : "Seleccione..."}
                </span>
                <LucideIcons.ChevronDown className="w-5 h-5 text-[#e65c00]" />
              </button>
            </div>

            {/* CAMPOS ADICIONALES (Se muestran al elegir categoría) */}
            {selectedSubcategory && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                <div>
                  <label className="block text-base font-bold text-gray-900 mb-2">Ponle un título a tu necesidad</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-14 px-4 border border-gray-300 rounded-2xl bg-white font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc] outline-none transition-all" 
                    placeholder="Ej. El aire no enfría y hace un ruido" 
                  />
                </div>
                
                <div>
                  <label className="block text-base font-bold text-gray-900 mb-2">Explícanos qué sucede</label>
                  <textarea 
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-2xl bg-white font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc] outline-none transition-all resize-none" 
                    placeholder="Ej. un Samsung de 12.000 btu, que dejo de enfriar poco a poco..." 
                  />
                </div>
              </div>
            )}

            {/* UBICACION */}
            <div>
              <label className="block text-base font-bold text-gray-900 mb-1">¿Dónde necesitas el servicio?</label>
              <p className="text-sm text-gray-500 mb-3">Solo detectaremos tu municipio.</p>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 h-14 px-4 border border-gray-300 rounded-2xl bg-white font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc] outline-none transition-all" 
                  placeholder="Ej: Chacao, Hatillo..." 
                />
                <button 
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(() => {
                        setLocation("Mi ubicación actual");
                      });
                    }
                  }}
                  className="w-14 h-14 border border-gray-300 rounded-2xl flex items-center justify-center text-[#ff3b30] hover:bg-red-50 transition-colors"
                >
                  <LucideIcons.MapPin className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* MULTIMEDIA */}
            {selectedSubcategory && (
              <div className="animate-in fade-in duration-300">
                <label className="block text-base font-bold text-gray-900 mb-1">Complementa con una imagen o Vídeo</label>
                <p className="text-sm text-gray-500 italic mb-3">*Añadir multimedia ayuda a recibir mejores presupuestos.</p>
                <div className="flex flex-wrap gap-3">
                  <button className="flex-1 min-w-[100px] h-12 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center gap-2 text-gray-700 font-bold text-sm hover:bg-gray-100 transition-colors">
                    <LucideIcons.FilePlus className="w-5 h-5 text-gray-500" /> Archivo
                  </button>
                  <button className="flex-1 min-w-[100px] h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center gap-2 text-[#0052cc] font-bold text-sm hover:bg-blue-100 transition-colors">
                    <LucideIcons.Camera className="w-5 h-5" /> Foto
                  </button>
                  <button className="flex-1 min-w-[100px] h-12 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center gap-2 text-[#d32f2f] font-bold text-sm hover:bg-red-100 transition-colors">
                    <LucideIcons.PlayCircle className="w-5 h-5" /> Vídeo
                  </button>
                </div>
              </div>
            )}

            <button 
              onClick={() => handleRequestSubmit()}
              disabled={!isFormValid}
              className={`w-full h-14 rounded-2xl font-bold text-lg mt-6 transition-all ${isFormValid ? 'bg-[#8ba1b5] text-white hover:bg-[#7a8f9f] shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Solicitar servicio
            </button>
          </div>
        </div>
      </main>

      {/* MODAL 1: CATEGORIES */}
      {activeModal === "category" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] p-6 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setActiveModal("none")}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#ff9500] text-gray-600 hover:bg-orange-50 transition-colors z-10"
            >
              <LucideIcons.X className="w-5 h-5" />
            </button>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-1 pr-12">¿Qué área necesitas?</h3>
            <p className="text-gray-500 text-sm mb-6">Selecciona la categoría de tu solicitud</p>
            
            <div className="grid grid-cols-3 gap-3">
              {categories.map((cat, i) => (
                <button 
                  key={i}
                  onClick={() => { setSelectedCategory(cat); setActiveModal("subcategory"); }}
                  className="aspect-square rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#fff5eb] text-[#e65c00] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconRenderer name={cat.icon} className="w-7 h-7" />
                  </div>
                  <span className="font-bold text-gray-900 text-xs text-center px-1">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SUBCATEGORIES */}
      {activeModal === "subcategory" && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] p-6 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setActiveModal("category")}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#ff9500] text-gray-600 hover:bg-orange-50 transition-colors z-10"
            >
              <LucideIcons.X className="w-5 h-5" />
            </button>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-1 pr-12">{selectedCategory.name}: Especialidades</h3>
            <p className="text-gray-500 text-sm mb-6">Selecciona el servicio específico</p>
            
            <div className="grid grid-cols-3 gap-3">
              {selectedCategory.subcategories?.map((sub: any, i: number) => (
                <button 
                  key={i}
                  onClick={() => { setSelectedSubcategory(sub); setActiveModal("none"); }}
                  className="aspect-square rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all flex flex-col items-center justify-center gap-2 group p-2 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-[#fff5eb] text-[#e65c00] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <IconRenderer name={sub.icon || selectedCategory.icon} className="w-7 h-7" />
                  </div>
                  <span className="font-bold text-gray-900 text-xs leading-tight">{sub.name}</span>
                </button>
              ))}
              <button 
                onClick={() => { setSelectedSubcategory("Otro servicio"); setActiveModal("none"); }}
                className="aspect-square rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all flex flex-col items-center justify-center gap-2 group p-2 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <LucideIcons.MoreHorizontal className="w-7 h-7" />
                </div>
                <span className="font-bold text-gray-900 text-xs leading-tight">Otro</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: AUTH B2C (Client Login/Signup for Request) */}
      {activeModal === "auth" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl relative">
            <button 
              onClick={() => setActiveModal("none")}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
            >
              <LucideIcons.X className="w-4 h-4" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Casi listo</h3>
            <p className="text-gray-500 mb-6 text-sm">Ingresa tus datos de contacto para enviarte presupuestos.</p>
            
            <form onSubmit={(e) => handleRequestSubmit(e)} className="space-y-4">
              <input required type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full h-12 px-4 border border-gray-300 rounded-xl bg-gray-50 outline-none focus:border-[#0052cc]" placeholder="Nombre completo" />
              <input required type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} className="w-full h-12 px-4 border border-gray-300 rounded-xl bg-gray-50 outline-none focus:border-[#0052cc]" placeholder="Teléfono" />
              <input required type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} className="w-full h-12 px-4 border border-gray-300 rounded-xl bg-gray-50 outline-none focus:border-[#0052cc]" placeholder="Correo electrónico" />
              
              <button type="submit" disabled={requestStatus === 'loading'} className="w-full h-14 bg-[#e65c00] text-white font-bold rounded-2xl mt-2 disabled:opacity-70">
                {requestStatus === 'loading' ? 'Enviando...' : 'Confirmar Solicitud'}
              </button>

              {requestStatus === 'success' && (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl mt-4 text-center font-bold text-sm">
                  ¡Solicitud publicada con éxito!
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: PRO REGISTRATION (B2B) */}
      {activeModal === "proAuth" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setActiveModal("none")}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
            >
              <LucideIcons.X className="w-4 h-4" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Registro Profesional</h3>
            <p className="text-gray-500 mb-6 text-sm">Únete a nuestra red de expertos.</p>
            
            <form onSubmit={handleProRegister} className="space-y-4">
              <input required type="text" value={proName} onChange={e => setProName(e.target.value)} className="w-full h-12 px-4 border border-gray-300 rounded-xl bg-gray-50 outline-none focus:border-[#e65c00]" placeholder="Nombre o Empresa" />
              <input required type="email" value={proEmail} onChange={e => setProEmail(e.target.value)} className="w-full h-12 px-4 border border-gray-300 rounded-xl bg-gray-50 outline-none focus:border-[#e65c00]" placeholder="Correo electrónico" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="tel" value={proPhone} onChange={e => setProPhone(e.target.value)} className="w-full h-12 px-4 border border-gray-300 rounded-xl bg-gray-50 outline-none focus:border-[#e65c00]" placeholder="Teléfono" />
                <input required type="text" value={proSpecialty} onChange={e => setProSpecialty(e.target.value)} className="w-full h-12 px-4 border border-gray-300 rounded-xl bg-gray-50 outline-none focus:border-[#e65c00]" placeholder="Especialidad" />
              </div>
              <button type="submit" disabled={proStatus === 'loading'} className="w-full h-14 bg-[#0052cc] text-white font-bold rounded-2xl mt-2 disabled:opacity-70">
                {proStatus === 'loading' ? 'Enviando...' : 'Comenzar Registro'}
              </button>
              {proStatus === 'success' && (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl mt-4 text-center font-bold text-sm">
                  ¡Registro exitoso! Te contactaremos pronto.
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
