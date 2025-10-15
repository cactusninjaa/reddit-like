import { Router } from "express";
import AuthUser from "../models/authUsersModels.js";

const router = Router();

// GET - récupérer tous les posts de tous les utilisateurs
router.get("/posts", async (req, res) => {
  try {
    // Récupérer tous les utilisateurs avec leurs posts
    const users = await AuthUser.find({}, "username avatar posts");

    // Extraire tous les posts avec les infos de l'utilisateur
    const allPosts: any[] = [];
    users.forEach((user) => {
      user.posts.forEach((post) => {
        allPosts.push({
          ...post.toObject(),
          author: user.username,
          authorAvatar: user.avatar,
          userId: user._id,
        });
      });
    });

    res.json(allPosts);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

// GET - récupérer les posts d'un utilisateur par son ID
router.get("/users/:id/posts", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await AuthUser.findById(id, "username avatar posts");
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Formater les posts avec les infos de l'utilisateur
    const userPosts = user.posts.map((post) => ({
      ...post.toObject(),
      author: user.username,
      authorAvatar: user.avatar,
      userId: user._id,
    }));

    res.json(userPosts);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

// GET - récupérer un post spécifique avec ses commentaires
router.get("/users/:userId/posts/:postId", async (req, res) => {
  const { userId, postId } = req.params;
  try {
    const user = await AuthUser.findById(userId, "username avatar posts");
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const post = user.posts.id(postId);
    if (!post) {
      return res.status(404).json({ error: "Post non trouvé" });
    }

    const postWithAuthor = {
      ...post.toObject(),
      author: user.username,
      authorAvatar: user.avatar,
      userId: user._id,
    };

    res.json(postWithAuthor);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

// POST - créer un nouveau post pour un utilisateur
router.post("/users/:userId/posts", async (req, res) => {
  const { userId } = req.params;
  const { title, description, picture } = req.body;

  try {
    const user = await AuthUser.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const newPost = {
      title,
      description,
      picture,
      comments: [],
    };

    user.posts.push(newPost);
    await user.save();

    const savedPost = user.posts[user.posts.length - 1];
    const postWithAuthor = {
      ...savedPost.toObject(),
      author: user.username,
      authorAvatar: user.avatar,
      userId: user._id,
    };

    res.status(201).json(postWithAuthor);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

// POST - ajouter un commentaire à un post
router.post("/users/:userId/posts/:postId/comments", async (req, res) => {
  const { userId, postId } = req.params;
  const { content } = req.body;

  try {
    const user = await AuthUser.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const post = user.posts.id(postId);
    if (!post) {
      return res.status(404).json({ error: "Post non trouvé" });
    }

    const newComment = { content };
    post.comments.push(newComment);
    await user.save();

    const savedComment = post.comments[post.comments.length - 1];
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

export default router;
