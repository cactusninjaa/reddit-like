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
    avatar?: string;
    karma?: string;
    posts: PostsBody[];
    token?: string;
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

        user.token = token
        user.save()

        res.status(200).send({ Success : true, token: user.token })
    } catch (error: any) {
        console.log(error)
        res.status(400).send({  Success : false, error: error.message })    
    }
}

export const signup = (req: Request, res: Response) => {
    try {
        const body: SignUpBody = req.body;

        if (!body) throw new Error("Request body is missing");


        if (!body.firstName || !body.lastName || !body.email || !body.password || !body.username) {
            throw new Error("Please fill all fields")
        }



        const plainPasword = body.password
        const hashPassword = bcrypt.hashSync(plainPasword, 10)

        const authuser = AuthUser.insertOne({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: hashPassword,
            role: body.role,
            username: body.username,
            avatar: body.avatar,
            karma: body.karma,
            posts: body.posts
        })

        res.status(200).send({ Success : true, authuser })
    } catch (error: any) {
        console.log(error)
        res.status(400).send({  Success : false, error: error.message })
    }
}

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