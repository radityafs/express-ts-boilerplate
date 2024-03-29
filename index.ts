import express, { Express } from "express";
import config from "./src/config/config.json";
import database from "./src/database/mysql.database";
import authRoute from "./src/routes/auth.route";

const app: Express = express();
const port = config.PORT;

app.use(express.json());
database.init();

const api = express.Router();
app.use("/api/v1", api);
api.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
