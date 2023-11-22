import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "node:path";

import { catchAllError, notFound } from "./middlewares/errors";
import authRoutes from "./routes/auth";
import postsRoutes from "./routes/posts";

const app = express();

// enable CORS
app.use(cors());
// process cookies
app.use(cookieParser());
// process incoming data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// add public directory
app.use(express.static(path.resolve("public")));

// routes
app.use((req, _res, next) => {
  console.log({ body: req.body, cookies: req.cookies, params: req.params });
  next();
});
app.use(authRoutes);
app.use("/posts", postsRoutes);

// error middlewares
app.use(notFound);
app.use(catchAllError);

export default app;
