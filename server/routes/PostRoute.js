import express from 'express';
import {
    createPost,
    deletePost,
    updatePost,
    getUserPosts,
    getAllPosts,
    toggleLike,
    getPostById,
    searchPosts
} from '../controllers/PostController.js';
import verifyToken from '../middlewares/Authorization.js';

const router = express.Router();


router.use(verifyToken);


router.post('/', createPost);


router.get('/', getAllPosts);


router.get('/search', searchPosts);


router.get('/user', getUserPosts);


router.get('/:postId', getPostById);

router.put('/:postId', updatePost);


router.delete('/:postId', deletePost);


router.post('/:postId/like', toggleLike);

export default router;
