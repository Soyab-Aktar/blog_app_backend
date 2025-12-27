import express from "express";

const app = express();

app.get('/', (req, res) => {
  res.send("Hello Lets Learn Prisma")
})

export default app;