"use client";

import { useState, useEffect } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  
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

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const isFormValid = selectedCategory && selectedSubcategory && title && description && location;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] font-sans">
      
      {/* 1. HEADER */}
      <header className={`fixed w-full top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 backdrop-blur-md border-b border-gray-100 py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/Logo_Perfil.png" alt="Logo" className="w-10 h-10 object-contain rounded-xl shadow-sm" onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=PC&background=2563EB&color=fff&rounded=true' }} />
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-[#2563EB]">Profesional</span> <span className="text-[#EA580C]">Cercano</span>
            </span>
          </div>

          {/* Nav Links Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#como-funciona" className="text-gray-600 hover:text-[#2563EB] font-medium transition-colors">¿Cómo funciona?</a>
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-[#2563EB] font-medium transition-colors">
                Iniciar Sesión
              </button>
              <button 
                onClick={() => setActiveModal("proAuth")} 
                className="bg-[#EA580C] hover:bg-[#c24100] text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Conviértete en Profesional
              </button>
            </div>
          </nav>

          {/* Nav Mobile Toggle (Visual solo) */}
          <button className="lg:hidden text-gray-600 p-2">
            <LucideIcons.Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <main className="flex-grow pt-32 pb-16 px-4 flex flex-col items-center relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 w-full h-[60vh] bg-gradient-to-b from-[#2563EB]/5 to-transparent -z-10" />
        
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
            Encuentra al experto que <span className="text-[#2563EB]">necesitas en minutos.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Fontaneros, electricistas y más de 50 profesionales locales listos para ayudarte. <strong className="text-gray-900">Sin intermediarios.</strong>
          </p>
        </div>

        {/* WIZARD FORM */}
        <div className="w-full max-w-xl bg-white p-6 md:p-8 rounded-[32px] shadow-[0_20px_60px_rgb(37,99,235,0.08)] border border-gray-100 z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-[#EA580C]/10 flex items-center justify-center">
              <LucideIcons.Zap className="w-5 h-5 text-[#EA580C]" />
            </div>
            <h2 className="text-[22px] font-bold text-gray-900">Soluciona tu problema</h2>
          </div>

          <div className="space-y-6">
            {/* TIPO DE SERVICIO */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Tipo de servicio</label>
              <button 
                onClick={() => setActiveModal("category")}
                className="w-full h-14 px-4 border-2 border-gray-100 hover:border-[#2563EB]/30 rounded-2xl flex items-center justify-between bg-gray-50/50 text-left focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all"
              >
                <span className={selectedSubcategory ? "text-gray-900 font-semibold" : "text-gray-400 font-medium"}>
                  {selectedSubcategory ? `${selectedCategory?.name} > ${selectedSubcategory.name || selectedSubcategory}` : "Selecciona una categoría..."}
                </span>
                <LucideIcons.ChevronDown className="w-5 h-5 text-[#EA580C]" />
              </button>
            </div>

            {/* CAMPOS ADICIONALES */}
            {selectedSubcategory && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Título de la necesidad</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-14 px-4 border-2 border-gray-100 rounded-2xl bg-gray-50/50 font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 outline-none transition-all" 
                    placeholder="Ej. El aire no enfría y hace ruido" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Explícanos qué sucede</label>
                  <textarea 
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50/50 font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 outline-none transition-all resize-none" 
                    placeholder="Detalla el problema para recibir mejores presupuestos..." 
                  />
                </div>
              </div>
            )}

            {/* UBICACION */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide flex items-center justify-between">
                Ubicación
                <span className="text-xs font-normal text-gray-400 normal-case">Solo detectaremos municipio</span>
              </label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 h-14 px-4 border-2 border-gray-100 rounded-2xl bg-gray-50/50 font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 outline-none transition-all" 
                  placeholder="Ej: Madrid Centro..." 
                />
                <button 
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(() => setLocation("Mi ubicación actual"));
                    }
                  }}
                  className="w-14 h-14 border-2 border-gray-100 rounded-2xl flex items-center justify-center text-[#EA580C] bg-white shadow-sm hover:bg-orange-50 hover:border-orange-200 transition-colors"
                >
                  <LucideIcons.MapPin className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* MULTIMEDIA */}
            {selectedSubcategory && (
              <div className="animate-in fade-in duration-300">
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Multimedia <span className="text-gray-400 text-xs font-normal normal-case">(Opcional)</span></label>
                <div className="grid grid-cols-3 gap-3">
                  <button className="h-12 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center gap-2 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors">
                    <LucideIcons.FilePlus className="w-4 h-4" /> Archivo
                  </button>
                  <button className="h-12 bg-[#2563EB]/5 border border-[#2563EB]/20 rounded-xl flex items-center justify-center gap-2 text-[#2563EB] font-semibold text-sm hover:bg-[#2563EB]/10 transition-colors">
                    <LucideIcons.Camera className="w-4 h-4" /> Foto
                  </button>
                  <button className="h-12 bg-[#EA580C]/5 border border-[#EA580C]/20 rounded-xl flex items-center justify-center gap-2 text-[#EA580C] font-semibold text-sm hover:bg-[#EA580C]/10 transition-colors">
                    <LucideIcons.PlayCircle className="w-4 h-4" /> Vídeo
                  </button>
                </div>
              </div>
            )}

            <button 
              onClick={() => handleRequestSubmit()}
              disabled={!isFormValid}
              className={`w-full h-14 rounded-2xl font-bold text-lg mt-6 transition-all duration-300 ${isFormValid ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] shadow-[0_8px_20px_rgb(37,99,235,0.3)] hover:-translate-y-1' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              Solicitar Presupuestos
            </button>
          </div>
        </div>
      </main>

      {/* 3. SECCIÓN INFORMATIVA */}
      <section id="como-funciona" className="w-full bg-white border-t border-b border-gray-100 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">La forma más rápida de contratar</h2>
            <p className="text-lg text-gray-600">Olvídate de buscar, nosotros te traemos a los profesionales.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-3xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <LucideIcons.Search className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Busca</h3>
              <p className="text-gray-600 leading-relaxed">Dinos qué necesitas arreglar o construir llenando un simple formulario en segundos.</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-3xl bg-[#EA580C]/10 text-[#EA580C] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <LucideIcons.MessageSquare className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Conecta</h3>
              <p className="text-gray-600 leading-relaxed">Recibe presupuestos y propuestas de profesionales locales verificados al instante.</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-3xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <LucideIcons.CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Resuelve</h3>
              <p className="text-gray-600 leading-relaxed">Elige al mejor, coordina el trabajo y paga directamente sin comisiones extras.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="bg-[#0f172a] text-white pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6 grayscale brightness-200">
                <img src="/Logo_Perfil.png" alt="Logo" className="w-10 h-10 object-contain rounded-xl" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                <span className="text-2xl font-extrabold tracking-tight">Profesional Cercano</span>
              </div>
              <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
                La plataforma líder para conectar clientes con profesionales de confianza en tu localidad.
              </p>
              <div className="flex gap-4">
                {/* Badges Falsos para App Store y Google Play */}
                <button className="bg-white/10 hover:bg-white/20 border border-white/20 transition-colors rounded-xl px-4 py-2 flex items-center gap-3">
                  <LucideIcons.Apple className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-[10px] text-gray-300">Descargar en</div>
                    <div className="text-sm font-bold">App Store</div>
                  </div>
                </button>
                <button className="bg-white/10 hover:bg-white/20 border border-white/20 transition-colors rounded-xl px-4 py-2 flex items-center gap-3">
                  <LucideIcons.Play className="w-5 h-5 ml-1" />
                  <div className="text-left">
                    <div className="text-[10px] text-gray-300">Disponible en</div>
                    <div className="text-sm font-bold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6">Plataforma</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Buscar profesionales</a></li>
                <li><a href="#" onClick={(e) => {e.preventDefault(); setActiveModal("proAuth")}} className="hover:text-white transition-colors">Soy Profesional</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preguntas frecuentes</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Profesional Cercano. Todos los derechos reservados.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white"><LucideIcons.Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white"><LucideIcons.Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white"><LucideIcons.Twitter className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL 1: CATEGORIES */}
      {activeModal === "category" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] p-6 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setActiveModal("none")}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#EA580C] text-gray-600 hover:bg-orange-50 transition-colors z-10"
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
                  className="aspect-square rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#EA580C]/30 transition-all flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#EA580C]/10 text-[#EA580C] flex items-center justify-center group-hover:scale-110 transition-transform">
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
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#EA580C] text-gray-600 hover:bg-orange-50 transition-colors z-10"
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
                  className="aspect-square rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#EA580C]/30 transition-all flex flex-col items-center justify-center gap-2 group p-2 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-[#EA580C]/10 text-[#EA580C] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <IconRenderer name={sub.icon || selectedCategory.icon} className="w-7 h-7" />
                  </div>
                  <span className="font-bold text-gray-900 text-xs leading-tight">{sub.name}</span>
                </button>
              ))}
              <button 
                onClick={() => { setSelectedSubcategory("Otro servicio"); setActiveModal("none"); }}
                className="aspect-square rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#EA580C]/30 transition-all flex flex-col items-center justify-center gap-2 group p-2 text-center"
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

      {/* MODAL 3: AUTH B2C */}
      {activeModal === "auth" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl relative">
            <button 
              onClick={() => setActiveModal("none")}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <LucideIcons.X className="w-4 h-4" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Casi listo</h3>
            <p className="text-gray-500 mb-6 text-sm">Ingresa tus datos de contacto para enviarte presupuestos.</p>
            
            <form onSubmit={(e) => handleRequestSubmit(e)} className="space-y-4">
              <input required type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-[#2563EB]" placeholder="Nombre completo" />
              <input required type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-[#2563EB]" placeholder="Teléfono" />
              <input required type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-[#2563EB]" placeholder="Correo electrónico" />
              
              <button type="submit" disabled={requestStatus === 'loading'} className="w-full h-14 bg-[#EA580C] hover:bg-[#c24100] text-white font-bold rounded-2xl mt-2 disabled:opacity-70 transition-colors shadow-lg shadow-orange-500/20">
                {requestStatus === 'loading' ? 'Enviando...' : 'Confirmar Solicitud'}
              </button>

              {requestStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl mt-4 text-center font-bold text-sm">
                  ¡Solicitud publicada con éxito!
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: PRO REGISTRATION */}
      {activeModal === "proAuth" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative border border-gray-100">
            <button 
              onClick={() => setActiveModal("none")}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <LucideIcons.X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
                <LucideIcons.Briefcase className="w-5 h-5 text-[#2563EB]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Únete a la red</h3>
            </div>
            <p className="text-gray-500 mb-6 text-sm">Consigue nuevos clientes locales cada día. Regístrate gratis.</p>
            
            <form onSubmit={handleProRegister} className="space-y-4">
              <input required type="text" value={proName} onChange={e => setProName(e.target.value)} className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all" placeholder="Nombre o Empresa" />
              <input required type="email" value={proEmail} onChange={e => setProEmail(e.target.value)} className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all" placeholder="Correo electrónico" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="tel" value={proPhone} onChange={e => setProPhone(e.target.value)} className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all" placeholder="Teléfono" />
                <input required type="text" value={proSpecialty} onChange={e => setProSpecialty(e.target.value)} className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all" placeholder="Tu Especialidad" />
              </div>
              <button type="submit" disabled={proStatus === 'loading'} className="w-full h-14 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold rounded-2xl mt-4 disabled:opacity-70 transition-colors shadow-lg shadow-blue-500/20">
                {proStatus === 'loading' ? 'Enviando...' : 'Comenzar Registro'}
              </button>
              {proStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl mt-4 text-center font-bold text-sm">
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
