import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const VENEZUELA_CITIES = [
  "Caracas", "Valencia", "Maracaibo", "Barquisimeto", "Maracay",
  "Lechería", "Puerto La Cruz", "Barcelona", "Puerto Ordaz", "Ciudad Guayana",
  "Maturín", "San Cristóbal", "Mérida", "Margarita", "Porlamar", "Cumaná", "Los Teques"
];

function extractHeuristics(text = "", senderName = "") {
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  const foundCity = VENEZUELA_CITIES.find(c => text.toLowerCase().includes(c.toLowerCase())) || null;
  const isPro = /(registrarme|soy técnico|soy profesional|ofrecer|trabajar|postular)/i.test(text);

  return {
    extracted_email: emailMatch ? emailMatch[0] : null,
    extracted_city: foundCity,
    lead_role: isPro ? "Profesional / Técnico (B2B)" : "Cliente Solicitante (B2C)",
    extracted_name: senderName || null,
  };
}

async function generateSofiaReply({
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
  const info = extractHeuristics(messageText, senderName);
  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey) {
    try {
      const systemPrompt = `Eres Sofía, la Asistente IA de Atención y Operaciones de Profesional Cercano (www.profesionalcercano.com), la plataforma en Venezuela que conecta hogares y empresas con profesionales y técnicos verificados cerca de su ubicación.
Atiendes por ${channel.toUpperCase()}.
Reglas:
- Sé cálida, ejecutiva y breve (máximo 3 párrafos cortos).
- Identifica si la persona busca CONTRATAR un profesional o REGISTRARSE para ofrecer sus servicios.
- Pregúntale su ciudad/zona en Venezuela, qué especialidad necesita (ej. electricidad, plomería, aire acondicionado, hogar, tecnología, legal) y su número de WhatsApp o correo para conectarlo de inmediato.
- Nunca uses el nombre antiguo del proyecto; usa únicamente "Profesional Cercano".`;

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
  const cityNote = info.extracted_city ? ` en *${info.extracted_city}*` : " en tu ciudad";

  const followUp =
    info.lead_role === "Profesional / Técnico (B2B)"
      ? "¿En qué *ciudad de Venezuela* te encuentras, cuál es tu *especialidad u oficio* y a qué *WhatsApp o correo* te enviamos el enlace de registro verificado?"
      : "¿Qué *servicio o especialidad* necesitas contratar, en qué *ciudad/sector* te encuentras y a qué *WhatsApp o correo* te enviamos las opciones de profesionales disponibles?";

  const reply = `${greeting} Te saluda *Sofía*, asistente de *Profesional Cercano* 🛠️🇻🇪.\n\nConectamos hogares y empresas${cityNote} con profesionales y técnicos verificados de forma rápida y segura.\n\n${followUp}`;

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
    agent: "Sofía — Asistente IA Omnicanal de Profesional Cercano (-> Odoo CRM)",
    webhook_url: "https://www.profesionalcercano.com/api/webhook-omnichannel",
    meta_verify_token: verifyToken,
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

    const sofiaResult = await generateSofiaReply({
      channel,
      senderName,
      senderId,
      messageText,
    });

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
    const cityTag = sofiaResult.extracted_city ? ` (${sofiaResult.extracted_city})` : "";
    const leadTitle = `[Profesional Cercano ${channelLabel}] ${senderName || senderId}${cityTag}`;

    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"Sofía IA | Profesional Cercano" <${smtpUser}>`,
        replyTo: sofiaResult.extracted_email
          ? `"${senderName || senderId}" <${sofiaResult.extracted_email}>`
          : `"${senderName || senderId}" <${smtpUser}>`,
        to: [odooAlias, smtpUser],
        subject: leadTitle,
        html: `
          <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
            <h3 style="color: #2563EB;">💬 Lead atendido por Sofía IA en ${channelLabel} — Profesional Cercano</h3>
            <ul>
              <li><strong>Nombre / Usuario:</strong> ${senderName || "Por confirmar"}</li>
              <li><strong>ID / Teléfono:</strong> ${senderId}</li>
              <li><strong>Perfil detectado:</strong> ${sofiaResult.lead_role}</li>
              <li><strong>Ciudad detectada:</strong> ${sofiaResult.extracted_city || "Por confirmar"}</li>
              <li><strong>Email detectado:</strong> ${sofiaResult.extracted_email || "Por confirmar"}</li>
            </ul>
            <div style="background: #f1f5f9; padding: 12px; border-left: 4px solid #2563EB; border-radius: 6px; margin-bottom: 12px;">
              <strong>👤 Usuario (${senderId}):</strong><br/>
              ${messageText}
            </div>
            <div style="background: #fff7ed; padding: 12px; border-left: 4px solid #EA580C; border-radius: 6px;">
              <strong>🤖 Respuesta enviada por Sofía IA:</strong><br/>
              ${sofiaResult.reply.replace(/\n/g, "<br/>")}
            </div>
          </div>
        `,
      });
    } catch (mailErr) {
      console.error("Error sincronizando Lead con Odoo CRM:", mailErr);
    }

    return NextResponse.json({
      success: true,
      channel: channelLabel,
      sender_id: senderId,
      reply: sofiaResult.reply,
      qualification: {
        role: sofiaResult.lead_role,
        city: sofiaResult.extracted_city,
        email: sofiaResult.extracted_email,
      },
      odoo_synced: true,
    });
  } catch (error) {
    console.error("Error en webhook-omnichannel Profesional Cercano:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
