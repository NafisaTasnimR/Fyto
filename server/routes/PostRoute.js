import express from 'express';
import {
    createPost,
    deletePost,
    updatePost,
    getUserPosts,
    getAllPosts,
    toggleLike,
    getPostById
} from '../controllers/PostController.js';
import verifyToken from '../middlewares/Authorization.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Create a new post
router.post('/', createPost);

// Get all posts (with pagination)
router.get('/', getAllPosts);

// Get user's posts (created or liked)
router.get('/user', getUserPosts);

// Get a single post by ID
router.get('/:postId', getPostById);

// Update a post
router.put('/:postId', updatePost);

// Delete a post
router.delete('/:postId', deletePost);

// Toggle like on a post
router.post('/:postId/like', toggleLike);

export default router;
