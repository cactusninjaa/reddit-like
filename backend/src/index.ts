import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes.js";
import AuthUser from "./models/authUsersModels.js";

dotenv.config();
const app = express();
app.use(cors());
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI environment variable is not defined");
}
mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ Connecté à MongoDB Atlas"))
  .catch((err) => console.error("❌ Erreur MongoDB:", err));
const PORT = process.env.PORT;
// Middleware pour parser le JSON
app.use(express.json());

// Utiliser les routes
app.use("/api", router);

app.listen(PORT, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on https://localhost:${PORT}`);
});
export default app;
