import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const app = express();
app.use(cors());
const mongoUri = process.env.MONGO_URI || 3000;
if (!mongoUri) {
    throw new Error("MONGO_URI environment variable is not defined");
}
mongoose
    .connect(mongoUri)
    .then(() => console.log("✅ Connecté à MongoDB Atlas"))
    .catch((err) => console.error("❌ Erreur MongoDB:", err));
const PORT = process.env.PORT;
app.get("/", (req, res) => {
    res.send("The sedulous hyena ate the antelope!");
});
app.listen(PORT, (err) => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on https://localhost:${PORT}`);
});
export default app;
