import { NextResponse } from "next/server";

// Simple in-memory store for OTPs (use Redis/Database in production)
const otpStore = new Map();
const requestStore = new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name = "", otpWritten } = body;

    // Check if this is a verification request or OTP generation request
    const isVerificationRequest = otpWritten !== undefined;

    if (isVerificationRequest) {
      if (!email) {
        return NextResponse.json(
          { error: "Email is required for verification" },
          { status: 400 }
        );
      }

      if (!otpWritten || otpWritten.length !== 6) {
        return NextResponse.json(
          { error: "OTP must be a 6-digit number" },
          { status: 400 }
        );
      }

      // Get stored OTP data
      const storedData = otpStore.get(email);
      
      if (!storedData) {
        return NextResponse.json(
          { error: "No verification code found for this email. Please request a new one." },
          { status: 404 }
        );
      }

      const { otp: storedOtp, expiresAt } = storedData;

      // Check if OTP has expired
      if (Date.now() > expiresAt) {
        otpStore.delete(email);
        return NextResponse.json(
          { error: "Verification code has expired. Please request a new one." },
          { status: 410 }
        );
      }

      // Verify OTP
      if (otpWritten !== storedOtp) {
        return NextResponse.json(
          { error: "Invalid verification code" },
          { status: 400 }
        );
      }

      otpStore.delete(email);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email verified successfully',
        redirectTo: '/dashboard'
      });

    } else {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json(
          { error: "Valid email address is required" },
          { status: 400 }
        );
      }

      // Check rate limiting (max 5 requests per 10 minutes)
      const now = Date.now();
      const userRequests = requestStore.get(email) || [];
      const recentRequests = userRequests.filter(
        (time) => now - time < 10 * 60 * 1000
      );

      if (recentRequests.length >= 5) { 
        return NextResponse.json(
          { error: "Too many attempts. Please try again in 10 minutes." },
          { status: 429 }
        );
      }

      requestStore.set(email, [...recentRequests, now]);

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = now + 5 * 60 * 1000; // 5 minutes

      otpStore.set(email, { otp, expiresAt });

      // Remove OTP after 10 minutes
      setTimeout(() => {
        otpStore.delete(email);
      }, 10 * 60 * 1000);

      // Send email
      let emailSent = false;
      try {
        const response = await fetch("http://localhost:3000/api/mail-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: email,
            subject: "Validation Code",
            text: "Plain text version of your email",
            html: generateEmailTemplate(otp, name),
          }),
        });

        if (response.ok) {
          emailSent = true;
        } else {
          console.error("Failed to send email:", response.statusText);
        }
      } catch (error) {
        console.error("Error sending email:", error);
      }

      return NextResponse.json({
        success: true,
        message: emailSent 
          ? "Verification code sent successfully" 
          : "Verification code generated but email might not have been sent",
        expiresIn: 300,
      });
    }

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateEmailTemplate(otp, name) {
  const greeting = name ? `Hello ${name},` : "Hello,";

  return `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { 
      background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%); 
      padding: 40px 30px 30px; 
      text-align: center; 
      color: white; 
      border-radius: 12px 12px 0 0;
      position: relative;
    }
    .header p{
      color:#F5FEFD;
    }  
    .content { 
      background: #ffffff; 
      padding: 40px 30px; 
      border-radius: 0 0 12px 12px; 
      border: 1px solid #e5e7eb;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .otp-box { 
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); 
      padding: 30px; 
      text-align: center; 
      font-size: 42px; 
      font-weight: bold; 
      letter-spacing: 20px; 
      color: #1E40AF; 
      border: 2px dashed #3B82F6; 
      border-radius: 16px; 
      margin: 30px 0; 
      font-family: 'Courier New', monospace;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
    }
    .otp-label {
      display: block;
      font-size: 14px;
      color: #6B7280;
      margin-bottom: 8px;
      font-weight: 500;
      letter-spacing: normal;
    }
    .footer { 
      text-align: center; 
      margin-top: 40px; 
      color: #6B7280; 
      font-size: 13px; 
      padding-top: 20px; 
      border-top: 1px solid #e5e7eb; 
    }
    .button { 
      display: inline-block; 
      padding: 14px 32px; 
      background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%); 
      color: white; 
      text-decoration: none; 
      border-radius: 8px; 
      font-weight: 600; 
      margin: 15px 0;
      font-size: 16px;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px -1px rgba(59, 130, 246, 0.4);
    }
    .warning { 
      background: #fffbeb; 
      border: 1px solid #fbbf24; 
      color: #92400e; 
      padding: 18px; 
      border-radius: 8px; 
      margin: 25px 0; 
      border-left: 4px solid #f59e0b;
    }
    .warning strong {
      color: #d97706;
    }
    h1 {
      margin: 0 0 10px;
      font-size: 28px;
      font-weight: 700;
    }
    h2 {
      color: #1F2937;
      margin-top: 0;
      font-size: 22px;
      font-weight: 600;
    }
    p {
      margin: 15px 0;
      color: #4B5563;
      line-height: 1.7;
    }
    .expiry {
      background: #fef3c7;
      color: #92400e;
      padding: 10px 16px;
      border-radius: 8px;
      display: inline-block;
      font-weight: 600;
      margin: 10px 0;
    }
    .university-info {
      background: #f8fafc;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      margin: 20px 0;
      font-size: 14px;
      color: #475569;
    }
    .signature {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    .signature p {
      color: #1F2937;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Vérification d'Email</h1>
      <p>VacaGest - Plateforme des Enseignants Vacataires</p>
    </div>
    <div class="content">
      <h2>Bonjour ${greeting}</h2>
      <p>Merci de vous inscrire sur la plateforme VacaGest. Pour compléter votre inscription, veuillez utiliser le code de vérification suivant :</p>
      
      <div class="otp-box">
        <span class="otp-label">Code de vérification</span>
        ${otp}
      </div>
      
      <p class="expiry">Ce code expirera dans <strong>5 minutes</strong>.</p>
      
      <div class="warning">
        <strong>Important :</strong> 
        <p>Si vous n'avez pas demandé ce code, veuillez ignorer cet email ou contacter immédiatement notre équipe de support.</p>
      </div>
      
      <p>Pour des raisons de sécurité, ne partagez jamais ce code avec qui que ce soit.</p>
      
      <div class="university-info">
        <strong>Université de Boumerdès</strong><br>
        Plateforme de gestion des enseignants vacataires
      </div>
      
      <div class="signature">
        <p>Cordialement,<br>L'équipe VacaGest</p>
        <p style="font-size: 12px; color: #6B7280;">
          Université de Boumerdès<br>
          Département d'Informatique
        </p>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} VacaGest - Université de Boumerdès. Tous droits réservés.</p>
      <p>Ceci est un message automatique, veuillez ne pas répondre à cet email.</p>
      <p style="font-size: 11px; margin-top: 10px; color: #9CA3AF;">
        Pour toute assistance, contactez : support@vacagest.univ-boumerdes.dz
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
