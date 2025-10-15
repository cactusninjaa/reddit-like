import AuthUser from "../models/authUsersModels.js";
export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new Error("No token provided");
        }
        const token = authHeader.split(" ")[1];
        const user = await AuthUser.findOne({ token });
        if (!user) {
            throw new Error("Invalid token");
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).send({ Success: false, error: error.message });
    }
};
