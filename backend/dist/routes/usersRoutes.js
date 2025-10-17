import { Router } from "express";
import AuthUser from "../models/authUsersModels.js";
const router = Router();
// GET - récupérer tous les utilisateurs
router.get("/", async (req, res) => {
    try {
        const users = await AuthUser.find();
        res.json(users);
    }
    catch (err) {
        res.status(500).json({
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
// GET - récupérer un utilisateur par son token
router.get("/:token", async (req, res) => {
    const { token } = req.params;
    try {
        const user = await AuthUser.findOne({ token: token });
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).json({
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
router.get("/id/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await AuthUser.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).json({
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
export default router;
