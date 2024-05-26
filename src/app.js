import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
