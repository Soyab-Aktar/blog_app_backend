import express from "express";
import { postRouter } from "./modules/posts/post.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors';
import { commentRouter } from "./modules/comments/comment.routes";
import errorHandler from "./middleware/golbalErrorHandler";
import { notFound } from "./middleware/notFound";

const app = express();
app.use(cors({
  origin: process.env.APP_URL || "http://localhost:4000",
  credentials: true
}))

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use('/posts', postRouter);
app.use('/comments', commentRouter);



app.get('/', (req, res) => {
  res.send("Hello, Welcome To Blog App")
})

app.use(notFound);
app.use(errorHandler);

export default app;