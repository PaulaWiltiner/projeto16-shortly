import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import customersRouter from "./routes/customersRouter.js";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.use(customersRouter);

app.listen(process.env.PORT, () => {
  console.log("server running ", process.env.PORT);
});
