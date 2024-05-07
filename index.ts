import express, { Express } from "express";
import authRoute from "@/routes/auth.route";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const api = express.Router();
app.use("/api/v1", api);
api.use("/auth", authRoute);

app.use((req, res) => {
  res.status(404).json({
    message: "Not found",
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
