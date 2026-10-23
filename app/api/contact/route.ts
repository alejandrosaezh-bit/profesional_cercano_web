import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      type = "general_contact",
      name = "",
      email = "",
      phone = "",
      category = "",
      subcategory = "",
      title = "",
      location = "",
      description = "",
      specialty = "",
      message = "",
    } = body || {};

    if (!name && !phone && !email) {
      return NextResponse.json(
        { error: "Faltan datos de contacto obligatorios." },
        { status: 400 }
      );
    }

    const smtpUser = process.env.SMTP_USER || "info@profesionalcercano.com";
    const smtpPass = process.env.SMTP_PASS || "ProCercano2026!Venezuela#99";
    const smtpHost = process.env.SMTP_HOST || "smtp.ionos.es";
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const odooAlias =
      process.env.ODOO_CRM_ALIAS ||
      "ventas-profesionalcercano@soluciones-digitales-creapptivas.odoo.com";

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const cleanName = (name || "Usuario Web").replace(/"/g, "").trim();
    let leadSubject = `[Profesional Cercano Web] Consulta de ${cleanName}`;
    let odooHtml = "";
    let customerSubject = `🛠️ Recibimos tu solicitud en Profesional Cercano`;
    let customerHtmlBody = "";

    if (type === "service_request") {
      const catLabel = subcategory || category || "Servicio General";
      const locLabel = location || "Venezuela";
      leadSubject = `[Profesional Cercano - Solicitud] ${catLabel} en ${locLabel} — ${cleanName}`;
      odooHtml = `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
          <h3 style="color: #2563EB;">📥 Nueva Solicitud de Servicio (Cliente B2C) — www.profesionalcercano.com</h3>
          <ul>
            <li><strong>Cliente:</strong> ${cleanName}</li>
            <li><strong>Teléfono / WhatsApp:</strong> ${phone || "Por confirmar"}</li>
            <li><strong>Correo:</strong> ${email ? `<a href="mailto:${email}">${email}</a>` : "Por confirmar"}</li>
            <li><strong>Categoría / Especialidad:</strong> ${category} / ${subcategory}</li>
            <li><strong>Ubicación:</strong> ${locLabel}</li>
            <li><strong>Título:</strong> ${title}</li>
          </ul>
          <p><strong>Descripción de la solicitud:</strong></p>
          <div style="background: #f1f5f9; padding: 12px; border-left: 4px solid #2563EB; border-radius: 6px;">
            ${description}
          </div>
          <hr/>
          <p><em>🤖 Sofía (Agente IA de Profesional Cercano) ya envió el correo de confirmación al cliente.</em></p>
        </div>
      `;
      customerSubject = `🛠️ Solicitud recibida en Profesional Cercano: ${title || catLabel}`;
      customerHtmlBody = `
        <p>¡Hola <strong>${cleanName}</strong>! 👋</p>
        <p>Te saluda <strong>Sofía</strong>, del equipo de atención de <strong>Profesional Cercano</strong> (<a href="https://www.profesionalcercano.com" style="color: #2563EB;">www.profesionalcercano.com</a>).</p>
        <p>Hemos recibido y publicado tu solicitud de servicio:</p>
        <div style="background: #f8fafc; border-left: 4px solid #2563EB; padding: 14px; border-radius: 6px; margin: 14px 0;">
          <strong>📌 Servicio:</strong> ${catLabel} — ${title}<br/>
          <strong>📍 Ubicación:</strong> ${locLabel}<br/>
          <strong>📝 Detalle:</strong> "${description}"
        </div>
        <p>Ya estamos notificando a los profesionales verificados cercanos a tu ubicación en <strong>${locLabel}</strong>.</p>
        <div style="background: #fff7ed; border-left: 4px solid #EA580C; padding: 14px; border-radius: 6px; margin: 16px 0;">
          <strong>Para agilizar tu atención, puedes responder directamente a este correo si deseas agregar:</strong>
          <ul style="margin: 8px 0 0 0; padding-left: 20px;">
            <li>Fecha y horario ideal para recibir al profesional.</li>
            <li>Cualquier detalle adicional o punto de referencia en ${locLabel}.</li>
          </ul>
        </div>
      `;
    } else if (type === "pro_register") {
      const specLabel = specialty || "Profesional Independiente";
      leadSubject = `[Profesional Cercano - Registro Profesional] ${cleanName} (${specLabel}) — ${phone}`;
      odooHtml = `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
          <h3 style="color: #EA580C;">👷 Nuevo Profesional interesado en registrarse (B2B) — www.profesionalcercano.com</h3>
          <ul>
            <li><strong>Nombre del Profesional:</strong> ${cleanName}</li>
            <li><strong>WhatsApp / Teléfono:</strong> ${phone}</li>
            <li><strong>Correo:</strong> ${email ? `<a href="mailto:${email}">${email}</a>` : "No indicado"}</li>
            <li><strong>Especialidad / Oficio:</strong> ${specLabel}</li>
          </ul>
          <hr/>
          <p><em>🤖 Registrado automáticamente en el Pipeline de Profesional Cercano en Odoo CRM.</em></p>
        </div>
      `;
      customerSubject = `👷 ¡Bienvenido a Profesional Cercano! Pasos para activar tu perfil profesional`;
      customerHtmlBody = `
        <p>¡Hola <strong>${cleanName}</strong>! 👋</p>
        <p>Te saluda <strong>Sofía</strong>, del equipo de atención a profesionales de <strong>Profesional Cercano</strong> (<a href="https://www.profesionalcercano.com" style="color: #2563EB;">www.profesionalcercano.com</a>).</p>
        <p>¡Qué gusto contar contigo! Recibimos tu solicitud para registrarte como profesional en nuestra plataforma (${specLabel}).</p>
        <div style="background: #fff7ed; border-left: 4px solid #EA580C; padding: 14px; border-radius: 6px; margin: 16px 0;">
          <strong>Responde a este correo o escríbenos por WhatsApp confirmándonos:</strong>
          <ol style="margin: 8px 0 0 0; padding-left: 20px;">
            <li>¿En qué ciudad y zonas de Venezuela prestas tus servicios?</li>
            <li>¿Cuáles son tus especialidades principales?</li>
          </ol>
        </div>
      `;
    } else {
      leadSubject = `[Profesional Cercano - Contacto Web] ${cleanName}`;
      odooHtml = `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
          <h3>📩 Nuevo Mensaje desde www.profesionalcercano.com/contacto</h3>
          <ul>
            <li><strong>Nombre:</strong> ${cleanName}</li>
            <li><strong>Correo:</strong> ${email ? `<a href="mailto:${email}">${email}</a>` : "No indicado"}</li>
            <li><strong>Teléfono:</strong> ${phone || "No indicado"}</li>
          </ul>
          <p><strong>Mensaje:</strong></p>
          <div style="background: #f1f5f9; padding: 12px; border-radius: 6px;">${message || description}</div>
        </div>
      `;
      customerSubject = `🛠️ Hemos recibido tu mensaje — Profesional Cercano`;
      customerHtmlBody = `
        <p>¡Hola <strong>${cleanName}</strong>! 👋</p>
        <p>Te saluda <strong>Sofía</strong>, del equipo de soporte y atención de <strong>Profesional Cercano</strong> (<a href="https://www.profesionalcercano.com" style="color: #2563EB;">www.profesionalcercano.com</a>).</p>
        <p>Hemos recibido tu mensaje:</p>
        <blockquote style="margin: 12px 0; padding: 10px 14px; background: #f1f5f9; border-left: 4px solid #2563EB; color: #334155;">
          "${message || description}"
        </blockquote>
        <p>Nuestro equipo ya está revisando tu caso. Puedes responder directamente a este mismo correo si deseas anexar más información.</p>
      `;
    }

    // 1. Enviar Lead a Odoo CRM (Equipo: Profesional Cercano) + copia a info@profesionalcercano.com
    await transporter.sendMail({
      from: `"${cleanName} (Web Profesional Cercano)" <${smtpUser}>`,
      replyTo: email ? `"${cleanName}" <${email}>` : `"${cleanName}" <${smtpUser}>`,
      to: [odooAlias, smtpUser],
      subject: leadSubject,
      html: odooHtml,
    });

    // 2. Si el usuario dejó su email, enviarle respuesta inmediata de Sofía IA
    if (email && email.includes("@")) {
      const fullCustomerHtml = `
        <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; line-height: 1.6;">
          ${customerHtmlBody}
          <p>También puedes escribirnos directamente por WhatsApp al <a href="https://wa.me/584222537239" style="color: #EA580C; font-weight: bold;">+58 422-2537239</a>.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 13px; color: #64748b;">
            <strong>Sofía — Asistente IA de Atención y Operaciones</strong><br/>
            <strong>Profesional Cercano | Soluciones Digitales Creapptivas C.A.</strong><br/>
            📧 <a href="mailto:info@profesionalcercano.com">info@profesionalcercano.com</a> · 🌐 <a href="https://www.profesionalcercano.com">www.profesionalcercano.com</a>
          </p>
        </div>
      `;

      await transporter.sendMail({
        from: `"Sofía | Profesional Cercano" <${smtpUser}>`,
        replyTo: `"Profesional Cercano" <${smtpUser}>`,
        to: email,
        subject: customerSubject,
        html: fullCustomerHtml,
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Lead registrado en Odoo CRM (Profesional Cercano) y respuesta enviada por Sofía IA.",
    });
  } catch (error) {
    console.error("Error en /api/contact de Profesional Cercano:", error);
    return NextResponse.json(
      { error: "Error procesando solicitud", details: String(error) },
      { status: 500 }
    );
  }
}
