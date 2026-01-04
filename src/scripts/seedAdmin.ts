import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/authMiddleware";

async function seedAdmin() {
  try {
    const adminData = {
      name: process.env.ADMIN_NAME as string,
      email: process.env.ADMIN_EMAIL as string,
      role: process.env.ADMIN_ROLE as UserRole,
      password: process.env.ADMIN_PASSWORD as string,
      emailVerified: true
    }
    //! User Already exist or not 
    const existUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      }
    })
    if (existUser) {
      throw new Error("User already Exists !");
    }

    //? Admin SEED
    const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(adminData)
    })

    if (signUpAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email
        },
        data: {
          emailVerified: true
        }
      })
    }

    console.log(signUpAdmin);

  } catch (err) {
    console.error(err);
  }
}


seedAdmin();