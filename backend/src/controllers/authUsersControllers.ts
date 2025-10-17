import { Request, Response } from "express"
import { Document } from "mongoose"
import bcrypt from "bcrypt"
import AuthUser from "../models/authUsersModels.js"
import { randomBytes } from "crypto"

type CommentBody = {
    contents: string;
}

type PostsBody = {
    title: string;
    description: string;
    picture?: string;
    comments: CommentBody[]
}

type SignUpBody = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "USER" | "ADMIN";
    username: string;
    avatar: string;
    karma?: string;
    posts: PostsBody[];
    token?: string;
    tokenExpiresAt: Date,
}

type LoginBody = {
    email: string;
    password: string;
}

export const login = async (req: Request, res: Response) => {
    try {
        const body: LoginBody = req.body

        if (!body) throw new Error("Request body is missing");

        if (!body.email || !body.password) {
            throw new Error("Please fill all fields")
        }

        const user = await AuthUser.findOne({ email: body.email }) as SignUpBody & Document

        if (!user) throw new Error("Invalid email")

        const isSamePassword = await bcrypt.compare(body.password, user.password);

        if (!isSamePassword) throw new Error("Invalid password")
        
        const token = randomBytes(32).toString("hex");
        const expiresInHours = 1; // par ex. token valable 1 heure
        const expirationDate = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

        user.token = token;
        user.tokenExpiresAt = expirationDate;
        await user.save();

        res.status(200).send({
            success: true,
            token: user.token,
            expiresAt: user.tokenExpiresAt,
        });    
    } catch (error: any) {
        console.log(error)
        res.status(400).send({  Success : false, error: error.message })    
    }
}

export const signup = async (req: Request, res: Response) => {
  try {
    console.log("🟢 Body reçu:", req.body);

    const body: SignUpBody = req.body;

    if (!body) throw new Error("Request body is missing");

    const { firstName, lastName, email, password, username } = body;

    if (!firstName || !lastName || !email || !password || !username) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    const existingEmail = await AuthUser.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    const existingUsername = await AuthUser.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: "Username already taken" });
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    const authuser = await AuthUser.create({
        firstName,
        lastName,
        email,
        password: hashPassword,
        role: body.role,
        username,
        avatar: body.avatar,
        karma: body.karma,
        posts: body.posts,
    });

    return res.status(201).json({ success: true, user: authuser });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const logout = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("No token provided");
    }

    const token = authHeader.split(" ")[1];

    const user = await AuthUser.findOne({ token });
    if (!user) throw new Error("Invalid token");

    user.token = undefined;
    await user.save();

    res.status(200).send({ Success: true, message: "Utilisateur déconnecté" });
  } catch (error: any) {
    res.status(400).send({ Success: false, error: error.message });
  }
};

