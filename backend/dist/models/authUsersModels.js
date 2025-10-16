import mongoose from 'mongoose';
import { PostSchema } from './postModels.js';
const AuthUserSchema = new mongoose.Schema({
    firstName: { type: String, require: true, unique: true },
    lastName: { type: String, require: true },
    description: { type: String, require: false },
    email: { type: String, require: true },
    password: { type: String, require: true },
    username: { type: String, require: true },
    avatar: { type: String, require: false },
    karma: { type: String, require: false },
    role: { type: String, require: true, default: 'USER' },
    token: { type: String, require: false },
    tokenExpiresAt: { type: Date, require: false },
    posts: [PostSchema],
});
const AuthUser = mongoose.model('AuthUser', AuthUserSchema);
export default AuthUser;
