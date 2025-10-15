import mongoose from 'mongoose';
import { PostSchema } from './postModels';
const AuthUserSchema = new mongoose.Schema({
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    description: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    username: { type: String, require: true },
    avatar: { type: String, require: true },
    karma: { type: String, require: false },
    role: { type: String, require: true, default: 'USER' },
    posts: [PostSchema],
});
const AuthUser = mongoose.model('AuthUser', AuthUserSchema);
export default AuthUser;
