import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// routes
import userRoutes from "./routes/user.js";
import transactionRoutes from "./routes/transaction.js";
import categoryRoutes from "./routes/category.js";
import accountRoutes from "./routes/account.js";
import { verifyUser } from "./middleware/userValidator.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    app.listen(port, () => {
      console.log("Server started successfully");
    });
  })
  .catch(() => {
    console.log("Some error occured");
  });

const corsConfig = {
  credentials: true,
  origin: true,
};

app.use(cors(corsConfig))
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.send("HELLO WORLD");
});

app.use("/auth", userRoutes);

app.use(verifyUser);

app.use("/transactions", transactionRoutes);
app.use("/categories", categoryRoutes);
app.use("/accounts", accountRoutes);
