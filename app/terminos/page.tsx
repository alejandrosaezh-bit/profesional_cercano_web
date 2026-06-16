import Link from "next/link";

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-orange-500 hover:text-orange-400 font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Volver al inicio
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-8">Términos y Condiciones de Uso</h1>
        <div className="space-y-6 text-lg leading-relaxed">
          <p><strong>Fecha de última actualización:</strong> Mayo 2026<br/>
          <strong>Jurisdicción:</strong> República Bolivariana de Venezuela</p>
          
          <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded text-orange-200 text-base">
            <strong>Aviso Legal:</strong> Este documento es un borrador redactado con base en las mejores prácticas de la industria tecnológica y la normativa general para plataformas digitales.
          </div>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Naturaleza del Servicio</h2>
          <p>
            "Profesional Cercano" (en adelante, "la Plataforma") actúa exclusivamente como un <strong>directorio digital e intermediario tecnológico</strong>. Nuestro objetivo es conectar a usuarios que requieren un servicio ("Clientes") con trabajadores independientes o técnicos ("Profesionales").
          </p>
          <p>
            La Plataforma <strong>NO</strong> es una agencia de empleos, <strong>NO</strong> es empleadora de los Profesionales, y <strong>NO</strong> provee los servicios ofrecidos por estos. La relación comercial, fijación de precios, métodos de pago y ejecución del trabajo se acuerdan de manera externa y directa entre el Cliente y el Profesional.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Requisitos de Uso</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Mayoría de Edad:</strong> El uso de la Plataforma está estrictamente limitado a personas mayores de dieciocho (18) años. Al registrarse, el usuario declara bajo juramento cumplir con este requisito.</li>
            <li><strong>Veracidad de la Información:</strong> Todos los datos provistos durante el registro (incluyendo cédula de identidad, fotografías y documentos) deben ser reales, exactos y vigentes.</li>
            <li><strong>Uso Personal:</strong> La cuenta es personal e intransferible.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Suscripciones y Pagos (Para Profesionales)</h2>
          <p>
            La Plataforma opera bajo un modelo <em>Freemium</em>. Los Profesionales tienen derecho a visualizar y aplicar a un máximo de tres (3) solicitudes de servicio mensuales de forma gratuita. Para acceder a un volumen mayor de solicitudes, el Profesional podrá optar por adquirir una suscripción de pago (Planes PRO o ELITE).
          </p>
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 my-4">
            <h3 className="font-bold text-white mb-2">Política de Reembolsos</h3>
            <p className="text-base">Todas las ventas de suscripciones son <strong>definitivas y no reembolsables</strong>. Al tratarse de un servicio digital de acceso inmediato, el Profesional acepta que no se emitirán reembolsos parciales o totales si no logra concertar servicios con los Clientes, si el Cliente cancela el trabajo, o si el Profesional decide no utilizar la plataforma.</p>
            <p className="text-base mt-2"><em>Excepción:</em> Únicamente se evaluarán reembolsos en caso de fallas técnicas comprobables y exclusivas de la Plataforma que impidan al Profesional recibir el servicio por el cual pagó (ej. cobro procesado pero solicitudes no desbloqueadas).</p>
          </div>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Limitación de Responsabilidad</h2>
          <p>
            La Plataforma no garantiza la calidad, seguridad, idoneidad o legalidad de los servicios prestados por los Profesionales. De igual manera, la Plataforma no garantiza que el Cliente realizará el pago acordado. Cualquier disputa o reclamo derivado del servicio prestado deberá resolverse directamente entre el Cliente y el Profesional. La Plataforma solo intervendrá como mediador en disputas estrictamente relacionadas con el sistema de valoraciones y reseñas (Appeals).
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Moderación de Contenido y Derecho de Admisión</h2>
          <p>
            La Plataforma se reserva el <strong>Derecho de Admisión</strong> y el derecho a suspender, cancelar o eliminar de forma permanente e inapelable cualquier cuenta que incumpla estos términos, o que publique contenido inapropiado, falso, ilegal u ofensivo.
          </p>
        </div>
      </div>
    </div>
  );
}
