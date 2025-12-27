import app from "./app";
import { prisma } from "./lib/prisma"

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log("DataBase Connected ...");
    app.listen(PORT, () => {
      console.log(`Surver Running on Port : ${PORT}`)
    })
  } catch (err) {
    console.error("Error : ", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main()