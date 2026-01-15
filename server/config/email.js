const nodemailer = require("nodemailer");

// Configuración del transportador de email
// Para desarrollo, usaremos Ethereal Email (servicio de prueba)
// Para producción, usar Gmail, SendGrid, etc.

let transporter = null;

/**
 * Inicializar el transportador de email
 */
const initEmailTransporter = async () => {
  if (transporter) return transporter;

  try {
    // Para desarrollo: Crear cuenta de prueba en Ethereal
    if (process.env.NODE_ENV !== "production") {
      const testAccount = await nodemailer.createTestAccount();

      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      console.log("📧 Email configurado (Modo desarrollo - Ethereal)");
      console.log("   Usuario:", testAccount.user);
    } else {
      // Para producción: Usar configuración real
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      console.log("📧 Email configurado (Modo producción)");
    }

    return transporter;
  } catch (error) {
    console.error("Error al configurar email:", error);
    return null;
  }
};

/**
 * Enviar email de verificación
 */
const sendVerificationEmail = async (email, nombre, token) => {
  try {
    const trans = await initEmailTransporter();
    if (!trans) throw new Error("Transportador de email no disponible");

    const verificationUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/verify-email?token=${token}`;

    const info = await trans.sendMail({
      from: '"HelpDesk Pro" <noreply@helpdesk.com>',
      to: email,
      subject: "✅ Verifica tu email - HelpDesk Pro",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">🎫 HelpDesk Pro</h1>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">¡Hola ${nombre}!</h2>
                        
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            Gracias por registrarte en HelpDesk Pro. Para completar tu registro, 
                            necesitamos verificar tu dirección de email.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verificationUrl}" 
                               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                      color: white; 
                                      padding: 15px 40px; 
                                      text-decoration: none; 
                                      border-radius: 8px; 
                                      font-weight: bold; 
                                      display: inline-block;
                                      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                                ✅ Verificar Email
                            </a>
                        </div>
                        
                        <p style="color: #999; font-size: 14px; margin-top: 30px;">
                            Si no creaste esta cuenta, puedes ignorar este email.
                        </p>
                        
                        <p style="color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                            Este link expira en 24 horas.
                        </p>
                    </div>
                </div>
            `,
    });

    console.log("📧 Email de verificación enviado:", info.messageId);

    // En desarrollo, mostrar URL de vista previa
    if (process.env.NODE_ENV !== "production") {
      console.log("🔗 Vista previa:", nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error("Error al enviar email de verificación:", error);
    throw error;
  }
};

/**
 * Enviar email de recuperación de contraseña
 */
const sendPasswordResetEmail = async (email, nombre, token) => {
  try {
    const trans = await initEmailTransporter();
    if (!trans) throw new Error("Transportador de email no disponible");

    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/reset-password?token=${token}`;

    const info = await trans.sendMail({
      from: '"HelpDesk Pro" <noreply@helpdesk.com>',
      to: email,
      subject: "🔒 Recuperación de Contraseña - HelpDesk Pro",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">🎫 HelpDesk Pro</h1>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">¡Hola ${nombre}!</h2>
                        
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            Recibimos una solicitud para restablecer la contraseña de tu cuenta.
                            Si no solicitaste esto, puedes ignorar este email.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" 
                               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                      color: white; 
                                      padding: 15px 40px; 
                                      text-decoration: none; 
                                      border-radius: 8px; 
                                      font-weight: bold; 
                                      display: inline-block;
                                      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                                🔒 Restablecer Contraseña
                            </a>
                        </div>
                        
                        <p style="color: #999; font-size: 14px; margin-top: 30px;">
                            Si no solicitaste restablecer tu contraseña, ignora este email.
                            Tu contraseña no cambiará hasta que crees una nueva.
                        </p>
                        
                        <p style="color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                            Este link expira en 1 hora por seguridad.
                        </p>
                    </div>
                </div>
            `,
    });

    console.log("📧 Email de recuperación enviado:", info.messageId);

    // En desarrollo, mostrar URL de vista previa
    if (process.env.NODE_ENV !== "production") {
      console.log("🔗 Vista previa:", nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error("Error al enviar email de recuperación:", error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  initEmailTransporter,
};
