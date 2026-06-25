/* eslint-disable */
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
  const [categories, setCategories] = useState<any[]>([
    { id: "fallback-1", name: "Electricidad", icon: "zap", subcategories: [{ id: "sub-1", name: "Electricista General", icon: "zap" }] },
    { id: "fallback-2", name: "Plomería", icon: "droplet", subcategories: [{ id: "sub-2", name: "Servicio de Plomería", icon: "droplet" }] },
    { id: "fallback-3", name: "Hogar", icon: "home", subcategories: [{ id: "sub-3", name: "Limpieza General", icon: "sparkles" }] },
    { id: "fallback-4", name: "Tecnología", icon: "monitor", subcategories: [{ id: "sub-4", name: "Soporte Técnico", icon: "laptop" }] }
  ]);
  
  // States de UI
  const [activeModal, setActiveModal] = useState<"none" | "category" | "subcategory" | "auth" | "proAuth">("none");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userCity, setUserCity] = useState<string>("Tu Ciudad");
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [mapAvatars, setMapAvatars] = useState<any[]>([]);
  
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

    fetch("https://ipinfo.io/json")
      .then(res => res.json())
      .then(data => {
        if (data && data.city) setUserCity(data.city);
        if (data && data.loc) {
          const [lat, lon] = data.loc.split(",");
          setUserLocation({ lat: parseFloat(lat), lon: parseFloat(lon) });
        }
      })
      .catch(() => {
        // Fallback silencioso en caso de que un AdBlocker bloquee la API
      });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [API_URL]);

  useEffect(() => {
    if (categories.length > 0) {
      const menNames = ["Juan", "Carlos", "Luis", "Pedro", "Miguel", "Antonio", "Javier"];
      const womenNames = ["María", "Ana", "Elena", "Sofía", "Lucía", "Carmen", "Laura"];
      const allSubs: any[] = [];
      categories.forEach(c => {
        if (c.subcategories) {
          c.subcategories.forEach((sub: any) => {
            allSubs.push({ name: sub.name, icon: sub.icon || c.icon });
          });
        }
      });
      if (allSubs.length > 0) {
        const generated = Array.from({length: 12}).map((_, i) => {
          const randomSub = allSubs[Math.floor(Math.random() * allSubs.length)];
          const isMale = Math.random() > 0.5;
          const randomName = isMale ? menNames[Math.floor(Math.random() * menNames.length)] : womenNames[Math.floor(Math.random() * womenNames.length)];
          const genderPath = isMale ? 'men' : 'women';
          const randomImageId = Math.floor(Math.random() * 90) + 1;
          const top = 10 + Math.random() * 70; 
          const left = i % 2 === 0 ? (2 + Math.random() * 25) : (65 + Math.random() * 30);
          const radius = 200 + Math.random() * 300; // Random radius between 200px and 500px
          return { 
            id: i, 
            name: randomName, 
            service: randomSub.name, 
            icon: randomSub.icon, 
            top: `${top}%`, 
            left: `${left}%`, 
            radius,
            imageUrl: `https://randomuser.me/api/portraits/${genderPath}/${randomImageId}.jpg`
          };
        });
        setMapAvatars(generated);
      }
    }
  }, [categories]);

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
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain rounded-xl shadow-sm bg-white p-0.5" onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=PC&background=2563EB&color=fff&rounded=true' }} />
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-[#2563EB]">Profesional</span> <span className="text-[#EA580C]">Cercano</span>
            </span>
          </div>

          {/* Nav Links Desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            <a href="#como-funciona" className="text-gray-600 hover:text-[#2563EB] font-medium transition-colors">¿Cómo funciona?</a>
            <a href="#servicios" className="text-gray-600 hover:text-[#2563EB] font-medium transition-colors">Servicios</a>
            <a href="#privacidad" className="text-gray-600 hover:text-[#2563EB] font-medium transition-colors">Privacidad y Seguridad</a>
            <button 
              onClick={() => setActiveModal("proAuth")} 
              className="ml-2 bg-[#EA580C] hover:bg-[#c24100] text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Conviértete en Profesional
            </button>
          </nav>

          {/* Nav Mobile Toggle */}
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-gray-600 p-2">
            <LucideIcons.Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-white shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <span className="text-2xl font-black tracking-tighter">
                <span className="text-[#2563EB]">Profesional</span>
                <span className="text-[#EA580C]">Cercano</span>
              </span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-600 p-2">
                <LucideIcons.X className="w-8 h-8" />
              </button>
            </div>
            <nav className="flex flex-col gap-6 text-lg font-medium text-gray-700">
              <a href="#como-funciona" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-gray-100 pb-4 hover:text-[#2563EB]">Cómo Funciona</a>
              <a href="#servicios" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-gray-100 pb-4 hover:text-[#2563EB]">Servicios</a>
              <a href="#privacidad" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-gray-100 pb-4 hover:text-[#2563EB]">Privacidad y Seguridad</a>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); setActiveModal("proAuth"); }} 
                className="mt-4 bg-[#EA580C] text-white px-6 py-3 rounded-xl font-bold shadow-lg"
              >
                Conviértete en Profesional
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <main className="flex-grow pt-24 pb-16 px-4 flex flex-col items-center justify-center relative overflow-hidden bg-[#eef2f6] min-h-[95vh]">
        
        {/* Real Dynamic Map (Full Width) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {userLocation ? (
            <iframe 
              width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight={0} marginWidth={0} 
              srcDoc={`
                <!DOCTYPE html>
                <html>
                <head>
                  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                  <style>body, html, #map { margin: 0; padding: 0; height: 100%; width: 100%; background: #eef2f6; }</style>
                </head>
                <body>
                  <div id="map"></div>
                  <script>
                    var map = L.map('map', { zoomControl: false, attributionControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false }).setView([${userLocation.lat}, ${userLocation.lon}], 14);
                    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png').addTo(map);
                  </script>
                </body>
                </html>
              `}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#eef2f6]" />
          )}
        </div>

        {/* Dynamic City Name Watermark (Subtle shadow over the sharp map) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-[0.08] pointer-events-none w-full text-center">
           <span className="text-[80px] md:text-[150px] font-black text-gray-900 uppercase tracking-tighter leading-none whitespace-nowrap">{userCity}</span>
        </div>

        {/* Floating Avatars */}
        {mapAvatars.map((av) => (
          <div key={av.id} className="absolute z-10 hidden md:flex flex-col items-center animate-in fade-in zoom-in duration-1000" style={{ top: av.top, left: av.left }}>
            
            {/* Coverage Ring */}
            <div 
              className="absolute bg-[#EA580C]/5 border-2 border-[#EA580C]/20 rounded-full animate-pulse z-0 pointer-events-none" 
              style={{ 
                width: `${av.radius}px`, 
                height: `${av.radius}px`, 
                top: '2rem', // Center roughly on the avatar image
                left: '50%',
                transform: 'translate(-50%, -50%)',
                animationDuration: `${3 + Math.random() * 2}s` 
              }} 
            />

            <div className="w-16 h-16 rounded-full border-4 border-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] overflow-hidden bg-white mb-2 relative group hover:scale-110 transition-transform cursor-pointer hover:border-[#EA580C] z-10">
              <img src={av.imageUrl || `https://i.pravatar.cc/150?u=${av.id}`} alt={av.name} className="w-full h-full object-cover" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <LucideIcons.Check className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-xl text-center border border-gray-100 transform -translate-y-2 group-hover:-translate-y-4 transition-all">
               <p className="text-sm font-extrabold text-gray-900 leading-tight">{av.name}</p>
               <p className="text-[11px] font-bold text-[#EA580C]">{av.service}</p>
            </div>
          </div>
        ))}
        
        {/* UNIFIED HERO CARD */}
        <div className="w-full max-w-xl bg-white/95 backdrop-blur-2xl p-6 md:p-8 rounded-[32px] shadow-[0_30px_80px_rgb(37,99,235,0.15)] border-2 border-white z-20 relative mt-8 mb-4">
          
          <div className="text-center mb-8 pb-8 border-b border-gray-100">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mb-3">
              Encuentra al experto que <span className="text-[#2563EB]">necesitas en minutos.</span>
            </h1>
            <p className="text-base text-gray-800 font-medium">
              Fontaneros, electricistas y más de 50 profesionales listos para ayudarte. <strong className="text-gray-900">Sin intermediarios.</strong>
            </p>
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-2xl md:text-[28px] font-extrabold text-gray-900 tracking-tight leading-tight">¿Qué servicio buscas hoy?</h2>
          </div>

          <div className="space-y-6">
            {/* TIPO DE SERVICIO */}
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Tipo de servicio</label>
              <button 
                onClick={() => setActiveModal("category")}
                className="w-full h-14 px-4 border-2 border-gray-300 hover:border-gray-400 rounded-2xl flex items-center justify-between bg-white text-left focus:border-[#2563EB] transition-all cursor-pointer group"
              >
                <span className={selectedSubcategory ? "text-gray-900 font-semibold text-lg" : "text-gray-400 font-semibold text-lg"}>
                  {selectedSubcategory ? `${selectedCategory?.name} > ${selectedSubcategory.name || selectedSubcategory}` : "Seleccione..."}
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
              <label className="block text-base font-bold text-gray-900 mb-1">¿Dónde necesitas el servicio?</label>
              <p className="text-sm text-gray-500 mb-3">Solo detectaremos tu municipio.</p>
              <div className="flex gap-3 group">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-14 px-4 border-2 border-gray-300 hover:border-gray-400 rounded-2xl bg-white font-semibold text-gray-900 placeholder:text-gray-400 text-lg focus:border-[#2563EB] outline-none transition-all" 
                    placeholder="Ej: Chacao, Hatillo..." 
                  />
                </div>
                <button 
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(() => setLocation("Mi ubicación actual"));
                    }
                  }}
                  title="Usar mi ubicación actual"
                  className="w-14 h-14 border-2 border-gray-300 rounded-2xl flex items-center justify-center bg-white hover:bg-gray-50 transition-all shadow-sm"
                >
                  <LucideIcons.MapPin className="w-6 h-6 text-red-500 fill-red-500" />
                </button>
              </div>
            </div>

            {/* MULTIMEDIA */}
            {selectedSubcategory && (
              <div className="animate-in fade-in duration-300">
                <label className="block text-base font-bold text-gray-900 mb-1">Complementa con una imagen o Vídeo</label>
                <p className="text-[13px] text-gray-500 italic mb-4">*Añadir multimedia ayuda a recibir mejores presupuestos.</p>
                <div className="grid grid-cols-3 gap-3">
                  <button className="h-12 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center gap-2 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors">
                    <LucideIcons.FilePlus className="w-4 h-4" /> Archivo
                  </button>
                  <button className="h-12 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-center gap-2 text-[#2563EB] font-semibold text-sm hover:bg-blue-50 transition-colors">
                    <LucideIcons.Camera className="w-4 h-4" /> Foto
                  </button>
                  <button className="h-12 bg-red-50/50 border border-red-100 rounded-xl flex items-center justify-center gap-2 text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors">
                    <LucideIcons.PlayCircle className="w-4 h-4" /> Vídeo
                  </button>
                </div>
              </div>
            )}

            <button 
              onClick={() => handleRequestSubmit()}
              disabled={!isFormValid}
              className={`w-full h-14 rounded-2xl font-bold text-lg mt-6 transition-all duration-300 ${isFormValid ? 'bg-slate-400 text-white hover:bg-slate-500 shadow-md hover:-translate-y-1' : 'bg-slate-300 text-white opacity-80 cursor-not-allowed'}`}
            >
              Encontrar ayuda
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
              <div className="flex items-center gap-3 mb-6">
                <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain rounded-xl bg-white p-0.5" onError={(e) => { e.currentTarget.style.display = 'none' }} />
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
                <li><a href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
                <li><a href="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</a></li>
                <li><a href="/contacto" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Profesional Cercano. Todos los derechos reservados.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
              </a>
              <a href="#" className="hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" /></svg>
              </a>
              <a href="#" className="hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
              </a>
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
            
            <div className="text-center mb-6 mt-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EA580C]/10 flex items-center justify-center mb-4">
                <LucideIcons.Smartphone className="w-8 h-8 text-[#EA580C]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Descarga la App para Profesionales</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Todo el trabajo, las solicitudes de clientes y tus ganancias se gestionan exclusivamente desde nuestra aplicación móvil.</p>
            </div>

            <div className="flex gap-3 justify-center mb-8">
               <button className="flex-1 bg-black text-white rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                  <LucideIcons.Apple className="w-6 h-6" />
                  <div className="text-left leading-tight">
                     <div className="text-[10px] text-gray-300">Descargar en</div>
                     <div className="text-sm font-bold">App Store</div>
                  </div>
               </button>
               <button className="flex-1 bg-black text-white rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                  <LucideIcons.Play className="w-5 h-5 ml-1" />
                  <div className="text-left leading-tight">
                     <div className="text-[10px] text-gray-300">Disponible en</div>
                     <div className="text-sm font-bold">Google Play</div>
                  </div>
               </button>
            </div>

            <div className="relative flex items-center py-2 mb-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">¿Prefieres atención humana?</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <p className="text-gray-500 mb-4 text-sm text-center">Déjanos tus datos y un asesor te ayudará a crear tu cuenta paso a paso.</p>
            
            <form onSubmit={handleProRegister} className="space-y-4">
              <input required type="text" value={proName} onChange={e => setProName(e.target.value)} className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/10 transition-all" placeholder="Nombre completo" />
              <input required type="tel" value={proPhone} onChange={e => setProPhone(e.target.value)} className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/10 transition-all" placeholder="Número de WhatsApp" />
              <button type="submit" disabled={proStatus === 'loading'} className="w-full h-14 bg-white border-2 border-[#EA580C] text-[#EA580C] hover:bg-[#EA580C] hover:text-white font-bold rounded-2xl mt-2 transition-colors">
                {proStatus === 'loading' ? 'Enviando...' : 'Solicitar ayuda para registrarme'}
              </button>
              {proStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl mt-4 text-center font-bold text-sm">
                  ¡Datos recibidos! Te escribiremos por WhatsApp pronto.
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
