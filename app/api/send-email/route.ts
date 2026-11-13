import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * Endpoint transaccional HTTPS: POST /api/send-email
 * Permite que el backend de Profesional Cercano en Render envíe correos oficiales
 * (@profesionalcercano.com vía IONOS SMTP) por puerto HTTPS 443 sin bloqueos de puertos 465/587.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const expectedKey =
      process.env.INTERNAL_EMAIL_KEY || "procercano_internal_mail_2026";
    const authHeader = req.headers.get("authorization") || "";
    const providedKey =
      req.headers.get("x-internal-key") ||
      (authHeader ? authHeader.replace(/^Bearer\s+/i, "") : "") ||
      body?.internalKey;

    if (providedKey !== expectedKey) {
      return NextResponse.json(
        { ok: false, error: "No autorizado para envío transaccional." },
        { status: 401 }
      );
    }

    const {
      to,
      cc,
      bcc,
      subject,
      html,
      text,
      fromName,
      replyTo,
      customSmtp,
    } = body || {};

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { ok: false, error: "Faltan parámetros requeridos (to, subject, html/text)." },
        { status: 400 }
      );
    }

    const smtpHost = customSmtp?.host || process.env.SMTP_HOST || "smtp.ionos.es";
    const smtpPort = Number(customSmtp?.port || process.env.SMTP_PORT || 465);
    const smtpUser =
      customSmtp?.user || process.env.SMTP_USER || "info@profesionalcercano.com";
    const smtpPass =
      customSmtp?.pass || process.env.SMTP_PASS || "ProCercano2026!Venezuela#99";

    const cleanSenderName = String(fromName || "Profesional Cercano")
      .replace(/"/g, "")
      .trim();

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const info = await transporter.sendMail({
      from: `"${cleanSenderName}" <${smtpUser}>`,
      replyTo: replyTo || smtpUser,
      to,
      cc: cc || undefined,
      bcc: bcc || undefined,
      subject,
      html: html || undefined,
      text: text || undefined,
    });

    return NextResponse.json({
      ok: true,
      messageId: info.messageId,
      to,
    });
  } catch (error: unknown) {
    console.error("Error en /api/send-email de Profesional Cercano:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Error enviando correo vía IONOS SMTP",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
