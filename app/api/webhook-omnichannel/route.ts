import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * Webhook Omnicanal de Profesional Cercano (/api/webhook-omnichannel)
 * Regla clave de negocio:
 * - Profesional Cercano funciona de manera 100% autónoma desde la App.
 * - Si un usuario pregunta cómo pedir un servicio o cómo registrarse normalmente,
 *   Sofía IA lo guía para hacerlo directo en la App SIN crear tickets innecesarios en Odoo CRM.
 * - SOLO se escala y crea una oportunidad/caso en Odoo CRM cuando se detecta:
 *   1) Un problema técnico, error en la app, fallo con cuenta/verificación KYC o pago/suscripción.
 *   2) Una disputa, apelación o reclamo puntual.
 *   3) Un requerimiento especial, corporativo, alianza o solicitud explícita de hablar con un humano.
 */

const ESCALATION_REGEX =
  /(error|problema|falla|fallo|no puedo|no me deja|bloquead|soporte|ayuda humana|asesor|humano|reclamo|apelaci|disputa|pago|suscripci|reembolso|cobro|factura|alianza|empresa|corporativ|especial|puntual|bug|clave|contrase|verificaci|kyc|cédula)/i;

function analyzeSupportMessage(text = "", senderName = "") {
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  const phoneMatch = text.match(/(\+?58\s?0?\d{3}[-\s]?\d{7}|04\d{2}[-\s]?\d{7})/);
  const shouldEscalateToCrm = ESCALATION_REGEX.test(text) || Boolean(emailMatch);

  let categoryLabel = "Consulta General (Resuelta por App)";
  if (/(error|problema|falla|fallo|no puedo|no me deja|bug|clave|contrase|verificaci|kyc)/i.test(text)) {
    categoryLabel = "Problema Técnico / Soporte App";
  } else if (/(pago|suscripci|reembolso|cobro|factura)/i.test(text)) {
    categoryLabel = "Soporte de Suscripción / Pagos";
  } else if (/(reclamo|apelaci|disputa)/i.test(text)) {
    categoryLabel = "Apelación / Caso Especial";
  } else if (shouldEscalateToCrm) {
    categoryLabel = "Requerimiento Puntual / Atención Humana";
  }

  return {
    shouldEscalateToCrm,
    categoryLabel,
    extracted_email: emailMatch ? emailMatch[0] : null,
    extracted_phone: phoneMatch ? phoneMatch[0] : null,
    extracted_name: senderName || null,
  };
}

