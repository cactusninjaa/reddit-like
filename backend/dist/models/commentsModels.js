import mongoose from "mongoose";
export const CommentSchema = new mongoose.Schema({
    content: { type: String, require: true },
});
