import cors from "cors";
import express from "express";
import path from "node:path";

import { catchAllError, notFound } from "./middlewares/errors";

const app = express();

// enable CORS
app.use(cors());
// process incoming data
app.use(express.json());
// add public directory
app.use(express.static(path.resolve("public")));

// error middlewares
app.use(notFound);
app.use(catchAllError);

export default app;
