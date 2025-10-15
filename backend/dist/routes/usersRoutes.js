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
// GET - récupérer un utilisateur par son ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await AuthUser.findById(id);
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
// POST - créer un nouvel utilisateur
router.post("/", async (req, res) => {
    try {
        const { firstName, lastName, description, email, password, username, avatar, } = req.body;
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await AuthUser.findOne({
            $or: [{ email }, { username }],
        });
        if (existingUser) {
            return res.status(400).json({
                error: "Un utilisateur avec cet email ou nom d'utilisateur existe déjà",
            });
        }
        const newUser = new AuthUser({
            firstName,
            lastName,
            description,
            email,
            password,
            username,
            avatar,
            posts: [],
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch (err) {
        res.status(500).json({
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
// PUT - modifier un utilisateur
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const updatedUser = await AuthUser.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedUser) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        res.json(updatedUser);
    }
    catch (err) {
        res.status(500).json({
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
// DELETE - supprimer un utilisateur
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await AuthUser.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        res.json({ message: "Utilisateur supprimé avec succès" });
    }
    catch (err) {
        res.status(500).json({
            error: err instanceof Error ? err.message : String(err),
        });
    }
});
export default router;
