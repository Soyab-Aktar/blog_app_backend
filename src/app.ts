import express from "express";
import { postRouter } from "./modules/posts/post.routes";

const app = express();

app.use(express.json());
app.use('/posts', postRouter);


app.get('/', (req, res) => {
  res.send("Hello Lets Learn Prisma")
})


export default app;