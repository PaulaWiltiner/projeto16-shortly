import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import urlRouter from "./routes/urlRouter.js";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.use(userRouter, urlRouter);

app.listen(process.env.PORT, () => {
  console.log("server running ", process.env.PORT);
});
