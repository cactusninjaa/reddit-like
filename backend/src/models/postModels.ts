import mongoose from "mongoose"
import { CommentSchema } from "./commentsModels"

export const PostSchema = new mongoose.Schema({
    title: { type: String, require: true },
    description: { type: String, require: true },
    picture: { type: String, require: false },
    comments: [ CommentSchema ]
})