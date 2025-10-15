import AuthUser from "../models/authUsersModels.js";
export const authMiddleware = async (req, res, next) => {
    try {
        // ⚠️ Récupère le token depuis les headers
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new Error("No token provided");
        }
        const token = authHeader.split(" ")[1];
        // 🔍 Vérifie si ce token correspond à un utilisateur
        const user = await AuthUser.findOne({ token });
        if (!user) {
            throw new Error("Invalid token");
        }
        // ✅ Attache l’utilisateur à la requête
        req.user = user;
        next(); // passe à la suite
    }
    catch (error) {
        res.status(401).send({ Success: false, error: error.message });
    }
};
