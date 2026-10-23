"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactoPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "general_contact",
          name,
          email,
          phone,
          message,
        }),
      });
      if (!res.ok) throw new Error("Error enviando formulario");
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-8 md:p-16 flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full">
        <div className="mb-8">
          <Link href="/" className="text-orange-500 hover:text-orange-400 font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Volver al inicio
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-2xl shadow-xl">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Contacto y Soporte</h1>
            <p className="text-base text-slate-400 mb-8">
              Si necesitas contratar un servicio, registrarte como profesional verificado o consultar sobre nuestras políticas en Venezuela, nuestro equipo y nuestra asistente IA <strong>Sofía</strong> están listos para atenderte.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-500/20 p-3 rounded-lg text-orange-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Correos Oficiales</h3>
                  <p className="text-slate-400 text-sm mt-1">Atención general y comercial:</p>
                  <a href="mailto:info@profesionalcercano.com" className="text-orange-500 hover:underline font-medium block">info@profesionalcercano.com</a>
                  <p className="text-slate-400 text-sm mt-2">Soporte legal y privacidad:</p>
                  <a href="mailto:legal@profesionalcercano.com" className="text-orange-500 hover:underline font-medium block">legal@profesionalcercano.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-500/20 p-3 rounded-lg text-orange-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">WhatsApp Directo</h3>
                  <p className="text-slate-400 text-sm mt-1">Atención inmediata en Venezuela:</p>
                  <a href="https://wa.me/584222537239" target="_blank" rel="noreferrer" className="text-orange-500 hover:underline font-semibold inline-block mt-1">
                    +58 422-2537239
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-500/20 p-3 rounded-lg text-orange-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Operaciones</h3>
                  <p className="text-slate-400 text-sm mt-1">Soluciones Digitales Creapptivas C.A. — República Bolivariana de Venezuela.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-white mb-4">Envíanos un mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nombre completo"
                className="w-full h-11 px-4 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:border-orange-500"
              />
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="w-full h-11 px-4 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:border-orange-500"
              />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Teléfono / WhatsApp (ej. 0422-2537239)"
                className="w-full h-11 px-4 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:border-orange-500"
              />
              <textarea
                required
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="¿En qué podemos ayudarte?"
                className="w-full p-4 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full h-12 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-colors disabled:opacity-60"
              >
                {status === "loading" ? "Enviando..." : "Enviar mensaje"}
              </button>
              {status === "success" && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-300 rounded-lg text-sm">
                  ¡Mensaje enviado! Sofía IA ya te envió una confirmación a tu correo y registró tu solicitud.
                </div>
              )}
              {status === "error" && (
                <div className="p-3 bg-red-950/80 border border-red-700 text-red-300 rounded-lg text-sm">
                  Ocurrió un error al enviar. Por favor intenta de nuevo o escríbenos por WhatsApp.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
