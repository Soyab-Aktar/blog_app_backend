import { betterAuth, preprocess } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_PASSWORD,
  },
});


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        // console.table(user);
        // console.log(url);
        // console.log(token);
        console.log("---------------Verification Email Sent---------------");
        const verifiationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
        const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#2563eb; padding:20px; text-align:center;">
              <h1 style="color:#ffffff; margin:0;">Prisma Blog</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333;">
              <h2 style="margin-top:0;">Verify your email address</h2>
              <p>
                Thanks for signing up for <strong>Prisma Blog</strong>.
                Please confirm your email address by clicking the button below.
              </p>

              <div style="text-align:center; margin:30px 0;">
                <a href="${verifiationUrl}"
                   style="
                     background:#2563eb;
                     color:#ffffff;
                     padding:14px 28px;
                     text-decoration:none;
                     border-radius:6px;
                     font-weight:bold;
                     display:inline-block;
                   ">
                  Verify Email
                </a>
              </div>

              <p style="font-size:14px; color:#555;">
                If the button doesn’t work, copy and paste this link into your browser:
              </p>

              <p style="font-size:14px; word-break:break-all;">
                <a href="${verifiationUrl}" style="color:#2563eb;">
                  ${verifiationUrl}
                </a>
              </p>

              <p style="font-size:14px; color:#777;">
                This link will expire in 24 hours. If you didn’t create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#999;">
              © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prisma@gg.email>',
          to: user.email,
          subject: "Hello",
          text: "Hello world?",
          html: htmlTemplate,
        });
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  },
});