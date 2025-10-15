import { Router } from "express";
import authUsersRoutes from "./routes/authUsersRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import postRoutes from "./routes/postRoutes.js";
const router = Router();
// Routes spécifiques
router.use("/auth", authUsersRoutes);
router.use("/users", usersRoutes);
router.use("/", postRoutes);
// Route par défaut en dernier (optionnel)
router.get("/", (req, res) => {
    res.json({ message: "API Reddit-like - Server is running" });
});
export default router;
