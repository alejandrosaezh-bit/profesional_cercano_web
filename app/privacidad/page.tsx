import Link from "next/link";

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-orange-500 hover:text-orange-400 font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Volver al inicio
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-8">Política de Privacidad y Tratamiento de Datos</h1>
        <div className="space-y-6 text-lg leading-relaxed">

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Información que Recopilamos</h2>
          <p>Para garantizar la seguridad y operatividad de la Plataforma, recopilamos los siguientes datos:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>De todos los usuarios:</strong> Nombre completo, correo electrónico, número de teléfono y datos de acceso.</li>
            <li><strong>De los Profesionales (KYC):</strong> Para el proceso de verificación de identidad, se requerirá una fotografía de la Cédula de Identidad (frente y reverso) y una fotografía del rostro del Profesional ("selfie").</li>
            <li><strong>Datos Financieros:</strong> En caso de suscripciones, recopilaremos datos de facturación y recibos de transacciones (ej. referencias de Pago Móvil o transferencias bancarias). No almacenamos números de tarjetas de crédito o débito en nuestros servidores.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Uso de la Ubicación (Geolocalización)</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Uso General:</strong> La Plataforma requiere acceso a la ubicación para determinar el municipio o zona donde se solicita u ofrece el servicio. Este seguimiento no es en tiempo real de forma continua, sino que se captura al momento de la interacción.</li>
            <li><strong>Casos de Urgencia:</strong> En servicios categorizados como "Urgencias" (ej. grúas, mensajería expresa), el Cliente tendrá la opción voluntaria de compartir su ubicación exacta por GPS (coordenadas) para facilitar y agilizar la prestación del servicio.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Permisos del Dispositivo</h2>
          <p>La aplicación solicitará acceso a:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Cámara y Galería:</strong> Exclusivamente para la subida de fotos de perfil, imágenes de verificación de identidad y fotos de los trabajos/servicios.</li>
            <li><strong>Ubicación:</strong> Según lo descrito en el punto anterior sobre Geolocalización.</li>
            <li><strong>Notificaciones Push:</strong> Para informar sobre nuevas solicitudes de trabajo, mensajes, actualizaciones de estado y cambios en la suscripción.</li>
          </ol>
          <p className="text-sm text-slate-400 mt-2"><em>* La aplicación NO solicita ni accede al micrófono ni a la lista de contactos de su dispositivo bajo ninguna circunstancia.</em></p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Protección de Datos y Compartición</h2>
          <p>
            Tus datos personales y documentos de identidad están almacenados de forma segura utilizando protocolos de encriptación modernos. La Plataforma <strong>no vende, alquila ni comercializa</strong> tu información personal a terceros.
          </p>
          <p>
            La información solo podrá ser compartida con autoridades competentes de la República Bolivariana de Venezuela en caso de una orden judicial expresa o investigación legal en curso.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Eliminación de Datos (Derecho al Olvido)</h2>
          <p>
            El usuario tiene derecho a solicitar la eliminación definitiva de su cuenta y sus datos personales en cualquier momento desde las configuraciones de la aplicación o contactándonos directamente. 
          </p>
          <p>
            Sin embargo, por razones de seguridad, prevención de fraude y cumplimiento legal (prevención de legitimación de capitales), la Plataforma podría retener información transaccional básica y el registro de identidad de Profesionales verificados por un período prudencial posterior a la solicitud de eliminación.
          </p>
        </div>
      </div>
    </div>
  );
}