async function generateSofiaSupportReply({
  channel,
  senderName,
  senderId,
  messageText,
}: {
  channel: string;
  senderName: string;
  senderId: string;
  messageText: string;
}) {
  const info = analyzeSupportMessage(messageText, senderName);
  const geminiKey = process.env.GEMINI_API_KEY || "AIzaSyD6qTMrJN38VEaFv31JBPWI33M2U7EpP9c";

  if (geminiKey) {
    try {
      const systemPrompt = `Eres Sofía, la Asistente IA de Soporte y Casos Especiales de Profesional Cercano (www.profesionalcercano.com) en Venezuela.
Atiendes por ${channel.toUpperCase()}.
Reglas clave:
1. Las solicitudes normales de servicios y el registro de profesionales se gestionan de forma 100% automática desde la App y la web de Profesional Cercano. Si el usuario solo pregunta cómo contratar o registrarse, oriéntalo amablemente para que use el buscador de la web o descargue la App.
2. Si el usuario reporta un PROBLEMA TÉCNICO, inconveniente con su cuenta/verificación KYC, duda con el pago de su suscripción (PRO/ELITE), una apelación o un REQUERIMIENTO PUNTUAL/ESPECIAL, indícale que ya estás escalando su caso a nuestro equipo de soporte en Odoo CRM y pídele su correo electrónico, teléfono y detalle del problema si aún no los ha dado.
3. Nunca uses ningún nombre antiguo del proyecto; usa exclusivamente "Profesional Cercano".`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [
              {
                role: "user",
                parts: [{ text: `[Usuario: ${senderName || senderId}] Mensaje: ${messageText}` }],
              },
            ],
          }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText) {
          return { reply: aiText.trim(), ...info };
        }
      }
    } catch (err) {
      console.error("Error Gemini en webhook-omnichannel Profesional Cercano:", err);
    }
  }

  const greeting = senderName ? `¡Hola *${senderName}*! 👋` : "¡Hola! 👋";

  if (!info.shouldEscalateToCrm) {
    const reply = `${greeting} Te saluda *Sofía*, asistente de *Profesional Cercano* 🛠️🇻🇪.\n\nRecuerda que puedes publicar una solicitud de servicio o registrarte como profesional de manera *100% automática e inmediata* desde nuestra App o aquí mismo en la web.\n\nSi tienes algún *problema técnico*, inconveniente con tu cuenta/suscripción o un *requerimiento puntual*, cuéntame el detalle (junto con tu correo o WhatsApp) para escalar tu caso a nuestro equipo de soporte.`;
    return { reply, ...info };
  }

  const reply = `${greeting} Te saluda *Sofía*, de soporte de *Profesional Cercano* 🛠️.\n\nHe clasificado tu mensaje como *${info.categoryLabel}* y ya lo registré en nuestro sistema de soporte para atención prioritaria.\n\nPara darte respuesta inmediata, ¿me confirmas tu *correo electrónico* de usuario en la App y tu número de *WhatsApp*?`;
  return { reply, ...info };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  const verifyToken = process.env.META_VERIFY_TOKEN || "profesionalcercano_ve_2026";

  if (mode === "subscribe" && token === verifyToken && challenge) {
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({
    status: "online",
    agent: "Sofía — Asistente IA de Soporte y Requerimientos Puntuales de Profesional Cercano",
    crm_policy: "Solo se envían a Odoo CRM problemas técnicos, soporte y requerimientos específicos",
    webhook_url: "https://www.profesionalcercano.com/api/webhook-omnichannel",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let senderId = body.sender_id || "";
    let senderName = body.sender_name || "";
    let channel = body.channel || "whatsapp";
    let messageText = body.message_text || "";

    if (body.entry && Array.isArray(body.entry) && body.entry[0]?.changes) {
      const val = body.entry[0].changes[0]?.value;
      if (val?.messages && val.messages[0]) {
        senderId = val.messages[0].from;
        senderName = val.contacts?.[0]?.profile?.name || "Usuario WhatsApp";
        messageText = val.messages[0]?.text?.body || "";
        channel = "whatsapp";
      } else {
        return NextResponse.json({ status: "ignored_status_event" });
      }
    }

    if (!messageText || !senderId) {
      return NextResponse.json(
        { error: "Payload sin message_text o sender_id" },
        { status: 400 }
      );
    }

    const sofiaResult = await generateSofiaSupportReply({
      channel,
      senderName,
      senderId,
      messageText,
    });

    // Solo enviamos a Odoo CRM si es un problema técnico, soporte o requerimiento puntual
    let odooSynced = false;
    if (sofiaResult.shouldEscalateToCrm) {
      const smtpUser = process.env.SMTP_USER || "info@profesionalcercano.com";
      const smtpPass = process.env.SMTP_PASS || "ProCercano2026!Venezuela#99";
      const smtpHost = process.env.SMTP_HOST || "smtp.ionos.es";
      const smtpPort = Number(process.env.SMTP_PORT || 465);
      const odooAlias =
        process.env.ODOO_CRM_ALIAS ||
        "ventas-profesionalcercano@soluciones-digitales-creapptivas.odoo.com";

      const channelLabel =
        channel === "instagram"
          ? "Instagram"
          : channel === "web_chat"
          ? "Chat Web"
          : "WhatsApp";
      const leadTitle = `[Profesional Cercano - ${sofiaResult.categoryLabel}] ${senderName || senderId} (${channelLabel})`;

      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: { user: smtpUser, pass: smtpPass },
        });

        await transporter.sendMail({
          from: `"Sofía Soporte IA | Profesional Cercano" <${smtpUser}>`,
          replyTo: sofiaResult.extracted_email
            ? `"${senderName || senderId}" <${sofiaResult.extracted_email}>`
            : `"${senderName || senderId}" <${smtpUser}>`,
          to: [odooAlias, smtpUser],
          subject: leadTitle,
          html: `
            <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
              <h3 style="color: #EA580C;">🛠️ Caso Puntual / Soporte Escalado por Sofía IA (${channelLabel})</h3>
              <ul>
                <li><strong>Categoría:</strong> ${sofiaResult.categoryLabel}</li>
                <li><strong>Usuario:</strong> ${senderName || "Por confirmar"}</li>
                <li><strong>ID / Teléfono:</strong> ${sofiaResult.extracted_phone || senderId}</li>
                <li><strong>Email detectado:</strong> ${sofiaResult.extracted_email || "Por confirmar"}</li>
              </ul>
              <div style="background: #f1f5f9; padding: 12px; border-left: 4px solid #2563EB; border-radius: 6px; margin-bottom: 12px;">
                <strong>👤 Mensaje del Usuario:</strong><br/>
                ${messageText}
              </div>
              <div style="background: #fff7ed; padding: 12px; border-left: 4px solid #EA580C; border-radius: 6px;">
                <strong>🤖 Respuesta de Sofía IA:</strong><br/>
                ${sofiaResult.reply.replace(/\n/g, "<br/>")}
              </div>
            </div>
          `,
        });
        odooSynced = true;
      } catch (mailErr) {
        console.error("Error sincronizando caso puntual con Odoo CRM:", mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      reply: sofiaResult.reply,
      category: sofiaResult.categoryLabel,
      escalated_to_odoo: odooSynced,
    });
  } catch (error) {
    console.error("Error en webhook-omnichannel Profesional Cercano:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
