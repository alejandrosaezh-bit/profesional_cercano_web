import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * Endpoint exclusivo para gestionar en Odoo CRM:
 * - Problemas técnicos o incidencias en la App (technical_support)
 * - Requerimientos puntuales, casos especiales o alianzas (specific_request)
 * - Solicitudes explícitas de asistencia humana para registro (human_assistance)
 *
 * NOTA: Las solicitudes cotidianas de servicios entre clientes y profesionales se
 * procesan de manera 100% automática en la App sin pasar por este endpoint para no
 * saturar Odoo CRM.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      type = "specific_request",
      issueType = "Requerimiento Puntual / Soporte",
      name = "",
      email = "",
      phone = "",
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

    const cleanName = (name || "Usuario Profesional Cercano").replace(/"/g, "").trim();
    let leadSubject = `[Profesional Cercano - ${issueType}] ${cleanName}`;
    let odooHtml = "";
    let customerSubject = `🛠️ Recibimos tu caso en Profesional Cercano (${issueType})`;
    let customerHtmlBody = "";

    if (type === "human_assistance") {
      const specLabel = specialty || "Profesional Independiente";
      leadSubject = `[Profesional Cercano - Asistencia Humana] ${cleanName} (${specLabel}) — ${phone}`;
      odooHtml = `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
          <h3 style="color: #EA580C;">🙋‍♂️ Solicitud Puntual de Asistencia Humana — Profesional Cercano</h3>
          <ul>
            <li><strong>Nombre:</strong> ${cleanName}</li>
            <li><strong>WhatsApp / Teléfono:</strong> ${phone}</li>
            <li><strong>Correo:</strong> ${email ? `<a href="mailto:${email}">${email}</a>` : "No indicado"}</li>
            <li><strong>Especialidad / Oficio:</strong> ${specLabel}</li>
          </ul>
          <hr/>
          <p><em>🤖 Escalado a Odoo CRM porque el usuario solicitó expresamente asistencia humana paso a paso.</em></p>
        </div>
      `;
      customerSubject = `🛠️ Solicitud de asistencia recibida — Profesional Cercano`;
      customerHtmlBody = `
        <p>¡Hola <strong>${cleanName}</strong>! 👋</p>
        <p>Te saluda <strong>Sofía</strong>, del equipo de soporte de <strong>Profesional Cercano</strong> (<a href="https://www.profesionalcercano.com" style="color: #2563EB;">www.profesionalcercano.com</a>).</p>
        <p>Recibimos tu solicitud de asistencia puntual para ayudarte con tu cuenta (${specLabel}). Un miembro de nuestro equipo o yo misma te contactaremos a la brevedad.</p>
      `;
    } else {
      leadSubject = `[Profesional Cercano - ${issueType}] ${cleanName}`;
      odooHtml = `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
          <h3 style="color: #2563EB;">🛠️ Caso Puntual / Soporte Técnico — Profesional Cercano</h3>
          <ul>
            <li><strong>Tipo de Caso:</strong> ${issueType}</li>
            <li><strong>Nombre:</strong> ${cleanName}</li>
            <li><strong>Correo:</strong> ${email ? `<a href="mailto:${email}">${email}</a>` : "No indicado"}</li>
            <li><strong>Teléfono / WhatsApp:</strong> ${phone || "No indicado"}</li>
          </ul>
          <p><strong>Detalle del requerimiento o problema técnico:</strong></p>
          <div style="background: #f1f5f9; padding: 12px; border-left: 4px solid #EA580C; border-radius: 6px;">
            ${message}
          </div>
          <hr/>
          <p><em>🤖 Caso registrado en el pipeline de Profesional Cercano en Odoo CRM para atención específica.</em></p>
        </div>
      `;
      customerSubject = `🛠️ Hemos registrado tu requerimiento (${issueType}) — Profesional Cercano`;
      customerHtmlBody = `
        <p>¡Hola <strong>${cleanName}</strong>! 👋</p>
        <p>Te saluda <strong>Sofía</strong>, del equipo de soporte y atención de <strong>Profesional Cercano</strong> (<a href="https://www.profesionalcercano.com" style="color: #2563EB;">www.profesionalcercano.com</a>).</p>
        <p>Hemos registrado tu caso bajo la categoría <strong>${issueType}</strong>:</p>
        <blockquote style="margin: 12px 0; padding: 10px 14px; background: #f1f5f9; border-left: 4px solid #2563EB; color: #334155;">
          "${message}"
        </blockquote>
        <p>Nuestro equipo técnico y de operaciones ya está revisando tu requerimiento. Si deseas adjuntar capturas de pantalla o más detalles, puedes responder directamente a este correo.</p>
      `;
    }

    // 1. Registrar únicamente este requerimiento puntual / soporte técnico en Odoo CRM
    await transporter.sendMail({
      from: `"${cleanName} (Soporte Profesional Cercano)" <${smtpUser}>`,
      replyTo: email ? `"${cleanName}" <${email}>` : `"${cleanName}" <${smtpUser}>`,
      to: [odooAlias, smtpUser],
      subject: leadSubject,
      html: odooHtml,
    });

    // 2. Responder al usuario si indicó correo
    if (email && email.includes("@")) {
      const fullCustomerHtml = `
        <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; line-height: 1.6;">
          ${customerHtmlBody}
          <p>Para urgencias o soporte directo también puedes escribirnos por WhatsApp al <a href="https://wa.me/584222537239" style="color: #EA580C; font-weight: bold;">+58 422-2537239</a>.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 13px; color: #64748b;">
            <strong>Sofía — Asistente IA de Soporte y Casos Especiales</strong><br/>
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
      message: "Requerimiento puntual registrado en Odoo CRM y confirmado por Sofía IA.",
    });
  } catch (error) {
    console.error("Error en /api/contact de Profesional Cercano:", error);
    return NextResponse.json(
      { error: "Error procesando solicitud", details: String(error) },
      { status: 500 }
    );
  }
}
