import express, { Express } from "express";
import { AuthRoute, LocaleRoute } from "@/routes/index.route";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

app.use("/public", express.static("public"));

const api = express.Router();
app.use("/api/v1", api);

api.use("/auth", AuthRoute);
api.use("/locale", LocaleRoute);

app.use((req, res) => {
  res.status(404).json({
    message: "Not found",
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
